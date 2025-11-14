import asyncio
from datetime import datetime
from typing import Dict, Any, List
import hashlib

class ThreatDetector:
    def __init__(self):
        self.detected_threats = []
        self.threat_patterns = self._load_threat_patterns()
        self.analysis_stats = {
            "total_events": 0,
            "threats_detected": 0,
            "false_positives": 0
        }
        
    def _load_threat_patterns(self) -> List[Dict[str, Any]]:
        """Load threat detection patterns"""
        return [
            {
                "name": "data_exfiltration",
                "patterns": ["large_outbound", "encrypted_stream", "off_hours"],
                "risk": "high",
                "weight": 0.8
            },
            {
                "name": "port_scanning", 
                "patterns": ["multiple_ports", "sequential_ports", "short_interval"],
                "risk": "medium",
                "weight": 0.6
            },
            {
                "name": "brute_force",
                "patterns": ["repeated_failures", "multiple_users", "short_timeframe"],
                "risk": "high", 
                "weight": 0.7
            }
        ]
    
    async def initialize(self):
        """Initialize threat detector"""
        print("Threat detector initialized")
    
    async def analyze_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze security event for threats"""
        threat_score = 0.0
        detected_patterns = []
        
        # Analyze event against threat patterns
        for pattern in self.threat_patterns:
            if await self._matches_pattern(event_data, pattern):
                threat_score += pattern["weight"]
                detected_patterns.append(pattern["name"])
        
        # Determine threat level
        if threat_score >= 0.7:
            threat_level = "high"
        elif threat_score >= 0.4:
            threat_level = "medium" 
        else:
            threat_level = "low"
        
        # Update statistics
        self.analysis_stats["total_events"] += 1
        if threat_level in ["high", "medium"]:
            self.analysis_stats["threats_detected"] += 1
        
        result = {
            "threat_score": round(threat_score, 3),
            "threat_level": threat_level,
            "detected_patterns": detected_patterns,
            "timestamp": datetime.utcnow().isoformat(),
            "recommendation": self._get_recommendation(threat_level)
        }
        
        # Log high-level threats
        if threat_level in ["high", "critical"]:
            await self._log_threat(event_data, result)
        
        return result
    
    async def _matches_pattern(self, event_data: Dict[str, Any], pattern: Dict[str, Any]) -> bool:
        """Check if event matches threat pattern"""
        # Simplified pattern matching for demo
        import random
        return random.random() < 0.3  # 30% chance of match
    
    def _get_recommendation(self, threat_level: str) -> str:
        """Get recommendation based on threat level"""
        recommendations = {
            "critical": "Immediate isolation and investigation required",
            "high": "Block and investigate",
            "medium": "Monitor and log", 
            "low": "Normal monitoring"
        }
        return recommendations.get(threat_level, "Normal monitoring")
    
    async def _log_threat(self, event_data: Dict[str, Any], analysis_result: Dict[str, Any]):
        """Log detected threat"""
        threat_id = hashlib.md5(
            f"{event_data}{datetime.utcnow()}".encode()
        ).hexdigest()[:8]
        
        threat_entry = {
            "threat_id": f"threat_{threat_id}",
            "timestamp": datetime.utcnow().isoformat(),
            "event_data": event_data,
            "analysis_result": analysis_result,
            "status": "detected"
        }
        
        self.detected_threats.append(threat_entry)
        
        # Keep only recent threats
        if len(self.detected_threats) > 1000:
            self.detected_threats = self.detected_threats[-1000:]
    
    def get_recent_threats(self, count: int = 10) -> List[Dict[str, Any]]:
        """Get recent detected threats"""
        return self.detected_threats[-count:] if self.detected_threats else []
    
    def get_analysis_stats(self) -> Dict[str, Any]:
        """Get threat analysis statistics"""
        return self.analysis_stats.copy()