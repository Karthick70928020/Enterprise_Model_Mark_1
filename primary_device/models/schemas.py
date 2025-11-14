from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

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

class PolicyConfig(BaseModel):
    policy_id: str
    name: str
    description: str
    rules: Dict[str, Any]
    enabled: bool = True

class ThreatReport(BaseModel):
    threat_id: str
    timestamp: datetime
    severity: ThreatLevel
    type: str
    source_ip: Optional[str]
    description: str
    status: str

class LogEntry(BaseModel):
    timestamp: datetime
    event_type: str
    source: str
    severity: str
    description: str
    metadata: Dict[str, Any] = {}

class AIAnalysisResult(BaseModel):
    combined_score: float
    is_anomaly: bool
    autoencoder_result: Dict[str, Any]
    isolation_forest_result: Dict[str, Any]
    timestamp: datetime