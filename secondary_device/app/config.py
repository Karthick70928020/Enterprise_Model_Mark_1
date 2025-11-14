import os
from pydantic_settings import BaseSettings
from typing import List

class SecondaryConfig(BaseSettings):
    # Server Configuration
    host: str = "localhost"
    port: int = 8001
    debug: bool = True
    
    # Security
    secret_key: str = "your-secondary-secret-key-change-in-production"
    algorithm: str = "HS256"
    
    # Database
    database_url: str = "sqlite:///./secondary_device.db"
    
    # Crypto Configuration
    private_key_path: str = "./keys/private_key.pem"
    public_key_path: str = "./keys/public_key.pem"
    totp_secret: str = "BASE32SECRET3232"
    
    # Key Management
    key_rotation_days: int = 30
    backup_key_path: str = "./backup_keys/"
    
    # Audit Trail
    audit_trail_path: str = "./secure_storage/audit_trail.json"
    max_audit_blocks: int = 100000
    
    class Config:
        env_file = ".env"

config = SecondaryConfig()