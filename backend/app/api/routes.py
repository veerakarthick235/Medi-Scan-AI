"""
API Routes for MediScan AI
Handles triage assessment submissions and medical knowledge queries
"""

from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
import logging
import asyncio
import time
from io import BytesIO

logger = logging.getLogger(__name__)

router = APIRouter()


# Pydantic models for request/response validation
class TriageRequest(BaseModel):
    """Triage assessment request"""
    text_description: str = Field(..., min_length=10, max_length=5000)
    patient_id: Optional[str] = None
    clinic_id: Optional[str] = None


class TriageResponse(BaseModel):
    """Triage assessment response"""
    preliminary_diagnosis: str
    urgency_level: str  # LOW, MEDIUM, HIGH
    confidence_score: float = Field(..., ge=0, le=1)
    reasoning: str
    recommended_actions: List[str]
    processing_time: float
    assessment_id: Optional[str] = None


class MedicalKnowledgeRequest(BaseModel):
    """Medical knowledge search request"""
    query: str = Field(..., min_length=5, max_length=1000)
    symptoms: Optional[List[str]] = None
    limit: int = Field(10, ge=1, le=50)


class MedicalKnowledgeResponse(BaseModel):
    """Medical knowledge search response"""
    relevant_conditions: List[dict]
    medical_references: List[dict]
    search_time: float


class FeedbackRequest(BaseModel):
    """Feedback on assessment accuracy"""
    assessment_id: str
    actual_diagnosis: Optional[str] = None
    was_helpful: bool = False
    clinician_notes: Optional[str] = None


@router.post("/triage", response_model=TriageResponse)
async def submit_triage_assessment(
    text_description: str = Form(...),
    image: Optional[UploadFile] = File(None),
    audio: Optional[UploadFile] = File(None),
    patient_id: Optional[str] = Form(None),
    clinic_id: Optional[str] = Form(None)
):
    """
    Submit a patient for triage assessment.
    
    Accepts multimodal input: text symptoms, medical images, and audio recordings.
    All processing occurs locally with zero external transmission.
    
    Returns:
    - Preliminary diagnosis
    - Urgency level (LOW/MEDIUM/HIGH)
    - Confidence score
    - Clinical reasoning
    - Recommended actions
    """
    start_time = time.time()
    
    try:
        logger.info(f"Received triage request for patient {patient_id}")
        
        # Import processors here to avoid circular imports
        from app.main import (
            get_image_processor, 
            get_audio_processor,
            get_knowledge_base,
            get_triage_assistant,
            get_triage_scorer
        )
        
        # Initialize processors
        image_processor = get_image_processor()
        audio_processor = get_audio_processor()
        knowledge_base = get_knowledge_base()
        triage_assistant = get_triage_assistant()
        triage_scorer = get_triage_scorer()
        
        # 1. Process image if provided
        visual_findings = None
        visual_features = None
        if image:
            try:
                image_data = await image.read()
                image_bytes = BytesIO(image_data)
                visual_findings, visual_features = image_processor.analyze_image(
                    image_bytes
                )
                logger.info(f"Image analysis complete: {visual_findings}")
            except Exception as e:
                logger.warning(f"Image processing failed: {str(e)}")
        
        # 2. Process audio if provided
        audio_findings = None
        audio_features = None
        if audio:
            try:
                audio_data = await audio.read()
                audio_bytes = BytesIO(audio_data)
                audio_findings, audio_features = audio_processor.analyze_audio(
                    audio_bytes
                )
                logger.info(f"Audio analysis complete: {audio_findings}")
            except Exception as e:
                logger.warning(f"Audio processing failed: {str(e)}")
        
        # 3. Search medical knowledge base
        retrieved_knowledge = knowledge_base.search_similar_conditions(
            symptoms=[text_description],
            visual_features=visual_features,
            audio_features=audio_features
        )
        
        # 4. Generate medical context and LLM assessment
        context = triage_assistant.create_medical_context(
            symptoms_text=text_description,
            visual_findings=visual_findings or "No visual examination data",
            audio_findings=audio_findings or "No audio examination data",
            retrieved_knowledge=retrieved_knowledge
        )
        
        # 5. Generate triage assessment using LLM
        llm_output = triage_assistant.generate_triage_assessment(context)
        assessment = triage_assistant.extract_structured_output(llm_output)
        
        # 6. Calculate urgency score
        urgency_level, urgency_score = triage_scorer.calculate_urgency_level(
            symptoms=text_description,
            visual_severity=visual_findings,
            audio_indicators=audio_findings,
            llm_assessment=assessment
        )
        
        # 7. Generate action recommendations
        recommended_actions = triage_scorer.generate_action_recommendations(
            urgency_level=urgency_level,
            diagnosis=assessment.get("preliminary_diagnosis", "")
        )
        
        processing_time = time.time() - start_time
        
        response = TriageResponse(
            preliminary_diagnosis=assessment.get(
                "preliminary_diagnosis", 
                "Unable to determine diagnosis"
            ),
            urgency_level=urgency_level,
            confidence_score=float(assessment.get("confidence_score", 0.5)),
            reasoning=assessment.get(
                "reasoning",
                "Assessment based on provided symptoms and available examination data"
            ),
            recommended_actions=recommended_actions,
            processing_time=processing_time,
            assessment_id=None  # Could be generated if storing results
        )
        
        logger.info(
            f"Assessment complete - Urgency: {urgency_level}, "
            f"Confidence: {response.confidence_score:.2%}, "
            f"Time: {processing_time:.2f}s"
        )
        
        return response
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Triage assessment failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Assessment failed. Please ensure all inputs are valid."
        )


