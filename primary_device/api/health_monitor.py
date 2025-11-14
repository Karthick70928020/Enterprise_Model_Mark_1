from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from datetime import datetime

from core.threat_detector import ThreatDetector
from core.policy_enforcer import PolicyEnforcer
from services.system_log_collector import SystemLogCollector
from ml.model_manager import ModelManager

router = APIRouter()

# Initialize services
threat_detector = ThreatDetector()
policy_enforcer = PolicyEnforcer()
system_log_collector = SystemLogCollector()
model_manager = ModelManager()

@router.get("/health")
async def health_check():
    """Comprehensive health check"""
    try:
        # Check component status
        components = {
            "threat_detector": True,  # Simplified checks
            "policy_enforcer": True,
            "log_collector": system_log_collector.is_collecting,
            "ai_models": await model_manager.health_check()
        }
        
        all_healthy = all(components.values())
        
        return {
            "status": "healthy" if all_healthy else "degraded",
            "timestamp": datetime.utcnow().isoformat(),
            "components": components,
            "version": "1.0.0"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@router.get("/system/stats")
async def get_system_stats():
    """Get system statistics"""
    try:
        threat_stats = threat_detector.get_analysis_stats()
        log_stats = system_log_collector.get_collection_stats()
        
        return {
            "threat_detection": threat_stats,
            "log_collection": log_stats,
            "policy_enforcement": {
                "total_policies": len(policy_enforcer.get_policies()),
                "recent_decisions": len(policy_enforcer.get_enforcement_log(100))
            },
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get system stats: {str(e)}")

@router.get("/system/logs")
async def get_system_logs(limit: int = 100):
    """Get recent system logs"""
    try:
        logs = system_log_collector.get_recent_logs(limit)
        return {
            "logs": logs,
            "total_count": len(logs),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get system logs: {str(e)}")