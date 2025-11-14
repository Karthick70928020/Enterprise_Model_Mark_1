import asyncio
from datetime import datetime
from typing import Dict, Any, List
import hashlib
import json

class VerificationService:
    def __init__(self):
        self.verification_requests = []
        self.verification_cache = {}
        
    async def initialize(self):
        """Initialize verification service"""
        print("Verification service initialized")
    
    async def verify_log_chain(self, log_chain: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Verify the integrity of a log chain"""
        if not log_chain:
            return {
                "verified": False,
                "error": "Empty log chain provided",
                "timestamp": datetime.utcnow().isoformat()
            }
        
        try:
            # Check chain structure
            if log_chain[0].get("block_type") != "genesis":
                return {
                    "verified": False,
                    "error": "Invalid genesis block",
                    "timestamp": datetime.utcnow().isoformat()
                }
            
            # Verify each block
            previous_hash = "0" * 64
            for i, block in enumerate(log_chain):
                # Verify block hash
                expected_hash = self._calculate_block_hash(block)
                if block.get("block_hash") != expected_hash:
                    return {
                        "verified": False,
                        "error": f"Block {i} hash mismatch",
                        "timestamp": datetime.utcnow().isoformat()
                    }
                
                # Verify chain linkage (except for genesis block)
                if i > 0 and block.get("previous_hash") != previous_hash:
                    return {
                        "verified": False,
                        "error": f"Block {i} chain broken",
                        "timestamp": datetime.utcnow().isoformat()
                    }
                
                previous_hash = block["block_hash"]
            
            # Log verification request
            await self._log_verification_request(log_chain, True)
            
            return {
                "verified": True,
                "chain_length": len(log_chain),
                "first_block": log_chain[0]["timestamp"],
                "last_block": log_chain[-1]["timestamp"],
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            await self._log_verification_request(log_chain, False, str(e))
            return {
                "verified": False,
                "error": f"Verification failed: {str(e)}",
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def _calculate_block_hash(self, block: Dict[str, Any]) -> str:
        """Calculate block hash"""
        # Exclude block_hash from calculation
        block_data = {k: v for k, v in block.items() if k != "block_hash"}
        block_str = json.dumps(block_data, sort_keys=True, default=str)
        return hashlib.sha256(block_str.encode()).hexdigest()
    
    async def _log_verification_request(self, log_chain: List[Dict[str, Any], success: bool, error: str = None):
        """Log verification request"""
        request_id = f"verify_{len(self.verification_requests) + 1:06d}"
        
        request = {
            "request_id": request_id,
            "timestamp": datetime.utcnow().isoformat(),
            "chain_length": len(log_chain),
            "success": success,
            "error": error,
            "first_block": log_chain[0]["timestamp"] if log_chain else None,
            "last_block": log_chain[-1]["timestamp"] if log_chain else None
        }
        
        self.verification_requests.append(request)
        
        # Maintain cache for quick lookups
        cache_key = hashlib.md5(
            json.dumps(log_chain, sort_keys=True).encode()
        ).hexdigest()
        
        self.verification_cache[cache_key] = {
            "verified": success,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Limit cache size
        if len(self.verification_cache) > 1000:
            # Remove oldest entries (simple FIFO)
            keys_to_remove = list(self.verification_cache.keys())[:100]
            for key in keys_to_remove:
                del self.verification_cache[key]
    
    async def verify_data_integrity(self, data: str, expected_hash: str) -> Dict[str, Any]:
        """Verify data integrity against expected hash"""
        actual_hash = hashlib.sha256(data.encode()).hexdigest()
        
        verified = actual_hash == expected_hash
        
        return {
            "verified": verified,
            "expected_hash": expected_hash,
            "actual_hash": actual_hash,
            "timestamp": datetime.utcnow().isoformat(),
            "data_length": len(data)
        }
    
    async def batch_verify(self, verification_requests: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Batch verify multiple requests"""
        results = []
        
        for request in verification_requests:
            if "log_chain" in request:
                result = await self.verify_log_chain(request["log_chain"])
            elif "data" in request and "expected_hash" in request:
                result = await self.verify_data_integrity(
                    request["data"], request["expected_hash"]
                )
            else:
                result = {
                    "verified": False,
                    "error": "Invalid verification request",
                    "timestamp": datetime.utcnow().isoformat()
                }
            
            results.append(result)
        
        return results
    
    def get_verification_stats(self) -> Dict[str, Any]:
        """Get verification statistics"""
        total_requests = len(self.verification_requests)
        successful_requests = sum(1 for r in self.verification_requests if r["success"])
        
        return {
            "total_verifications": total_requests,
            "successful_verifications": successful_requests,
            "success_rate": round(successful_requests / total_requests, 3) if total_requests > 0 else 0,
            "cache_size": len(self.verification_cache),
            "last_verification": self.verification_requests[-1]["timestamp"] if self.verification_requests else None
        }
    
    def get_recent_verifications(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent verification requests"""
        return self.verification_requests[-limit:] if self.verification_requests else []
    
    async def health_check(self) -> Dict[str, Any]:
        """Check verification service health"""
        stats = self.get_verification_stats()
        
        return {
            "status": "healthy",
            "cache_operations": stats["cache_size"],
            "verification_throughput": stats["total_verifications"],
            "success_rate": stats["success_rate"],
            "last_operation": stats["last_verification"]
        }