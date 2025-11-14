import re
import asyncio
from datetime import datetime
from typing import Dict, Any, List
from urllib.parse import urlparse

class PhishingDetector:
    def __init__(self):
        self.suspicious_domains = set()
        self.detection_rules = self._initialize_detection_rules()
        
    def _initialize_detection_rules(self) -> List[Dict[str, Any]]:
        """Initialize phishing detection rules"""
        return [
            {
                "name": "suspicious_tld",
                "pattern": r"\.(xyz|top|club|loan|win|tk|ml|ga|cf)$",
                "weight": 0.3
            },
            {
                "name": "ip_address_url",
                "pattern": r"^\d+\.\d+\.\d+\.\d+",
                "weight": 0.7
            },
            {
                "name": "multiple_subdomains",
                "pattern": r"([a-zA-Z0-9-]+\.){3,}",
                "weight": 0.4
            },
            {
                "name": "suspicious_keywords",
                "pattern": r"(login|verify|account|security|update|confirm)",
                "weight": 0.2
            }
        ]
    
    async def analyze_url(self, url: str, email_content: str = "") -> Dict[str, Any]:
        """Analyze URL for phishing indicators"""
        score = 0.0
        triggered_rules = []
        
        # Basic URL validation
        try:
            parsed = urlparse(url)
            if not parsed.scheme or not parsed.netloc:
                score = 1.0  # Invalid URL
                triggered_rules.append("invalid_url_format")
        except Exception:
            score = 1.0
            triggered_rules.append("url_parse_error")
            return self._create_result(url, score, triggered_rules)
        
        # Apply detection rules
        for rule in self.detection_rules:
            if re.search(rule["pattern"], url, re.IGNORECASE):
                score += rule["weight"]
                triggered_rules.append(rule["name"])
        
        # Check domain age (simulated)
        domain_age_risk = await self._check_domain_age(parsed.netloc)
        score += domain_age_risk
        if domain_age_risk > 0:
            triggered_rules.append("new_domain")
        
        # Check email content if provided
        if email_content:
            content_score = self._analyze_email_content(email_content)
            score += content_score
            if content_score > 0:
                triggered_rules.append("suspicious_content")
        
        # Cap score at 1.0
        score = min(score, 1.0)
        
        return self._create_result(url, score, triggered_rules)
    
    async def _check_domain_age(self, domain: str) -> float:
        """Check domain age (simulated)"""
        # In production, this would query domain registration data
        # For demo, return random risk
        import random
        return random.uniform(0, 0.3)
    
    def _analyze_email_content(self, content: str) -> float:
        """Analyze email content for phishing indicators"""
        score = 0.0
        
        phishing_indicators = [
            (r"urgent|immediate|action required", 0.3),
            (r"password.*expir", 0.4),
            (r"click.*here", 0.2),
            (r"account.*suspend", 0.5),
            (r"verify.*identity", 0.4)
        ]
        
        for pattern, weight in phishing_indicators:
            if re.search(pattern, content, re.IGNORECASE):
                score += weight
        
        return min(score, 0.5)  # Cap content score
    
    def _create_result(self, url: str, score: float, triggered_rules: List[str]) -> Dict[str, Any]:
        """Create analysis result"""
        if score >= 0.8:
            threat_level = "critical"
        elif score >= 0.6:
            threat_level = "high"
        elif score >= 0.4:
            threat_level = "medium"
        else:
            threat_level = "low"
        
        return {
            "url": url,
            "phishing_score": round(score, 3),
            "threat_level": threat_level,
            "triggered_rules": triggered_rules,
            "timestamp": datetime.utcnow().isoformat(),
            "recommendation": "block" if score > 0.6 else "monitor"
        }
    
    async def bulk_analyze(self, urls: List[str]) -> List[Dict[str, Any]]:
        """Analyze multiple URLs"""
        results = []
        for url in urls:
            result = await self.analyze_url(url)
            results.append(result)
        return results