from typing import Dict, Any, Optional
from fastapi import HTTPException
from fastapi.responses import JSONResponse

class CustomHTTPException(HTTPException):
    """Custom HTTP exception with additional details"""
    
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: Optional[str] = None,
        additional_info: Optional[Dict[str, Any]] = None
    ):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code
        self.additional_info = additional_info or {}

def create_error_response(
    status_code: int,
    message: str,
    error_code: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None
) -> JSONResponse:
    """Create standardized error response"""
    content = {
        "error": {
            "code": error_code or "UNKNOWN_ERROR",
            "message": message,
            "details": details or {}
        }
    }
    return JSONResponse(status_code=status_code, content=content)