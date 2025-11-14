import asyncio
from datetime import datetime, timedelta
from typing import Dict, Any, List, Set
from collections import defaultdict

class CorrelationEngine:
    def __init__(self):
        self.events_buffer = []
        self.correlation_rules = self._load_correlation_rules()
        self.suspicious_patterns = set()
        
    def _load_correlation_rules(self) -> List[Dict[str, Any]]:
        """Load correlation rules for threat detection"""
        return [
            {
                "name": "multiple_failed_logins",
                "pattern": "auth_failure",
                "threshold": 5,
                "time_window": 300,  # 5 minutes
                "severity": "high"
            },
            {
                "name": "port_scanning",
                "pattern": "multiple_ports",
                "threshold": 10,
                "time_window": 60,  # 1 minute
                "severity": "medium"
            },
            {
                "name": "data_exfiltration",
                "pattern": "large_outbound",
                "threshold": 3,
                "time_window": 600,  # 10 minutes
                "severity": "critical"
            }
        ]
    
    async def add_event(self, event: Dict[str, Any]):
        """Add event to correlation engine"""
        self.events_buffer.append({
            **event,
            "timestamp": datetime.utcnow()
        })
        
        # Clean old events (keep last hour)
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        self.events_buffer = [
            e for e in self.events_buffer 
            if e["timestamp"] > one_hour_ago
        ]
        
        # Run correlation analysis
        await self._analyze_correlations()
    
    async def _analyze_correlations(self):
        """Analyze events for correlated patterns"""
        for rule in self.correlation_rules:
            await self._check_rule(rule)
    
    async def _check_rule(self, rule: Dict[str, Any]):
        """Check if correlation rule is triggered"""
        time_window = timedelta(seconds=rule["time_window"])
        window_start = datetime.utcnow() - time_window
        
        # Count events matching pattern in time window
        matching_events = [
            e for e in self.events_buffer
            if e["timestamp"] > window_start and rule["pattern"] in str(e)
        ]
        
        if len(matching_events) >= rule["threshold"]:
            await self._trigger_alert(rule, matching_events)
    
    async def _trigger_alert(self, rule: Dict[str, Any], events: List[Dict[str, Any]]):
        """Trigger correlation alert"""
        alert_id = f"corr_alert_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
        
        alert_data = {
            "alert_id": alert_id,
            "timestamp": datetime.utcnow().isoformat(),
            "rule_name": rule["name"],
            "severity": rule["severity"],
            "event_count": len(events),
            "time_window": rule["time_window"],
            "description": f"Correlation rule '{rule['name']}' triggered with {len(events)} events",
            "events_sample": events[:5]  # Include sample of events
        }
        
        # Store pattern for future reference
        self.suspicious_patterns.add(rule["name"])
        
        print(f"🚨 Correlation Alert: {alert_data['description']}")
        return alert_data
    
    def get_correlation_stats(self) -> Dict[str, Any]:
        """Get correlation engine statistics"""
        return {
            "total_events": len(self.events_buffer),
            "active_rules": len(self.correlation_rules),
            "suspicious_patterns": list(self.suspicious_patterns),
            "last_analysis": datetime.utcnow().isoformat()
        }