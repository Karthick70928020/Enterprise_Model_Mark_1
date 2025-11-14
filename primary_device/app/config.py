import os
from pydantic_settings import BaseSettings
from typing import List

class PrimaryConfig(BaseSettings):
    # Server Configuration
    host: str = "localhost"
    port: int = 8000
    debug: bool = True
    
    # Security
    secret_key: str = "your-primary-secret-key-change-in-production"
    algorithm: str = "HS256"
    
    # Database
    database_url: str = "sqlite:///./primary_device.db"
    
    # API Configuration
    secondary_device_url: str = "http://localhost:8001"
    
    # Logging
    log_level: str = "INFO"
    log_file: str = "primary_device.log"
    
    # AI/ML Configuration
    model_update_interval: int = 3600  # 1 hour
    anomaly_threshold: float = 0.85
    
    class Config:
        env_file = ".env"

config = PrimaryConfig()