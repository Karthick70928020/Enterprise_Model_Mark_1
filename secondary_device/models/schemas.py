from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class SystemStatus(BaseModel):
    status: str
    security_level: str
    crypto_health: bool
    storage_health: bool
    totp_operational: bool

class CryptoStatus(BaseModel):
    key_initialized: bool
    needs_rotation: bool
    days_since_rotation: int
    totp_initialized: bool
    current_totp_interval: int
    public_key_fingerprint: str

class AuditTrailStatus(BaseModel):
    block_count: int
    integrity_verified: bool
    first_block_time: Optional[datetime]
    last_block_time: Optional[datetime]
    current_chain_hash: str

class SignatureRequest(BaseModel):
    log_hash: str
    previous_hash: str
    timestamp: datetime
    device_id: str
    totp_code: Optional[str] = "000000"  # Demo code

class SignatureResponse(BaseModel):
    signature: str
    signed_at: datetime
    public_key: str