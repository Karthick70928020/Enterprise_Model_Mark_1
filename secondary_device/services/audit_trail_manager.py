import asyncio
import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from pathlib import Path

from app.config import config

class AuditTrailManager:
    def __init__(self):
        self.audit_trail = []
        self.current_chain_hash = None
        self.initialized = False
        
    async def initialize(self):
        """Initialize audit trail manager"""
        try:
            # Create audit trail directory if it doesn't exist
            audit_path = Path(config.audit_trail_path)
            audit_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Load existing audit trail or create new one
            if audit_path.exists():
                await self._load_audit_trail()
            else:
                await self._initialize_audit_trail()
            
            self.initialized = True
            print("Audit trail manager initialized successfully")
            
        except Exception as e:
            print(f"Audit trail initialization failed: {e}")
            raise
    
    async def _initialize_audit_trail(self):
        """Initialize new audit trail with genesis block"""
        genesis_block = {
            "block_type": "genesis",
            "timestamp": datetime.utcnow().isoformat(),
            "previous_hash": "0" * 64,
            "data_hash": self._calculate_hash("genesis_block_2024"),
            "description": "Audit trail initialization - Project Aegis",
            "version": "1.0.0",
            "system": "Secondary Device"
        }
        
        genesis_block["block_hash"] = self._calculate_block_hash(genesis_block)
        self.current_chain_hash = genesis_block["block_hash"]
        
        self.audit_trail = [genesis_block]
        await self._save_audit_trail()
    
    async def _load_audit_trail(self):
        """Load existing audit trail from storage"""
        try:
            with open(config.audit_trail_path, 'r') as f:
                self.audit_trail = json.load(f)
            
            if self.audit_trail:
                self.current_chain_hash = self.audit_trail[-1]["block_hash"]
            
            print(f"Loaded audit trail with {len(self.audit_trail)} blocks")
            
        except Exception as e:
            print(f"Failed to load audit trail: {e}")
            await self._initialize_audit_trail()
    
    async def _save_audit_trail(self):
        """Save audit trail to storage"""
        try:
            with open(config.audit_trail_path, 'w') as f:
                json.dump(self.audit_trail, f, indent=2)
        except Exception as e:
            print(f"Failed to save audit trail: {e}")
    
    def _calculate_hash(self, data: str) -> str:
        """Calculate SHA-256 hash of data"""
        import hashlib
        return hashlib.sha256(data.encode()).hexdigest()
    
    def _calculate_block_hash(self, block: Dict[str, Any]) -> str:
        """Calculate hash for a block"""
        import json
        block_data = json.dumps(block, sort_keys=True, default=str)
        return self._calculate_hash(block_data)
    
    async def add_signed_entry(self, log_data: Dict[str, Any], signature_info: Dict[str, Any]) -> Dict[str, Any]:
        """Add a signed entry to the audit trail"""
        if not self.initialized:
            raise Exception("Audit trail not initialized")
        
        # Create audit block
        audit_block = {
            "block_type": "signed_log",
            "timestamp": datetime.utcnow().isoformat(),
            "previous_hash": self.current_chain_hash,
            "log_data": log_data,
            "signature_info": signature_info,
            "data_hash": self._calculate_hash(json.dumps(log_data, sort_keys=True)),
            "description": f"Signed log entry from {log_data.get('device_id', 'unknown')}"
        }
        
        # Calculate block hash
        audit_block["block_hash"] = self._calculate_block_hash(audit_block)
        self.current_chain_hash = audit_block["block_hash"]
        
        # Add to audit trail
        self.audit_trail.append(audit_block)
        
        # Save audit trail
        await self._save_audit_trail()
        
        # Maintain size limit
        if len(self.audit_trail) > config.max_audit_blocks:
            self.audit_trail = self.audit_trail[-config.max_audit_blocks:]
            await self._save_audit_trail()
        
        return {
            "block_hash": audit_block["block_hash"],
            "timestamp": audit_block["timestamp"],
            "block_index": len(self.audit_trail) - 1,
            "storage_status": "secured"
        }
    
    async def verify_audit_integrity(self) -> Dict[str, Any]:
        """Verify the integrity of the entire audit trail"""
        if not self.audit_trail:
            return {
                "integrity": True,
                "message": "Empty audit trail",
                "verified_at": datetime.utcnow().isoformat()
            }
        
        try:
            # Verify genesis block
            genesis_block = self.audit_trail[0]
            if genesis_block["block_type"] != "genesis":
                return {
                    "integrity": False,
                    "error": "Invalid genesis block",
                    "verified_at": datetime.utcnow().isoformat()
                }
            
            # Verify chain integrity
            previous_hash = "0" * 64
            for i, block in enumerate(self.audit_trail):
                # Verify block hash
                expected_hash = self._calculate_block_hash({k: v for k, v in block.items() if k != "block_hash"})
                if block["block_hash"] != expected_hash:
                    return {
                        "integrity": False,
                        "error": f"Block {i} hash mismatch",
                        "verified_at": datetime.utcnow().isoformat()
                    }
                
                # Verify chain linkage
                if block["previous_hash"] != previous_hash:
                    return {
                        "integrity": False,
                        "error": f"Block {i} chain broken",
                        "verified_at": datetime.utcnow().isoformat()
                    }
                
                previous_hash = block["block_hash"]
            
            return {
                "integrity": True,
                "block_count": len(self.audit_trail),
                "first_block": self.audit_trail[0]["timestamp"],
                "last_block": self.audit_trail[-1]["timestamp"],
                "verified_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {
                "integrity": False,
                "error": f"Integrity check failed: {str(e)}",
                "verified_at": datetime.utcnow().isoformat()
            }
    
    async def get_audit_trail_info(self) -> Dict[str, Any]:
        """Get audit trail information"""
        integrity_check = await self.verify_audit_integrity()
        
        return {
            "block_count": len(self.audit_trail),
            "current_chain_hash": self.current_chain_hash,
            "integrity_verified": integrity_check["integrity"],
            "first_block_time": self.audit_trail[0]["timestamp"] if self.audit_trail else None,
            "last_block_time": self.audit_trail[-1]["timestamp"] if self.audit_trail else None,
            "storage_path": config.audit_trail_path,
            "max_blocks": config.max_audit_blocks
        }
    
    async def search_audit_trail(self, query: Dict[str, Any] = None, limit: int = 100) -> List[Dict[str, Any]]:
        """Search audit trail with query"""
        if not query:
            return self.audit_trail[-limit:] if self.audit_trail else []
        
        results = []
        for block in reversed(self.audit_trail):
            if self._matches_query(block, query):
                results.append(block)
                if len(results) >= limit:
                    break
        
        return results
    
    def _matches_query(self, block: Dict[str, Any], query: Dict[str, Any]) -> bool:
        """Check if block matches search query"""
        for key, value in query.items():
            if key not in block:
                return False
            
            if isinstance(value, list):
                if block[key] not in value:
                    return False
            else:
                if block[key] != value:
                    return False
        
        return True
    
    async def health_check(self) -> Dict[str, Any]:
        """Check audit trail health"""
        info = await self.get_audit_trail_info()
        integrity = await self.verify_audit_integrity()
        
        return {
            "initialized": self.initialized,
            "block_count": info["block_count"],
            "integrity_verified": integrity["integrity"],
            "storage_accessible": Path(config.audit_trail_path).exists(),
            "current_chain_hash": self.current_chain_hash
        }