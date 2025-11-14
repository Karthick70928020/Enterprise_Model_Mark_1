import asyncio
from datetime import datetime
from typing import Dict, Any, List
import hashlib
import json

class LogGenerator:
    def __init__(self):
        self.log_buffer = []
        self.log_sequence = 0
        
    async def generate_security_log(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate security log entry"""
        self.log_sequence += 1
        
        log_entry = {
            "log_id": f"sec_log_{self.log_sequence:08d}",
            "timestamp": datetime.utcnow().isoformat(),
            "sequence": self.log_sequence,
            "event_type": event_data.get("type", "security_event"),
            "severity": event_data.get("severity", "info"),
            "source": event_data.get("source", "unknown"),
            "description": event_data.get("description", ""),
            "details": event_data.get("details", {}),
            "previous_hash": self._get_previous_hash(),
            "data_hash": self._calculate_data_hash(event_data)
        }
        
        # Calculate log hash
        log_entry["log_hash"] = self._calculate_log_hash(log_entry)
        
        # Add to buffer
        self.log_buffer.append(log_entry)
        
        # Maintain buffer size
        if len(self.log_buffer) > 10000:
            self.log_buffer = self.log_buffer[-10000:]
        
        return log_entry
    
    def _get_previous_hash(self) -> str:
        """Get hash of previous log entry"""
        if not self.log_buffer:
            return "0" * 64  # Genesis hash
        
        return self.log_buffer[-1]["log_hash"]
    
    def _calculate_data_hash(self, data: Dict[str, Any]) -> str:
        """Calculate hash of event data"""
        data_str = json.dumps(data, sort_keys=True)
        return hashlib.sha256(data_str.encode()).hexdigest()
    
    def _calculate_log_hash(self, log_entry: Dict[str, Any]) -> str:
        """Calculate hash of log entry"""
        # Exclude log_hash from calculation
        log_data = {k: v for k, v in log_entry.items() if k != "log_hash"}
        log_str = json.dumps(log_data, sort_keys=True)
        return hashlib.sha256(log_str.encode()).hexdigest()
    
    async def generate_audit_log(self, user: str, action: str, resource: str, status: str) -> Dict[str, Any]:
        """Generate audit log entry"""
        event_data = {
            "type": "audit",
            "severity": "info", 
            "source": user,
            "description": f"User {user} performed {action} on {resource}",
            "details": {
                "user": user,
                "action": action,
                "resource": resource,
                "status": status,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        return await self.generate_security_log(event_data)
    
    def get_recent_logs(self, count: int = 100) -> List[Dict[str, Any]]:
        """Get recent log entries"""
        return self.log_buffer[-count:] if self.log_buffer else []
    
    def get_log_stats(self) -> Dict[str, Any]:
        """Get log generation statistics"""
        severity_counts = {}
        for log in self.log_buffer:
            severity = log.get("severity", "unknown")
            severity_counts[severity] = severity_counts.get(severity, 0) + 1
        
        return {
            "total_logs": len(self.log_buffer),
            "sequence_number": self.log_sequence,
            "severity_distribution": severity_counts,
            "last_log_time": self.log_buffer[-1]["timestamp"] if self.log_buffer else None
        }