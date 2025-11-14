from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, cast

from core.log_verifier import LogVerifier
from services.verification_service import VerificationService

router = APIRouter()
log_verifier = LogVerifier()
verification_service = VerificationService()

@router.post("/verify/signature")
async def verify_signature(verification_data: Dict[str, Any]):
    """Verify a digital signature"""
    try:
        data = verification_data.get("data")
        signature = verification_data.get("signature")
        public_key = verification_data.get("public_key")
        
        if not all([data, signature, public_key]):
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        result = await log_verifier.verify_signature_integrity(
            {"signature": signature, "data_to_verify": data},
            cast(str, public_key)
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signature verification failed: {str(e)}")

@router.post("/verify/chain")
async def verify_chain_integrity(log_chain: List[Dict[str, Any]]):
    """Verify log chain integrity"""
    try:
        if not log_chain:
            raise HTTPException(status_code=400, detail="Empty log chain provided")
        
        result = await verification_service.verify_log_chain(log_chain)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chain verification failed: {str(e)}")

@router.post("/verify/batch")
async def batch_verify(verification_requests: List[Dict[str, Any]]):
    """Batch verify multiple requests"""
    try:
        results = await cast(Any, verification_service).batch_verify(verification_requests)
        
        return {
            "results": results,
            "total_requests": len(verification_requests),
            "timestamp": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch verification failed: {str(e)}")

@router.get("/verify/stats")
async def get_verification_stats():
    """Get verification statistics"""
    try:
        stats = cast(Any, verification_service).get_verification_stats()
        log_stats = log_verifier.get_verification_stats()
        
        return {
            "verification_service": stats,
            "log_verifier": log_stats,
            "overall_success_rate": round(
                (stats["successful_verifications"] + log_stats["successful_verifications"]) /
                (stats["total_verifications"] + log_stats["total_verifications"]), 3
            ) if (stats["total_verifications"] + log_stats["total_verifications"]) > 0 else 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get verification stats: {str(e)}")