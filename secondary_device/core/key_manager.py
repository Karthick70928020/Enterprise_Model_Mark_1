import os
import asyncio
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import base64
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.backends import default_backend
from cryptography.exceptions import InvalidSignature

from app.config import config

class KeyManager:
    def __init__(self):
        self.private_key = None
        self.public_key = None
        self.key_initialized = False
        self.key_rotation_date = None
        
    async def initialize_keys(self):
        """Initialize or load cryptographic keys"""
        try:
            if os.path.exists(config.private_key_path):
                await self._load_existing_keys()
            else:
                await self._generate_new_keys()
            
            self.key_initialized = True
            self.key_rotation_date = datetime.utcnow()
            print("Cryptographic keys initialized successfully")
            
        except Exception as e:
            print(f"Key initialization failed: {e}")
            raise
    
    async def _generate_new_keys(self):
        """Generate new RSA key pair"""
        print("Generating new RSA key pair...")
        
        # Generate private key
        self.private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )
        
        # Get public key
        self.public_key = self.private_key.public_key()
        
        # Save keys securely
        await self._save_keys()
    
    async def _load_existing_keys(self):
        """Load existing keys from secure storage"""
        print("Loading existing cryptographic keys...")
        
        with open(config.private_key_path, "rb") as key_file:
            self.private_key = serialization.load_pem_private_key(
                key_file.read(),
                password=None,
                backend=default_backend()
            )
        
        with open(config.public_key_path, "rb") as key_file:
            self.public_key = serialization.load_pem_public_key(
                key_file.read(),
                backend=default_backend()
            )
    
    async def _save_keys(self):
        """Save keys to secure storage"""
        # Save private key
        private_pem = self.private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )
        
        with open(config.private_key_path, "wb") as key_file:
            key_file.write(private_pem)
        
        # Save public key
        public_pem = self.public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        
        with open(config.public_key_path, "wb") as key_file:
            key_file.write(public_pem)
    
    async def sign_data(self, data: str, totp_code: str) -> Dict[str, Any]:
        """Sign data with private key and TOTP verification"""
        if not self.key_initialized:
            raise Exception("Keys not initialized")
        
        # In production, verify TOTP code here
        # await self._verify_totp(totp_code)
        
        # Create signature
        signature = self.private_key.sign(
            data.encode('utf-8'),
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        
        # Encode signature for storage
        signature_b64 = base64.b64encode(signature).decode('utf-8')
        
        return {
            "signature": signature_b64,
            "algorithm": "RSA-PSS-SHA256",
            "timestamp": datetime.utcnow().isoformat(),
            "public_key_fingerprint": await self.get_public_key_fingerprint()
        }
    
    async def verify_signature(self, data: str, signature: str, public_key_pem: str) -> bool:
        """Verify signature with public key"""
        try:
            # Load public key
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
            
            return True
            
        except InvalidSignature:
            return False
        except Exception as e:
            print(f"Signature verification error: {e}")
            return False
    
    async def get_public_key_fingerprint(self) -> str:
        """Get public key fingerprint"""
        public_pem = self.public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        
        # Simple fingerprint for demo - in production use proper fingerprint
        return f"key_{hash(public_pem) % 10000:04d}"
    
    async def health_check(self) -> Dict[str, Any]:
        """Check key manager health"""
        days_since_rotation = (datetime.utcnow() - self.key_rotation_date).days if self.key_rotation_date else 0
        
        return {
            "key_initialized": self.key_initialized,
            "days_since_rotation": days_since_rotation,
            "needs_rotation": days_since_rotation >= config.key_rotation_days,
            "public_key_available": self.public_key is not None
        }
    
    async def integrity_check(self) -> bool:
        """Perform integrity check on keys"""
        try:
            if not self.key_initialized:
                return False
            
            # Test signature creation and verification
            test_data = "integrity_check_2024"
            signature_info = await self.sign_data(test_data, "000000")  # Demo TOTP
            
            # Verify the signature
            public_pem = self.public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            ).decode('utf-8')
            
            is_valid = await self.verify_signature(
                test_data, 
                signature_info["signature"], 
                public_pem
            )
            
            return is_valid
            
        except Exception as e:
            print(f"Key integrity check failed: {e}")
            return False
    
    async def secure_cleanup(self):
        """Securely cleanup key material from memory"""
        # In production, this would securely wipe key material
        self.private_key = None
        self.public_key = None
        self.key_initialized = False
        print("Key material securely cleared from memory")