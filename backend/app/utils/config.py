"""
Configuration management for MediScan AI
"""

from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Server configuration
    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("PORT", "8000"))
    
    # Model configuration
    image_model_name: str = "resnet50"
    audio_model_name: str = "librosa"
    llm_model_name: str = "llama2:7b-q4"
    
    # Processing configuration
    image_size: tuple = (224, 224)
    audio_sample_rate: int = 16000
    audio_duration: int = 30  # seconds
    
    # Performance
    preload_models: bool = os.getenv("PRELOAD_MODELS", "false").lower() == "true"
    num_workers: int = 1
    
    # Storage
    data_dir: str = os.getenv("DATA_DIR", "./data")
    models_dir: str = os.getenv("MODELS_DIR", "./models")
    knowledge_db_path: str = os.getenv("KNOWLEDGE_DB", "./data/mediscan_knowledge.db")
    
    # Logging
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Privacy
    store_raw_images: bool = False  # Never store raw images
    store_raw_audio: bool = False  # Never store raw audio
    encrypt_features: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