@router.post("/knowledge/search", response_model=MedicalKnowledgeResponse)
async def search_medical_knowledge(request: MedicalKnowledgeRequest):
    """
    Search medical knowledge base for relevant conditions and references.
    
    Returns:
    - Relevant conditions with descriptions
    - Medical references and guidelines
    - Search execution time
    """
    start_time = time.time()
    
    try:
        from app.main import get_knowledge_base
        knowledge_base = get_knowledge_base()
        
        # Search knowledge base
        conditions = knowledge_base.search_similar_conditions(
            symptoms=request.symptoms or [request.query],
            limit=request.limit
        )
        
        references = knowledge_base.retrieve_clinical_context(
            condition_ids=[c.get("id") for c in conditions[:3]]
        )
        
        search_time = time.time() - start_time
        
        return MedicalKnowledgeResponse(
            relevant_conditions=conditions,
            medical_references=references,
            search_time=search_time
        )
        
    except Exception as e:
        logger.error(f"Knowledge search failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Knowledge search failed"
        )


@router.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    """
    Submit feedback on assessment accuracy for model improvement.
    
    This data is stored locally for quality improvement purposes.
    """
    try:
        logger.info(
            f"Feedback received for assessment {request.assessment_id}: "
            f"helpful={request.was_helpful}"
        )
        
        # TODO: Store feedback in local database for analysis
        # This would be used to improve the model over time
        
        return {
            "status": "success",
            "message": "Feedback recorded successfully",
            "assessment_id": request.assessment_id
        }
        
    except Exception as e:
        logger.error(f"Feedback submission failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Feedback submission failed"
        )


@router.get("/assessment-history")
async def get_assessment_history(patient_id: Optional[str] = None, limit: int = 50):
    """
    Retrieve assessment history from local storage.
    
    Returns:
    - List of previous assessments
    - Metadata about each assessment
    """
    try:
        # TODO: Retrieve from local database
        # This would query the local assessment history
        
        return {
            "assessments": [],
            "total": 0,
            "note": "Local database integration required"
        }
        
    except Exception as e:
        logger.error(f"History retrieval failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="History retrieval failed"
        )
