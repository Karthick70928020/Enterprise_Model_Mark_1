import pyotp
import asyncio
from datetime import datetime
from typing import Dict, Any

from app.config import config

class TOTPGenerator:
    def __init__(self):
        self.totp = None
        self.initialized = False
        
    async def initialize(self):
        """Initialize TOTP generator"""
        self.totp = pyotp.TOTP(config.totp_secret)
        self.initialized = True
        print("TOTP generator initialized")
    
    def generate_current_code(self) -> str:
        """Generate current TOTP code"""
        if not self.initialized:
            raise Exception("TOTP not initialized")
        return self.totp.now()
    
    def verify_code(self, code: str) -> bool:
        """Verify TOTP code"""
        if not self.initialized:
            raise Exception("TOTP not initialized")
        return self.totp.verify(code)
    
    def get_remaining_time(self) -> int:
        """Get remaining time for current TOTP code"""
        if not self.initialized:
            return 0
        return self.totp.interval - datetime.now().timestamp() % self.totp.interval
    
    async def get_totp_status(self) -> Dict[str, Any]:
        """Get TOTP system status"""
        return {
            "initialized": self.initialized,
            "current_code": self.generate_current_code() if self.initialized else "N/A",
            "remaining_seconds": self.get_remaining_time() if self.initialized else 0,
            "interval_seconds": self.totp.interval if self.initialized else 0
        }
    
    async def integrity_check(self) -> bool:
        """Verify TOTP system integrity"""
        if not self.initialized:
            return False
        
        try:
            current_code = self.generate_current_code()
            is_valid = self.verify_code(current_code)
            return is_valid
        except Exception:
            return False