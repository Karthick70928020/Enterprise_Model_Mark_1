from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PaginatedResponse(BaseModel):
    page: int
    page_size: int
    total_items: int
    total_pages: int
    items: List[Dict[str, Any]]

class HealthCheckResponse(BaseModel):
    status: str
    service: str
    timestamp: datetime
    version: str
    uptime: float

class ErrorResponse(BaseModel):
    error: str
    code: str
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)