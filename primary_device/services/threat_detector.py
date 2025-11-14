import asyncio
from datetime import datetime
from typing import Dict, Any, List
import hashlib

class ThreatDetector:
    def __init__(self):
        self.detected_threats = []
        self.threat_signatures = {
            "data_exfiltration": {
                "patterns": ["large_outbound", "encrypted_stream", "off_hours"],
                "risk": "high"
            },
            "port_scanning": {
                "patterns": ["multiple_ports", "sequential_ports", "short_interval"],
                "risk": "medium"
            },
            "brute_force": {
                "patterns": ["repeated_failures", "multiple_users", "short_timeframe"],
                "risk": "high"
            },
            "phishing_attempt": {
                "patterns": ["suspicious_domain", "credential_request", "urgent_language"],
                "risk": "medium"
            }
        }
    
    async def analyze_behavior(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze behavior for potential threats"""
        threat_score = 0
        detected_patterns = []
        
        # Analyze for data exfiltration
        if self._check_data_exfiltration(event_data):
            threat_score += 0.7
            detected_patterns.append("data_exfiltration")
        
        # Analyze for port scanning
        if self._check_port_scanning(event_data):
            threat_score += 0.5
            detected_patterns.append("port_scanning")
        
        # Analyze for brute force
        if self._check_brute_force(event_data):
            threat_score += 0.8
            detected_patterns.append("brute_force")
        
        # Determine threat level
        if threat_score >= 0.7:
            threat_level = "high"
        elif threat_score >= 0.4:
            threat_level = "medium"
        else:
            threat_level = "low"
        
        return {
            "threat_score": round(threat_score, 2),
            "threat_level": threat_level,
            "detected_patterns": detected_patterns,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def _check_data_exfiltration(self, event_data: Dict[str, Any]) -> bool:
        """Check for data exfiltration patterns"""
        # Simulate data exfiltration detection
        import random
        return random.random() < 0.1  # 10% chance for demo
    
    def _check_port_scanning(self, event_data: Dict[str, Any]) -> bool:
        """Check for port scanning patterns"""
        # Simulate port scanning detection
        import random
        return random.random() < 0.15  # 15% chance for demo
    
    def _check_brute_force(self, event_data: Dict[str, Any]) -> bool:
        """Check for brute force patterns"""
        # Simulate brute force detection
        import random
        return random.random() < 0.08  # 8% chance for demo
    
    async def log_threat(self, threat_data: Dict[str, Any]):
        """Log detected threat"""
        threat_entry = {
            "threat_id": hashlib.md5(str(threat_data).encode()).hexdigest()[:8],
            "timestamp": datetime.utcnow().isoformat(),
            **threat_data
        }
        
        self.detected_threats.append(threat_entry)
        
        # Keep only last 100 threats
        if len(self.detected_threats) > 100:
            self.detected_threats = self.detected_threats[-100:]
    
    def get_recent_threats(self, count: int = 10) -> List[Dict[str, Any]]:
        """Get recent detected threats"""
        return self.detected_threats[-count:] if self.detected_threats else []
    
    def get_threat_stats(self) -> Dict[str, Any]:
        """Get threat detection statistics"""
        threat_levels = {}
        for threat in self.detected_threats:
            level = threat.get('threat_level', 'unknown')
            threat_levels[level] = threat_levels.get(level, 0) + 1
        
        return {
            "total_threats": len(self.detected_threats),
            "threats_by_level": threat_levels,
            "last_detection": self.detected_threats[-1]["timestamp"] if self.detected_threats else None
        }