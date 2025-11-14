from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List

from core.threat_detector import ThreatDetector
from core.log_generator import LogGenerator

router = APIRouter()
threat_detector = ThreatDetector()
log_generator = LogGenerator()

@router.get("/threats")
async def get_recent_threats(limit: int = 50):
    """Get recent detected threats"""
    try:
        threats = threat_detector.get_recent_threats(limit)
        return {
            "threats": threats,
            "total_count": len(threats),
            "stats": threat_detector.get_analysis_stats()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get threats: {str(e)}")

@router.post("/threats/analyze")
async def analyze_threat(event_data: Dict[str, Any]):
    """Analyze event for threats"""
    try:
        analysis_result = await threat_detector.analyze_event(event_data)
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Threat analysis failed: {str(e)}")

@router.get("/threats/stats")
async def get_threat_stats():
    """Get threat detection statistics"""
    try:
        stats = threat_detector.get_analysis_stats()
        return {
            "statistics": stats,
            "timestamp": "2024-01-01T00:00:00Z"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get threat stats: {str(e)}")

@router.post("/logs/security")
async def create_security_log(event_data: Dict[str, Any]):
    """Create security log entry"""
    try:
        log_entry = await log_generator.generate_security_log(event_data)
        return {
            "success": True,
            "log_entry": log_entry,
            "message": "Security log created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create security log: {str(e)}")

@router.get("/logs/security")
async def get_security_logs(limit: int = 100):
    """Get recent security logs"""
    try:
        logs = log_generator.get_recent_logs(limit)
        return {
            "logs": logs,
            "total_count": len(logs),
            "stats": log_generator.get_log_stats()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get security logs: {str(e)}")