import asyncio
from datetime import datetime
from typing import Dict, Any, List
import re

class DataExfiltrationDetector:
    def __init__(self):
        self.suspicious_activities = []
        self.data_patterns = {
            "credit_card": r'\b(?:\d[ -]*?){13,16}\b',
            "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
            "api_key": r'\b[a-zA-Z0-9]{32,64}\b',
            "private_key": r'-----BEGIN (?:RSA|DSA|EC|OPENSSH) PRIVATE KEY-----'
        }
        
        self.sensitive_keywords = [
            "confidential", "secret", "password", "token", 
            "authorization", "private", "internal"
        ]
    
    async def analyze_content(self, content: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze content for potential data exfiltration"""
        findings = {
            "sensitive_data_found": False,
            "data_types": [],
            "risk_score": 0,
            "patterns_detected": []
        }
        
        # Check for structured sensitive data
        for data_type, pattern in self.data_patterns.items():
            if re.search(pattern, content, re.IGNORECASE):
                findings["sensitive_data_found"] = True
                findings["data_types"].append(data_type)
                findings["risk_score"] += 0.3
                findings["patterns_detected"].append(f"{data_type}_pattern")
        
        # Check for sensitive keywords
        keyword_matches = []
        for keyword in self.sensitive_keywords:
            if keyword.lower() in content.lower():
                keyword_matches.append(keyword)
                findings["risk_score"] += 0.1
        
        if keyword_matches:
            findings["patterns_detected"].extend([f"keyword_{k}" for k in keyword_matches])
        
        # Adjust risk based on context
        if metadata.get('destination', '').endswith(('.onion', '.tor')):
            findings["risk_score"] += 0.4
            findings["patterns_detected"].append("suspicious_destination")
        
        if metadata.get('protocol') in ['FTP', 'TFTP']:
            findings["risk_score"] += 0.2
            findings["patterns_detected"].append("insecure_protocol")
        
        # Cap risk score at 1.0
        findings["risk_score"] = min(findings["risk_score"], 1.0)
        
        # Determine threat level
        if findings["risk_score"] >= 0.7:
            findings["threat_level"] = "high"
        elif findings["risk_score"] >= 0.4:
            findings["threat_level"] = "medium"
        else:
            findings["threat_level"] = "low"
        
        findings["timestamp"] = datetime.utcnow().isoformat()
        
        return findings
    
    async def log_suspicious_activity(self, activity_data: Dict[str, Any]):
        """Log suspicious activity for investigation"""
        activity_entry = {
            "activity_id": f"act_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
            "timestamp": datetime.utcnow().isoformat(),
            **activity_data
        }
        
        self.suspicious_activities.append(activity_entry)
        
        # Keep only last 50 activities
        if len(self.suspicious_activities) > 50:
            self.suspicious_activities = self.suspicious_activities[-50:]
    
    def get_recent_activities(self, count: int = 10) -> List[Dict[str, Any]]:
        """Get recent suspicious activities"""
        return self.suspicious_activities[-count:] if self.suspicious_activities else []