import json
import asyncio
import hashlib
from datetime import datetime
from typing import Dict, Any, List, Optional
from pathlib import Path

class SecureStorage:
    def __init__(self):
        self.storage_path = Path("secure_storage")
        self.audit_log_path = self.storage_path / "audit_trail.json"
        self.current_chain_hash = None
        self.initialized = False
        
    async def initialize(self):
        """Initialize secure storage"""
        self.storage_path.mkdir(exist_ok=True)
        
        # Initialize or load audit trail
        if self.audit_log_path.exists():
            await self._load_audit_trail()
        else:
            await self._initialize_audit_trail()
            
        self.initialized = True
        print("Secure storage initialized")
    
    async def _initialize_audit_trail(self):
        """Initialize new audit trail"""
        genesis_block = {
            "block_type": "genesis",
            "timestamp": datetime.utcnow().isoformat(),
            "previous_hash": "0" * 64,
            "data_hash": self._calculate_hash("genesis_block"),
            "description": "Audit trail initialization"
        }
        
        genesis_block["block_hash"] = self._calculate_block_hash(genesis_block)
        self.current_chain_hash = genesis_block["block_hash"]
        
        # Save genesis block
        audit_trail = [genesis_block]
        with open(self.audit_log_path, 'w') as f:
            json.dump(audit_trail, f, indent=2)
    
    async def _load_audit_trail(self):
        """Load existing audit trail"""
        with open(self.audit_log_path, 'r') as f:
            audit_trail = json.load(f)
        
        if audit_trail:
            self.current_chain_hash = audit_trail[-1]["block_hash"]
    
    def _calculate_hash(self, data: str) -> str:
        """Calculate SHA-256 hash of data"""
        return hashlib.sha256(data.encode()).hexdigest()
    
    def _calculate_block_hash(self, block: Dict[str, Any]) -> str:
        """Calculate hash for a block"""
        block_data = json.dumps(block, sort_keys=True, default=str)
        return self._calculate_hash(block_data)
    
    async def store_signed_log(self, log_data: Dict[str, Any], signature_info: Dict[str, Any]) -> Dict[str, Any]:
        """Store a signed log entry in the audit trail"""
        if not self.initialized:
            raise Exception("Secure storage not initialized")
        
        # Create audit block
        audit_block = {
            "block_type": "signed_log",
            "timestamp": datetime.utcnow().isoformat(),
            "previous_hash": self.current_chain_hash,
            "log_data": log_data,
            "signature_info": signature_info,
            "data_hash": self._calculate_hash(json.dumps(log_data, sort_keys=True))
        }
        
        # Calculate block hash
        audit_block["block_hash"] = self._calculate_block_hash(audit_block)
        self.current_chain_hash = audit_block["block_hash"]
        
        # Append to audit trail
        await self._append_to_audit_trail(audit_block)
        
        return {
            "block_hash": audit_block["block_hash"],
            "timestamp": audit_block["timestamp"],
            "storage_status": "secured"
        }
    
    async def _append_to_audit_trail(self, block: Dict[str, Any]):
        """Append block to audit trail"""
        with open(self.audit_log_path, 'r+') as f:
            audit_trail = json.load(f)
            audit_trail.append(block)
            f.seek(0)
            json.dump(audit_trail, f, indent=2)
            f.truncate()
    
    async def verify_audit_integrity(self) -> Dict[str, Any]:
        """Verify the integrity of the entire audit trail"""
        if not self.audit_log_path.exists():
            return {"integrity": False, "error": "Audit trail not found"}
        
        with open(self.audit_log_path, 'r') as f:
            audit_trail = json.load(f)
        
        if not audit_trail:
            return {"integrity": True, "message": "Empty audit trail"}
        
        # Verify chain integrity
        previous_hash = "0" * 64
        for i, block in enumerate(audit_trail):
            # Verify block hash
            expected_hash = self._calculate_block_hash({k: v for k, v in block.items() if k != "block_hash"})
            if block["block_hash"] != expected_hash:
                return {"integrity": False, "error": f"Block {i} hash mismatch"}
            
            # Verify chain linkage
            if block["previous_hash"] != previous_hash:
                return {"integrity": False, "error": f"Block {i} chain broken"}
            
            previous_hash = block["block_hash"]
        
        return {
            "integrity": True,
            "block_count": len(audit_trail),
            "last_block_hash": previous_hash,
            "verified_at": datetime.utcnow().isoformat()
        }
    
    async def get_audit_trail_stats(self) -> Dict[str, Any]:
        """Get audit trail statistics"""
        if not self.audit_log_path.exists():
            return {"block_count": 0, "status": "empty"}
        
        with open(self.audit_log_path, 'r') as f:
            audit_trail = json.load(f)
        
        return {
            "block_count": len(audit_trail),
            "first_block": audit_trail[0]["timestamp"] if audit_trail else None,
            "last_block": audit_trail[-1]["timestamp"] if audit_trail else None,
            "current_chain_hash": self.current_chain_hash
        }
    
    async def health_check(self) -> Dict[str, Any]:
        """Check storage health"""
        stats = await self.get_audit_trail_stats()
        integrity = await self.verify_audit_integrity()
        
        return {
            "initialized": self.initialized,
            "audit_trail_integrity": integrity["integrity"],
            "block_count": stats["block_count"],
            "storage_path_exists": self.storage_path.exists()
        }
    
    async def integrity_check(self) -> bool:
        """Perform integrity check on storage"""
        health = await self.health_check()
        return health["audit_trail_integrity"] and health["initialized"]