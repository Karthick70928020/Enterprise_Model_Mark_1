from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

class DeviceType(str, Enum):
    PRIMARY = "primary"
    SECONDARY = "secondary"

class ThreatLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium" 
    HIGH = "high"
    CRITICAL = "critical"

class SystemStatus(BaseModel):
    status: str
    threat_level: ThreatLevel
    active_connections: int
    blocked_threats: int
    system_health: float

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

class ThreatAlert(BaseModel):
    alert_id: str
    timestamp: datetime
    threat_level: ThreatLevel
    description: str
    source_ip: Optional[str]
    target_ip: Optional[str]
    protocol: Optional[str]
    evidence: Dict[str, Any]

class AuditBlock(BaseModel):
    block_type: str
    timestamp: datetime
    previous_hash: str
    block_hash: str
    data: Dict[str, Any]

class HealthCheckResponse(BaseModel):
    status: str
    service: str
    timestamp: datetime
    components: Dict[str, str]