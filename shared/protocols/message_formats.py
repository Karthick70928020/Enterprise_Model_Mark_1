from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

class WebSocketMessage(BaseModel):
    type: str
    data: Dict[str, Any]
    timestamp: datetime
    device: str

class RealTimeAlert(BaseModel):
    alert_id: str
    severity: str
    message: str
    timestamp: datetime
    metadata: Dict[str, Any]

class SystemMetrics(BaseModel):
    cpu_usage: float
    memory_usage: float
    network_throughput: float
    active_threats: int
    timestamp: datetime