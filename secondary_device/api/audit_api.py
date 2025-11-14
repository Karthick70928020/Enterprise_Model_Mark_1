from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, Optional

from core.audit_manager import AuditManager
from services.audit_trail_manager import AuditTrailManager
from services.compliance_reporter import ComplianceReporter

router = APIRouter()
audit_manager = AuditManager()
audit_trail_manager = AuditTrailManager()
compliance_reporter = ComplianceReporter()

@router.get("/audit/events")
async def get_audit_events(limit: int = 100, filters: Optional[Dict[str, Any]] = None):
    """Get audit events"""
    try:
        events = audit_manager.get_recent_events(limit)
        
        if filters:
            events = audit_manager.search_audit_events(filters, limit)
        
        return {
            "events": events,
            "total_count": len(events),
            "stats": audit_manager.get_audit_stats()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get audit events: {str(e)}")

@router.get("/audit/trail")
async def get_audit_trail(limit: int = 100, query: Optional[Dict[str, Any]] = None):
    """Get audit trail blocks"""
    try:
        if query:
            blocks = await audit_trail_manager.search_audit_trail(query, limit)
        else:
            trail_info = await audit_trail_manager.get_audit_trail_info()
            blocks = await audit_trail_manager.search_audit_trail({}, limit)
        
        return {
            "blocks": blocks,
            "trail_info": await audit_trail_manager.get_audit_trail_info(),
            "integrity": await audit_trail_manager.verify_audit_integrity()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get audit trail: {str(e)}")

@router.get("/compliance/frameworks")
async def get_compliance_frameworks():
    """Get supported compliance frameworks"""
    try:
        frameworks = await compliance_reporter.get_supported_frameworks()
        
        return {
            "frameworks": frameworks,
            "total_count": len(frameworks)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get compliance frameworks: {str(e)}")

@router.post("/compliance/report")
async def generate_compliance_report(report_request: Dict[str, Any]):
    """Generate compliance report"""
    try:
        framework = report_request.get("framework", "nist_800_53")
        period_days = report_request.get("period_days", 30)
        
        report = await compliance_reporter.generate_compliance_report(framework, period_days)
        
        if "error" in report:
            raise HTTPException(status_code=400, detail=report["error"])
        
        return report
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate compliance report: {str(e)}")

@router.get("/compliance/insurance")
async def generate_insurance_report(period_days: int = 90):
    """Generate insurance compliance report"""
    try:
        report = await compliance_reporter.generate_insurance_report(period_days)
        
        return report
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate insurance report: {str(e)}")