import asyncio
from datetime import datetime
from typing import Dict, Any, List
import hashlib
import json

class AuditManager:
    def __init__(self):
        self.audit_events = []
        self.audit_config = {
            "retention_days": 365,
            "max_events": 100000,
            "compression_enabled": True
        }
        
    async def log_audit_event(self, event_data: Dict[str, Any]) -> str:
        """Log an audit event"""
        event_id = f"audit_{len(self.audit_events) + 1:08d}"
        
        audit_event = {
            "event_id": event_id,
            "timestamp": datetime.utcnow().isoformat(),
            "event_type": event_data.get("event_type", "system_event"),
            "user": event_data.get("user", "system"),
            "action": event_data.get("action", "unknown"),
            "resource": event_data.get("resource", ""),
            "status": event_data.get("status", "success"),
            "details": event_data.get("details", {}),
            "ip_address": event_data.get("ip_address", ""),
            "user_agent": event_data.get("user_agent", ""),
            "signature_required": event_data.get("signature_required", False),
            "compliance_category": event_data.get("compliance_category", "operational")
        }
        
        # Add cryptographic hash for integrity
        audit_event["event_hash"] = self._calculate_event_hash(audit_event)
        
        self.audit_events.append(audit_event)
        
        # Maintain size limit
        if len(self.audit_events) > self.audit_config["max_events"]:
            self.audit_events = self.audit_events[-self.audit_config["max_events"]:]
        
        return event_id
    
    def _calculate_event_hash(self, event: Dict[str, Any]) -> str:
        """Calculate hash of audit event"""
        # Exclude event_hash from calculation
        event_data = {k: v for k, v in event.items() if k != "event_hash"}
        event_str = json.dumps(event_data, sort_keys=True, default=str)
        return hashlib.sha256(event_str.encode()).hexdigest()
    
    async def log_security_event(self, severity: str, description: str, metadata: Dict[str, Any] = None) -> str:
        """Log a security-specific audit event"""
        event_data = {
            "event_type": "security_event",
            "user": "security_system",
            "action": "security_alert",
            "resource": "security_monitor",
            "status": "detected",
            "details": {
                "severity": severity,
                "description": description,
                "metadata": metadata or {}
            },
            "compliance_category": "security"
        }
        
        return await self.log_audit_event(event_data)
    
    async def log_crypto_operation(self, operation: str, key_fingerprint: str, status: str, details: Dict[str, Any] = None) -> str:
        """Log a cryptographic operation"""
        event_data = {
            "event_type": "crypto_operation",
            "user": "crypto_system",
            "action": operation,
            "resource": f"key_{key_fingerprint}",
            "status": status,
            "details": details or {},
            "signature_required": True,
            "compliance_category": "cryptographic"
        }
        
        return await self.log_audit_event(event_data)
    
    def search_audit_events(self, filters: Dict[str, Any] = None, limit: int = 100) -> List[Dict[str, Any]]:
        """Search audit events with filters"""
        if not filters:
            return self.audit_events[-limit:] if self.audit_events else []
        
        filtered_events = []
        for event in reversed(self.audit_events):  # Search from most recent
            if self._matches_filters(event, filters):
                filtered_events.append(event)
                if len(filtered_events) >= limit:
                    break
        
        return filtered_events
    
    def _matches_filters(self, event: Dict[str, Any], filters: Dict[str, Any]) -> bool:
        """Check if event matches all filters"""
        for key, value in filters.items():
            if key not in event:
                return False
            
            if isinstance(value, list):
                if event[key] not in value:
                    return False
            else:
                if event[key] != value:
                    return False
        
        return True
    
    def get_audit_stats(self) -> Dict[str, Any]:
        """Get audit statistics"""
        event_types = {}
        users = {}
        status_counts = {}
        
        for event in self.audit_events:
            # Count by event type
            event_type = event.get("event_type", "unknown")
            event_types[event_type] = event_types.get(event_type, 0) + 1
            
            # Count by user
            user = event.get("user", "unknown")
            users[user] = users.get(user, 0) + 1
            
            # Count by status
            status = event.get("status", "unknown")
            status_counts[status] = status_counts.get(status, 0) + 1
        
        return {
            "total_events": len(self.audit_events),
            "events_by_type": event_types,
            "events_by_user": users,
            "events_by_status": status_counts,
            "first_event": self.audit_events[0]["timestamp"] if self.audit_events else None,
            "last_event": self.audit_events[-1]["timestamp"] if self.audit_events else None
        }
    
    def get_recent_events(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent audit events"""
        return self.audit_events[-limit:] if self.audit_events else []