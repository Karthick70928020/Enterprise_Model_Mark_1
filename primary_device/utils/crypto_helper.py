import hashlib
import json
from typing import Dict, Any

class CryptoHelper:
    def __init__(self):
        self.hash_algorithm = "sha256"
    
    def generate_hash(self, data: str) -> str:
        """Generate SHA-256 hash of data"""
        return hashlib.sha256(data.encode()).hexdigest()
    
    def generate_log_hash(self, log_entry: Dict[str, Any], previous_hash: str) -> str:
        """Generate hash for log entry with chain support"""
        log_data = json.dumps(log_entry, sort_keys=True, default=str)
        combined_data = f"{previous_hash}{log_data}"
        return self.generate_hash(combined_data)
    
    def verify_hash(self, data: str, expected_hash: str) -> bool:
        """Verify data against expected hash"""
        return self.generate_hash(data) == expected_hash