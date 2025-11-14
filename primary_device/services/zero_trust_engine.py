import asyncio
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from enum import Enum

class TrustLevel(Enum):
    HIGH = "high"
    MEDIUM = "medium" 
    LOW = "low"
    UNTRUSTED = "untrusted"

class ZeroTrustEngine:
    def __init__(self):
        self.device_profiles = {}
        self.user_sessions = {}
        self.access_policies = self._initialize_policies()
        
    def _initialize_policies(self) -> List[Dict[str, Any]]:
        """Initialize zero trust policies"""
        return [
            {
                "id": "policy_001",
                "name": "Device Health Check",
                "requirements": ["device_encryption", "antivirus", "firewall"],
                "weight": 0.3
            },
            {
                "id": "policy_002",
                "name": "User Behavior Analysis", 
                "requirements": ["normal_working_hours", "typical_access_patterns"],
                "weight": 0.4
            },
            {
                "id": "policy_003",
                "name": "Network Context",
                "requirements": ["trusted_network", "vpn_connection"],
                "weight": 0.3
            }
        ]
    
    async def evaluate_access_request(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate access request using zero trust principles"""
        device_trust = await self._evaluate_device_trust(request.get("device_id"))
        user_trust = await self._evaluate_user_trust(request.get("user_id"))
        context_trust = await self._evaluate_context_trust(request)
        
        # Calculate overall trust score
        trust_score = (
            device_trust["score"] * 0.4 +
            user_trust["score"] * 0.4 + 
            context_trust["score"] * 0.2
        )
        
        # Determine trust level
        if trust_score >= 0.8:
            trust_level = TrustLevel.HIGH.value
            access_granted = True
        elif trust_score >= 0.6:
            trust_level = TrustLevel.MEDIUM.value
            access_granted = True
        elif trust_score >= 0.4:
            trust_level = TrustLevel.LOW.value
            access_granted = False  # Require additional verification
        else:
            trust_level = TrustLevel.UNTRUSTED.value
            access_granted = False
        
        return {
            "access_granted": access_granted,
            "trust_level": trust_level,
            "trust_score": round(trust_score, 3),
            "components": {
                "device_trust": device_trust,
                "user_trust": user_trust,
                "context_trust": context_trust
            },
            "timestamp": datetime.utcnow().isoformat(),
            "request_id": request.get("request_id")
        }
    
    async def _evaluate_device_trust(self, device_id: Optional[str]) -> Dict[str, Any]:
        """Evaluate device trustworthiness (device_id may be None)"""
        # Accept None for device_id and simulate device trust evaluation
        import random
        score = random.uniform(0.7, 0.95)
        
        return {
            "score": score,
            "factors": ["encryption_enabled", "antivirus_updated", "firewall_active"],
            "last_seen": datetime.utcnow().isoformat()
        }
    
    async def _evaluate_user_trust(self, user_id: Optional[str]) -> Dict[str, Any]:
        """Evaluate user trustworthiness (user_id may be None)"""
        # Accept None for user_id and simulate user trust evaluation
        import random
        score = random.uniform(0.6, 0.9)
        
        return {
            "score": score,
            "factors": ["normal_behavior", "recent_authentication", "access_patterns"],
            "session_duration": "2 hours"
        }
    
    async def _evaluate_context_trust(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate context trustworthiness"""
        # Simulate context evaluation
        import random
        score = random.uniform(0.5, 0.85)
        
        return {
            "score": score,
            "factors": ["trusted_network", "normal_access_time", "geolocation_consistent"],
            "network_type": "corporate"
        }
    
    async def enforce_least_privilege(self, user_id: str, resource: str) -> List[str]:
        """Enforce least privilege access"""
        # Define access permissions based on roles
        role_permissions = {
            "admin": ["read", "write", "execute", "delete"],
            "user": ["read", "execute"],
            "guest": ["read"]
        }
        
        # Simulate role assignment
        user_role = "user"  # Default role
        
        return role_permissions.get(user_role, ["read"])
    
    async def log_access_decision(self, decision: Dict[str, Any]):
        """Log access decision for audit"""
        print(f"🔐 Zero Trust Decision: {decision}")