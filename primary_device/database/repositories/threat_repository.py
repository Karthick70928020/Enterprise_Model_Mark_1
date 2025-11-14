from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta

class ThreatRepository:
    def __init__(self):
        self.threats = []
        
    def save_threat(self, threat_data: Dict[str, Any]) -> str:
        """Save threat to repository"""
        threat_id = f"threat_{len(self.threats) + 1:06d}"
        threat_data["id"] = threat_id
        threat_data["created_at"] = datetime.utcnow().isoformat()
        
        self.threats.append(threat_data)
        return threat_id
    
    def get_recent_threats(self, hours: int = 24, limit: int = 100) -> List[Dict[str, Any]]:
        """Get recent threats"""
        since = datetime.utcnow() - timedelta(hours=hours)
        
        recent_threats = [
            t for t in self.threats
            if datetime.fromisoformat(t["created_at"]) >= since
        ]
        
        return recent_threats[-limit:] if recent_threats else []
    
    def get_threats_by_severity(self, severity: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Get threats by severity level"""
        filtered = [t for t in self.threats if t.get("severity") == severity]
        return filtered[-limit:] if filtered else []
    
    def get_threat_stats(self, hours: int = 24) -> Dict[str, Any]:
        """Get threat statistics"""
        since = datetime.utcnow() - timedelta(hours=hours)
        recent_threats = [
            t for t in self.threats
            if datetime.fromisoformat(t["created_at"]) >= since
        ]
        
        severity_counts = {}
        for threat in recent_threats:
            severity = threat.get("severity", "unknown")
            severity_counts[severity] = severity_counts.get(severity, 0) + 1
        
        return {
            "total_threats": len(recent_threats),
            "threats_by_severity": severity_counts,
            "time_period_hours": hours
        }