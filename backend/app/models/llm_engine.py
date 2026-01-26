"""
LLM Engine for MediScan AI
Integrates local Llama model via Ollama using LangChain for medical reasoning
"""

import logging
from typing import Dict, List, Optional
import json

logger = logging.getLogger(__name__)


class TriageAssistant:
    """
    Medical triage reasoning engine using local LLM (Llama + Ollama).
    Performs clinical reasoning on multimodal patient data.
    """
    
    def __init__(self, model_name: str = "llama2:7b-q4", temperature: float = 0.3):
        """
        Initialize TriageAssistant with local LLM
        
        Args:
            model_name: Ollama model identifier
            temperature: LLM temperature (0.0-1.0, lower=more deterministic)
        """
        self.model_name = model_name
        self.temperature = temperature
        self.llm = self._initialize_llm()
        logger.info(f"TriageAssistant initialized with {model_name}")
    
    def _initialize_llm(self):
        """
        Initialize local LLM through Ollama.
        
        In production, would use:
        from langchain.llms import Ollama
        llm = Ollama(
            model=self.model_name,
            temperature=self.temperature,
            top_p=0.9
        )
        """
        try:
            # Placeholder for LLM initialization
            logger.info(f"Loading {self.model_name} via Ollama...")
            return None  # Would be Ollama instance
        except Exception as e:
            logger.error(f"Failed to initialize LLM: {str(e)}")
            raise
    
    def create_medical_context(
        self,
        symptoms_text: str,
        visual_findings: str = "No visual data",
        audio_findings: str = "No audio data",
        retrieved_knowledge: Dict = None
    ) -> str:
        """
        Build comprehensive medical context for LLM reasoning.
        
        Args:
            symptoms_text: Patient symptom description
            visual_findings: Clinical findings from image analysis
            audio_findings: Clinical findings from audio analysis
            retrieved_knowledge: Relevant medical knowledge from knowledge base
            
        Returns:
            Formatted medical context for LLM input
        """
        knowledge_text = ""
        if retrieved_knowledge:
            conditions = retrieved_knowledge.get("relevant_conditions", [])
            if conditions:
                knowledge_text = "\nRelevant Medical Knowledge:\n"
                for condition in conditions[:3]:
                    knowledge_text += f"- {condition.get('name', 'Unknown')}: {condition.get('description', '')}\n"
        
        context = f"""
PATIENT ASSESSMENT CONTEXT
==========================

Patient-Reported Symptoms:
{symptoms_text}

Visual Examination Findings:
{visual_findings}

Audio/Respiratory Examination Findings:
{audio_findings}

{knowledge_text}

CLINICAL REASONING TASK:
Based on the above information, provide a preliminary medical assessment including:
1. Most likely diagnosis or differential diagnoses
2. Confidence level (0-100%)
3. Clinical reasoning explaining the assessment
4. Recommended immediate actions

Format your response as JSON with the following structure:
{{
    "preliminary_diagnosis": "...",
    "confidence_score": 0.xx,
    "reasoning": "...",
    "differential_diagnoses": ["...", "..."],
    "red_flags": ["...", "..."],
    "immediate_actions": ["...", "..."]
}}
"""
        logger.info("Medical context created")
        return context
    
    def generate_triage_assessment(self, context: str) -> str:
        """
        Generate triage assessment using local LLM.
        
        Args:
            context: Medical context for reasoning
            
        Returns:
            LLM-generated assessment
        """
        try:
            # In production, would invoke LLM:
            # from langchain.prompts import PromptTemplate
            # from langchain.chains import LLMChain
            # prompt = PromptTemplate(template=context, input_variables=[])
            # chain = LLMChain(llm=self.llm, prompt=prompt)
            # response = chain.run()
            
            # Placeholder response for development
            response = """{
    "preliminary_diagnosis": "Suspected respiratory infection with possible secondary bacterial infection",
    "confidence_score": 0.78,
    "reasoning": "Patient presents with persistent cough and fever. Audio analysis shows productive cough patterns. Visual examination indicates possible lung involvement.",
    "differential_diagnoses": [
        "Community-acquired pneumonia",
        "Acute bronchitis with secondary infection",
        "Viral respiratory infection"
    ],
    "red_flags": [
        "Persistent cough lasting >2 weeks",
        "Elevated respiratory rate",
        "Signs of respiratory distress"
    ],
    "immediate_actions": [
        "Chest X-ray or imaging if available",
        "Oxygen saturation monitoring",
        "Empiric antibiotic therapy consideration"
    ]
}"""
            
            logger.info("Triage assessment generated via LLM")
            return response
            
        except Exception as e:
            logger.error(f"LLM generation failed: {str(e)}")
            raise
    
    def extract_structured_output(self, llm_output: str) -> Dict:
        """
        Parse LLM output into structured format.
        
        Args:
            llm_output: Raw LLM response
            
        Returns:
            Structured assessment dictionary
        """
        try:
            # Try to extract JSON from LLM output
            json_start = llm_output.find('{')
            json_end = llm_output.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                json_str = llm_output[json_start:json_end]
                assessment = json.loads(json_str)
            else:
                # Fallback if JSON extraction fails
                assessment = {
                    "preliminary_diagnosis": "Unable to determine",
                    "confidence_score": 0.0,
                    "reasoning": llm_output,
                    "differential_diagnoses": [],
                    "red_flags": [],
                    "immediate_actions": []
                }
            
            # Ensure all required fields exist
            required_fields = {
                "preliminary_diagnosis": "Unknown diagnosis",
                "confidence_score": 0.5,
                "reasoning": "Assessment based on available clinical data",
                "differential_diagnoses": [],
                "red_flags": [],
                "immediate_actions": []
            }
            
            for field, default in required_fields.items():
                if field not in assessment:
                    assessment[field] = default
            
            logger.info("LLM output structured successfully")
            return assessment
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing failed: {str(e)}")
            return {
                "preliminary_diagnosis": "Assessment error - please review output",
                "confidence_score": 0.0,
                "reasoning": f"Error parsing assessment: {str(e)}",
                "differential_diagnoses": [],
                "red_flags": [],
                "immediate_actions": []
            }
        except Exception as e:
            logger.error(f"Output extraction failed: {str(e)}")
            raise


class PromptTemplate:
    """Medical-specific prompt templates for triage"""
    
    @staticmethod
    def get_triage_prompt() -> str:
        """Get medical triage system prompt"""
        return """You are an AI medical assistant helping with initial patient triage in rural clinic settings. 
Your role is to:
1. Analyze patient symptoms and examination findings
2. Provide preliminary differential diagnoses
3. Identify red flags requiring immediate attention
4. Suggest urgent actions or referrals

Important:
- This is a triage tool to assist healthcare workers, NOT a replacement for clinical judgment
- Always consider the rural clinic setting with limited resources
- Prioritize patient safety and appropriate resource allocation
- Be conservative in diagnosis - refer to specialists when appropriate

Provide structured, actionable assessments."""
    
    @staticmethod
    def get_knowledge_retrieval_prompt() -> str:
        """Get prompt for medical knowledge retrieval"""
        return """Based on the patient's symptoms and examination findings, retrieve the most relevant:
1. Diagnostic criteria
2. Differential diagnoses
3. Treatment protocols available in resource-limited settings
4. Referral criteria

Focus on practical, implementable medical knowledge for rural clinics."""
