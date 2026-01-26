"""
MediScan AI - Privacy-First Multimodal Triage Assistant
Main FastAPI application entry point
"""

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from datetime import datetime
import time

from app.api.routes import router
from app.models.llm_engine import TriageAssistant
from app.knowledge.vector_db import MedicalKnowledgeBase
from app.processors.image_processor import ImageProcessor
from app.processors.audio_processor import AudioProcessor
from app.models.triage_scorer import TriageScorer
from app.utils.config import get_settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize settings
settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title="MediScan AI",
    description="Privacy-first multimodal triage assistant for rural clinics",
    version="1.0.0"
)

# CORS middleware - Only allow local network connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model instances
_image_processor = None
_audio_processor = None
_triage_assistant = None
_knowledge_base = None
_triage_scorer = None


def get_image_processor():
    """Lazy load image processor"""
    global _image_processor
    if _image_processor is None:
        logger.info("Initializing ImageProcessor...")
        _image_processor = ImageProcessor()
    return _image_processor


def get_audio_processor():
    """Lazy load audio processor"""
    global _audio_processor
    if _audio_processor is None:
        logger.info("Initializing AudioProcessor...")
        _audio_processor = AudioProcessor()
    return _audio_processor


def get_triage_assistant():
    """Lazy load triage assistant"""
    global _triage_assistant
    if _triage_assistant is None:
        logger.info("Initializing TriageAssistant...")
        _triage_assistant = TriageAssistant()
    return _triage_assistant


def get_knowledge_base():
    """Lazy load medical knowledge base"""
    global _knowledge_base
    if _knowledge_base is None:
        logger.info("Initializing MedicalKnowledgeBase...")
        _knowledge_base = MedicalKnowledgeBase()
        _knowledge_base.initialize_knowledge_base()
    return _knowledge_base


def get_triage_scorer():
    """Lazy load triage scorer"""
    global _triage_scorer
    if _triage_scorer is None:
        logger.info("Initializing TriageScorer...")
        _triage_scorer = TriageScorer()
    return _triage_scorer


@app.on_event("startup")
async def startup_event():
    """Initialize models on startup"""
    logger.info("MediScan AI starting up...")
    # Optionally pre-load models
    if settings.preload_models:
        logger.info("Pre-loading models...")
        get_image_processor()
        get_audio_processor()
        get_triage_assistant()
        get_knowledge_base()
    logger.info("Startup complete")


@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown"""
    logger.info("MediScan AI shutting down...")


@app.get("/")
async def root():
    """Health check and info endpoint"""
    return {
        "name": "MediScan AI",
        "version": "1.0.0",
        "status": "operational",
        "privacy_notice": "All data processing is local. Zero data transmission to external servers.",
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "components": {
            "api": "operational",
            "models": "ready",
            "storage": "operational"
        }
    }


# Include API routes
app.include_router(router, prefix="/api", tags=["triage"])


# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        app,
        host=settings.host,
        port=settings.port,
        workers=1,  # Single worker for local processing
        log_level="info"
    )
