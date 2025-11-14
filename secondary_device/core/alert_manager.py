import asyncio
from datetime import datetime
from typing import Dict, Any, List
from enum import Enum

class AlertSeverity(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AlertManager:
    def __init__(self):
        self.alerts = []
        self.alert_rules = self._initialize_alert_rules()
        self.alert_stats = {
            "total_alerts": 0,
            "alerts_by_severity": {},
            "active_alerts": 0
        }
        
    def _initialize_alert_rules(self) -> List[Dict[str, Any]]:
        """Initialize alert rules"""
        return [
            {
                "id": "alert_001",
                "name": "Cryptographic Failure",
                "severity": AlertSeverity.HIGH.value,
                "condition": "signature_verification_failed",
                "threshold": 1,
                "enabled": True
            },
            {
                "id": "alert_002",
                "name": "Audit Trail Tampering",
                "severity": AlertSeverity.CRITICAL.value,
                "condition": "chain_integrity_failed",
                "threshold": 1,
                "enabled": True
            },
            {
                "id": "alert_003",
                "name": "Key Rotation Overdue",
                "severity": AlertSeverity.MEDIUM.value,
                "condition": "key_rotation_overdue",
                "threshold": 7,  # days
                "enabled": True
            },
            {
                "id": "alert_004",
                "name": "TOTP System Failure",
                "severity": AlertSeverity.HIGH.value,
                "condition": "totp_system_failed",
                "threshold": 1,
                "enabled": True
            }
        ]
    
    async def initialize(self):
        """Initialize alert manager"""
        print("Alert manager initialized")
    
    async def create_alert(self, alert_data: Dict[str, Any]) -> str:
        """Create a new alert"""
        alert_id = f"alert_{len(self.alerts) + 1:06d}"
        
        alert = {
            "alert_id": alert_id,
            "timestamp": datetime.utcnow().isoformat(),
            "severity": alert_data.get("severity", AlertSeverity.MEDIUM.value),
            "title": alert_data.get("title", "Unknown Alert"),
            "description": alert_data.get("description", ""),
            "source": alert_data.get("source", "system"),
            "metadata": alert_data.get("metadata", {}),
            "status": "active",
            "acknowledged": False
        }
        
        self.alerts.append(alert)
        
        # Update statistics
        self.alert_stats["total_alerts"] += 1
        self.alert_stats["active_alerts"] += 1
        
        severity = alert["severity"]
        self.alert_stats["alerts_by_severity"][severity] = \
            self.alert_stats["alerts_by_severity"].get(severity, 0) + 1
        
        print(f"🚨 Alert Created: {alert['title']} (Severity: {alert['severity']})")
        
        return alert_id
    
    async def check_system_alerts(self, system_status: Dict[str, Any]) -> List[str]:
        """Check for system-wide alerts"""
        triggered_alerts = []
        
        # Check cryptographic health
        crypto_health = system_status.get("crypto_health", {})
        if not crypto_health.get("key_initialized", False):
            alert_id = await self.create_alert({
                "severity": AlertSeverity.CRITICAL.value,
                "title": "Cryptographic System Failure",
                "description": "Cryptographic keys are not initialized",
                "source": "signature_engine",
                "metadata": crypto_health
            })
            triggered_alerts.append(alert_id)
        
        # Check audit trail health
        audit_health = system_status.get("audit_health", {})
        if not audit_health.get("integrity_verified", True):
            alert_id = await self.create_alert({
                "severity": AlertSeverity.CRITICAL.value,
                "title": "Audit Trail Compromised",
                "description": "Audit trail integrity verification failed",
                "source": "audit_trail",
                "metadata": audit_health
            })
            triggered_alerts.append(alert_id)
        
        return triggered_alerts
    
    async def acknowledge_alert(self, alert_id: str) -> bool:
        """Acknowledge an alert"""
        for alert in self.alerts:
            if alert["alert_id"] == alert_id and alert["status"] == "active":
                alert["acknowledged"] = True
                alert["acknowledged_at"] = datetime.utcnow().isoformat()
                return True
        return False
    
    async def resolve_alert(self, alert_id: str) -> bool:
        """Resolve an alert"""
        for alert in self.alerts:
            if alert["alert_id"] == alert_id and alert["status"] == "active":
                alert["status"] = "resolved"
                alert["resolved_at"] = datetime.utcnow().isoformat()
                self.alert_stats["active_alerts"] -= 1
                return True
        return False
    
    def get_active_alerts(self) -> List[Dict[str, Any]]:
        """Get active alerts"""
        return [alert for alert in self.alerts if alert["status"] == "active"]
    
    def get_recent_alerts(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent alerts"""
        return self.alerts[-limit:] if self.alerts else []
    
    def get_alert_stats(self) -> Dict[str, Any]:
        """Get alert statistics"""
        return self.alert_stats.copy()
    
    async def cleanup_old_alerts(self, days: int = 30):
        """Clean up alerts older than specified days"""
        from datetime import timedelta
        
        cutoff_time = datetime.utcnow() - timedelta(days=days)
        original_count = len(self.alerts)
        
        self.alerts = [
            alert for alert in self.alerts
            if datetime.fromisoformat(alert["timestamp"]) > cutoff_time
        ]
        
        removed_count = original_count - len(self.alerts)
        if removed_count > 0:
            print(f"Cleaned up {removed_count} old alerts")