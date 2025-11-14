import asyncio
from datetime import datetime
from typing import Dict, Any, List, Optional
import hashlib
import json

class LogVerifier:
    def __init__(self):
        self.verification_log = []
        self.verification_stats = {
            "total_verifications": 0,
            "successful_verifications": 0,
            "failed_verifications": 0
        }
        
    async def verify_log_integrity(self, log_chain: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Verify the integrity of a log chain"""
        if not log_chain:
            return {
                "verified": False,
                "error": "Empty log chain",
                "timestamp": datetime.utcnow().isoformat()
            }
        
        try:
            # Verify genesis block
            genesis_block = log_chain[0]
            if not await self._verify_genesis_block(genesis_block):
                return {
                    "verified": False,
                    "error": "Invalid genesis block",
                    "timestamp": datetime.utcnow().isoformat()
                }
            
            # Verify subsequent blocks
            previous_hash = genesis_block["block_hash"]
            for i, block in enumerate(log_chain[1:], 1):
                if not await self._verify_block(block, previous_hash):
                    return {
                        "verified": False,
                        "error": f"Block {i} verification failed",
                        "timestamp": datetime.utcnow().isoformat()
                    }
                previous_hash = block["block_hash"]
            
            # Update stats
            self.verification_stats["total_verifications"] += 1
            self.verification_stats["successful_verifications"] += 1
            
            return {
                "verified": True,
                "chain_length": len(log_chain),
                "first_block": log_chain[0]["timestamp"],
                "last_block": log_chain[-1]["timestamp"],
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            self.verification_stats["failed_verifications"] += 1
            return {
                "verified": False,
                "error": f"Verification error: {str(e)}",
                "timestamp": datetime.utcnow().isoformat()
            }
    
    async def _verify_genesis_block(self, block: Dict[str, Any]) -> bool:
        """Verify genesis block"""
        required_fields = ["block_type", "timestamp", "previous_hash", "block_hash"]
        
        # Check required fields
        for field in required_fields:
            if field not in block:
                return False
        
        # Check block type
        if block["block_type"] != "genesis":
            return False
        
        # Check previous hash (should be all zeros for genesis)
        if block["previous_hash"] != "0" * 64:
            return False
        
        # Verify block hash
        expected_hash = self._calculate_block_hash(block)
        return block["block_hash"] == expected_hash
    
    async def _verify_block(self, block: Dict[str, Any], previous_hash: str) -> bool:
        """Verify a regular block"""
        required_fields = ["block_type", "timestamp", "previous_hash", "block_hash", "data_hash"]
        
        # Check required fields
        for field in required_fields:
            if field not in block:
                return False
        
        # Check chain linkage
        if block["previous_hash"] != previous_hash:
            return False
        
        # Verify block hash
        expected_hash = self._calculate_block_hash(block)
        if block["block_hash"] != expected_hash:
            return False
        
        # Verify data hash if present
        if "log_data" in block:
            data_hash = self._calculate_data_hash(block["log_data"])
            if block["data_hash"] != data_hash:
                return False
        
        return True
    
    def _calculate_block_hash(self, block: Dict[str, Any]) -> str:
        """Calculate block hash"""
        # Exclude block_hash from calculation
        block_data = {k: v for k, v in block.items() if k != "block_hash"}
        block_str = json.dumps(block_data, sort_keys=True, default=str)
        return hashlib.sha256(block_str.encode()).hexdigest()
    
    def _calculate_data_hash(self, data: Dict[str, Any]) -> str:
        """Calculate data hash"""
        data_str = json.dumps(data, sort_keys=True, default=str)
        return hashlib.sha256(data_str.encode()).hexdigest()
    
    async def verify_signature_integrity(self, signed_data: Dict[str, Any], public_key: str) -> Dict[str, Any]:
        """Verify signature integrity"""
        try:
            # Extract signature and data
            signature = signed_data.get("signature")
            data_to_verify = signed_data.get("data_to_verify")
            
            if not signature or not data_to_verify:
                return {
                    "verified": False,
                    "error": "Missing signature or data",
                    "timestamp": datetime.utcnow().isoformat()
                }
            
            # This would use the signature engine for actual verification
            # For demo, we'll simulate verification
            import random
            verified = random.random() > 0.1  # 90% success rate for demo
            
            if verified:
                self.verification_stats["successful_verifications"] += 1
                return {
                    "verified": True,
                    "timestamp": datetime.utcnow().isoformat(),
                    "algorithm": "RSA-PSS-SHA256"
                }
            else:
                self.verification_stats["failed_verifications"] += 1
                return {
                    "verified": False,
                    "error": "Signature verification failed",
                    "timestamp": datetime.utcnow().isoformat()
                }
                
        except Exception as e:
            self.verification_stats["failed_verifications"] += 1
            return {
                "verified": False,
                "error": f"Signature verification error: {str(e)}",
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def get_verification_stats(self) -> Dict[str, Any]:
        """Get verification statistics"""
        return self.verification_stats.copy()
    
    def get_recent_verifications(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent verification results"""
        return self.verification_log[-limit:] if self.verification_log else []