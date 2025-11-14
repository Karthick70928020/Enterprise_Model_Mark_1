import asyncio
from datetime import datetime
from typing import Dict, Any, List
from enum import Enum

class PolicyAction(Enum):
    ALLOW = "allow"
    BLOCK = "block" 
    QUARANTINE = "quarantine"
    LOG = "log"

class PolicyEnforcer:
    def __init__(self):
        self.policies = self._load_default_policies()
        self.enforcement_log = []
        
    def _load_default_policies(self) -> List[Dict[str, Any]]:
        """Load default security policies"""
        return [
            {
                "id": "policy_001",
                "name": "Data Loss Prevention",
                "action": PolicyAction.BLOCK.value,
                "conditions": {
                    "data_sensitivity": "high",
                    "destination": "external"
                },
                "enabled": True
            },
            {
                "id": "policy_002",
                "name": "Zero Trust Access",
                "action": PolicyAction.QUARANTINE.value,
                "conditions": {
                    "trust_score": "low",
                    "resource_sensitivity": "high"
                },
                "enabled": True
            },
            {
                "id": "policy_003",
                "name": "Suspicious Activity",
                "action": PolicyAction.LOG.value,
                "conditions": {
                    "behavior_anomaly": "high"
                },
                "enabled": True
            }
        ]
    
    async def evaluate_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate request against policies"""
        applicable_policies = []
        
        for policy in self.policies:
            if not policy["enabled"]:
                continue
                
            if await self._matches_conditions(request_data, policy["conditions"]):
                applicable_policies.append(policy)
        
        # Determine final action (most restrictive policy wins)
        final_action = PolicyAction.ALLOW.value
        if any(p["action"] == PolicyAction.BLOCK.value for p in applicable_policies):
            final_action = PolicyAction.BLOCK.value
        elif any(p["action"] == PolicyAction.QUARANTINE.value for p in applicable_policies):
            final_action = PolicyAction.QUARANTINE.value
        elif any(p["action"] == PolicyAction.LOG.value for p in applicable_policies):
            final_action = PolicyAction.LOG.value
        
        # Log enforcement decision
        log_entry = await self._log_enforcement(
            request_data, final_action, applicable_policies
        )
        
        return {
            "action": final_action,
            "applicable_policies": [p["id"] for p in applicable_policies],
            "timestamp": datetime.utcnow().isoformat(),
            "log_id": log_entry["log_id"]
        }
    
    async def _matches_conditions(self, request_data: Dict[str, Any], conditions: Dict[str, Any]) -> bool:
        """Check if request matches policy conditions"""
        # Simplified condition matching for demo
        import random
        return random.random() < 0.2  # 20% chance of match
    
    async def _log_enforcement(self, request_data: Dict[str, Any], action: str, policies: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Log policy enforcement decision"""
        log_entry = {
            "log_id": f"policy_log_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
            "timestamp": datetime.utcnow().isoformat(),
            "request_type": request_data.get("type", "unknown"),
            "action": action,
            "policies_applied": [p["id"] for p in policies],
            "resource": request_data.get("resource", "unknown")
        }
        
        self.enforcement_log.append(log_entry)
        
        # Keep only recent logs
        if len(self.enforcement_log) > 1000:
            self.enforcement_log = self.enforcement_log[-1000:]
        
        return log_entry
    
    async def add_policy(self, policy: Dict[str, Any]) -> str:
        """Add new security policy"""
        policy_id = f"policy_{len(self.policies) + 1:03d}"
        policy["id"] = policy_id
        self.policies.append(policy)
        return policy_id
    
    async def update_policy(self, policy_id: str, updates: Dict[str, Any]) -> bool:
        """Update existing policy"""
        for policy in self.policies:
            if policy["id"] == policy_id:
                policy.update(updates)
                return True
        return False
    
    def get_policies(self) -> List[Dict[str, Any]]:
        """Get all policies"""
        return self.policies.copy()
    
    def get_enforcement_log(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent enforcement logs"""
        return self.enforcement_log[-limit:] if self.enforcement_log else []