from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List

from core.alert_manager import AlertManager

router = APIRouter()
alert_manager = AlertManager()

@router.get("/alerts")
async def get_alerts(active_only: bool = True, limit: int = 50):
    """Get alerts"""
    try:
        if active_only:
            alerts = alert_manager.get_active_alerts()
        else:
            alerts = alert_manager.get_recent_alerts(limit)
        
        return {
            "alerts": alerts,
            "total_count": len(alerts),
            "active_count": len(alert_manager.get_active_alerts()),
            "stats": alert_manager.get_alert_stats()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get alerts: {str(e)}")

@router.post("/alerts")
async def create_alert(alert_data: Dict[str, Any]):
    """Create a new alert"""
    try:
        alert_id = await alert_manager.create_alert(alert_data)
        
        return {
            "success": True,
            "alert_id": alert_id,
            "message": "Alert created successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create alert: {str(e)}")

@router.put("/alerts/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    """Acknowledge an alert"""
    try:
        success = await alert_manager.acknowledge_alert(alert_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Alert not found or already acknowledged")
        
        return {
            "success": True,
            "message": "Alert acknowledged successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to acknowledge alert: {str(e)}")

@router.put("/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: str):
    """Resolve an alert"""
    try:
        success = await alert_manager.resolve_alert(alert_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Alert not found or already resolved")
        
        return {
            "success": True,
            "message": "Alert resolved successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to resolve alert: {str(e)}")

@router.get("/alerts/stats")
async def get_alert_stats():
    """Get alert statistics"""
    try:
        stats = alert_manager.get_alert_stats()
        
        return {
            "statistics": stats,
            "timestamp": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get alert stats: {str(e)}")