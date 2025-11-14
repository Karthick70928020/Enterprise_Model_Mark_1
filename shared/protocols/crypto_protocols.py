from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime

class KeyGenerationRequest(BaseModel):
    key_size: int = 2048
    algorithm: str = "RSA"
    expiration_days: int = 30

class KeyGenerationResponse(BaseModel):
    public_key: str
    fingerprint: str
    generated_at: datetime
    expires_at: datetime

class SignatureVerificationRequest(BaseModel):
    data: str
    signature: str
    public_key: str

class SignatureVerificationResponse(BaseModel):
    verified: bool
    timestamp: datetime
    algorithm: str