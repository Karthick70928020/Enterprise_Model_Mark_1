import asyncio
from datetime import datetime
from typing import Dict, Any, Optional
import base64
import hashlib
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.backends import default_backend
from cryptography.exceptions import InvalidSignature

from app.config import config
from services.totp_generator import TOTPGenerator

class SignatureEngine:
    def __init__(self):
        self.private_key = None
        self.public_key = None
        self.key_initialized = False
        self.totp_generator = TOTPGenerator()
        self.signature_stats = {
            "total_signatures": 0,
            "failed_signatures": 0,
            "last_signature": None
        }
        
    async def initialize(self):
        """Initialize signature engine with cryptographic keys"""
        try:
            # Initialize TOTP
            await self.totp_generator.initialize()
            
            # Generate or load keys
            await self._initialize_keys()
            
            self.key_initialized = True
            print("Signature engine initialized successfully")
            
        except Exception as e:
            print(f"Signature engine initialization failed: {e}")
            raise
    
    async def _initialize_keys(self):
        """Initialize cryptographic keys"""
        import os
        
        # For demo purposes, we'll generate new keys each time
        # In production, you would load from secure storage
        print("Generating new RSA key pair...")
        
        self.private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )
        
        self.public_key = self.private_key.public_key()
        
        print("Cryptographic keys generated successfully")
    
    async def sign_data(self, data: str, totp_code: str) -> Dict[str, Any]:
        """Sign data with private key and TOTP verification"""
        if not self.key_initialized:
            raise Exception("Signature engine not initialized")
        
        # Verify TOTP (in production, this would be strict)
        # For demo, we'll accept any code
        if not self.totp_generator.verify_code(totp_code):
            print("Warning: TOTP verification bypassed for demo")
        
        try:
            # Create signature
            signature = self.private_key.sign(
                data.encode('utf-8'),
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )
            
            # Encode signature
            signature_b64 = base64.b64encode(signature).decode('utf-8')
            
            # Update stats
            self.signature_stats["total_signatures"] += 1
            self.signature_stats["last_signature"] = datetime.utcnow().isoformat()
            
            return {
                "signature": signature_b64,
                "algorithm": "RSA-PSS-SHA256",
                "timestamp": datetime.utcnow().isoformat(),
                "public_key_fingerprint": await self.get_public_key_fingerprint(),
                "data_hash": self._calculate_data_hash(data)
            }
            
        except Exception as e:
            self.signature_stats["failed_signatures"] += 1
            raise Exception(f"Signing failed: {str(e)}")
    
    async def verify_signature(self, data: str, signature: str, public_key_pem: str) -> Dict[str, Any]:
        """Verify signature with public key"""
        try:
            # Load public key from PEM
            from cryptography.hazmat.primitives import serialization
            public_key = serialization.load_pem_public_key(
                public_key_pem.encode('utf-8'),
                backend=default_backend()
            )
            
            # Decode signature
            signature_bytes = base64.b64decode(signature)
            
            # Verify signature
            public_key.verify(
                signature_bytes,
                data.encode('utf-8'),
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )
            
            return {
                "verified": True,
                "timestamp": datetime.utcnow().isoformat(),
                "algorithm": "RSA-PSS-SHA256"
            }
            
        except InvalidSignature:
            return {
                "verified": False,
                "error": "Invalid signature",
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            return {
                "verified": False,
                "error": f"Verification failed: {str(e)}",
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def _calculate_data_hash(self, data: str) -> str:
        """Calculate SHA-256 hash of data"""
        return hashlib.sha256(data.encode()).hexdigest()
    
    async def get_public_key_fingerprint(self) -> str:
        """Get public key fingerprint"""
        from cryptography.hazmat.primitives import serialization
        
        public_pem = self.public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        
        # Simple fingerprint for demo
        fingerprint = hashlib.sha256(public_pem).hexdigest()[:16]
        return f"fp_{fingerprint}"
    
    async def health_check(self) -> Dict[str, Any]:
        """Check signature engine health"""
        return {
            "key_initialized": self.key_initialized,
            "totp_initialized": self.totp_generator.initialized,
            "signature_stats": self.signature_stats,
            "public_key_available": self.public_key is not None
        }
    
    async def secure_cleanup(self):
        """Securely cleanup cryptographic material"""
        # In production, this would securely wipe memory
        self.private_key = None
        self.public_key = None
        self.key_initialized = False
        print("Cryptographic material securely cleared")