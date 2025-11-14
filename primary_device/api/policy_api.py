from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List

from core.policy_enforcer import PolicyEnforcer
from models.schemas import PolicyConfig

router = APIRouter()
policy_enforcer = PolicyEnforcer()

@router.get("/policies")
async def get_policies():
    """Get all security policies"""
    try:
        policies = policy_enforcer.get_policies()
        return {
            "policies": policies,
            "total_count": len(policies),
            "active_count": len([p for p in policies if p["enabled"]])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get policies: {str(e)}")

@router.post("/policies")
async def create_policy(policy: PolicyConfig):
    """Create new security policy"""
    try:
        policy_data = policy.dict()
        policy_id = await policy_enforcer.add_policy(policy_data)
        
        return {
            "success": True,
            "policy_id": policy_id,
            "message": "Policy created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create policy: {str(e)}")

@router.put("/policies/{policy_id}")
async def update_policy(policy_id: str, updates: Dict[str, Any]):
    """Update existing policy"""
    try:
        success = await policy_enforcer.update_policy(policy_id, updates)
        
        if not success:
            raise HTTPException(status_code=404, detail="Policy not found")
        
        return {
            "success": True,
            "message": "Policy updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update policy: {str(e)}")

@router.get("/policies/enforcement-log")
async def get_enforcement_log(limit: int = 50):
    """Get policy enforcement log"""
    try:
        log_entries = policy_enforcer.get_enforcement_log(limit)
        return {
            "entries": log_entries,
            "total_count": len(log_entries)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get enforcement log: {str(e)}")

@router.post("/policies/evaluate")
async def evaluate_policy(request_data: Dict[str, Any]):
    """Evaluate request against policies"""
    try:
        result = await policy_enforcer.evaluate_request(request_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Policy evaluation failed: {str(e)}")