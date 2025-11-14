from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class KeyAlgorithm(str, Enum):
    RSA_2048 = "RSA-2048"
    RSA_4096 = "RSA-4096"
    ECDSA_P256 = "ECDSA-P256"
    ECDSA_P384 = "ECDSA-P384"

class KeyUsage(str, Enum):
    SIGNING = "signing"
    ENCRYPTION = "encryption"
    VERIFICATION = "verification"

class SignatureRequest(BaseModel):
    log_hash: str
    previous_hash: str
    timestamp: datetime
    device_id: str
    totp_code: Optional[str] = "000000"

class SignatureResponse(BaseModel):
    signature: str
    signed_at: datetime
    public_key: str
    algorithm: str = "RSA-PSS-SHA256"

class VerificationRequest(BaseModel):
    data: str
    signature: str
    public_key: str

class VerificationResponse(BaseModel):
    verified: bool
    timestamp: datetime
    algorithm: str
    error: Optional[str] = None

class KeyInfo(BaseModel):
    key_id: str
    algorithm: KeyAlgorithm
    key_size: int
    created_at: datetime
    expires_at: Optional[datetime]
    usage: KeyUsage
    is_active: bool

class AuditBlock(BaseModel):
    block_hash: str
    block_type: str
    timestamp: datetime
    previous_hash: str
    data_hash: str
    log_data: Dict[str, Any]
    signature_info: Dict[str, Any]
    description: str