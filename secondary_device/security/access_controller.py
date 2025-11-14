import asyncio
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
import jwt
from enum import Enum

class AccessLevel(Enum):
    READ_ONLY = "read_only"
    OPERATOR = "operator"
    ADMIN = "admin"
    CRYPTO_OFFICER = "crypto_officer"

class AccessController:
    def __init__(self):
        self.secret_key = "your-access-control-secret-change-in-production"
        self.algorithm = "HS256"
        self.active_sessions = {}
        self.access_rules = self._initialize_access_rules()
        
    def _initialize_access_rules(self) -> Dict[str, Any]:
        """Initialize access control rules"""
        return {
            "read_only": {
                "endpoints": ["/health", "/status", "/audit/status"],
                "operations": ["read"]
            },
            "operator": {
                "endpoints": ["/verify/*", "/audit/*"],
                "operations": ["read", "verify"]
            },
            "admin": {
                "endpoints": ["/*"],
                "operations": ["read", "write", "manage"]
            },
            "crypto_officer": {
                "endpoints": ["/crypto/*", "/keys/*"],
                "operations": ["read", "write", "crypto_operations"]
            }
        }
    
    async def authenticate_user(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user and return token"""
        # In production, this would verify against a user database
        # For demo, we'll use simple authentication
        
        valid_users = {
            "admin": {"password": "admin123", "access_level": AccessLevel.ADMIN.value},
            "operator": {"password": "operator123", "access_level": AccessLevel.OPERATOR.value},
            "auditor": {"password": "auditor123", "access_level": AccessLevel.READ_ONLY.value},
            "crypto_officer": {"password": "crypto123", "access_level": AccessLevel.CRYPTO_OFFICER.value}
        }
        
        if username in valid_users and valid_users[username]["password"] == password:
            access_level = valid_users[username]["access_level"]
            token = await self._generate_token(username, access_level)
            
            return {
                "access_token": token,
                "token_type": "bearer",
                "access_level": access_level,
                "expires_in": 3600
            }
        
        return None
    
    async def _generate_token(self, username: str, access_level: str) -> str:
        """Generate JWT token"""
        payload = {
            "sub": username,
            "access_level": access_level,
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow()
        }
        
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
    
    async def verify_token(self, token: str) -> Dict[str, Any]:
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            
            # Check expiration
            if datetime.utcnow() > datetime.fromtimestamp(payload["exp"]):
                return {"valid": False, "error": "Token expired"}
            
            return {
                "valid": True,
                "username": payload["sub"],
                "access_level": payload["access_level"],
                "expires_at": payload["exp"]
            }
            
        except jwt.ExpiredSignatureError:
            return {"valid": False, "error": "Token expired"}
        except jwt.InvalidTokenError:
            return {"valid": False, "error": "Invalid token"}
    
    async def check_access(self, token: str, endpoint: str, operation: str) -> Dict[str, Any]:
        """Check if token has access to endpoint and operation"""
        verification = await self.verify_token(token)
        
        if not verification["valid"]:
            return {"allowed": False, "error": verification["error"]}
        
        access_level = verification["access_level"]
        
        # Check if operation is allowed for this access level
        if operation not in self.access_rules[access_level]["operations"]:
            return {"allowed": False, "error": f"Operation '{operation}' not allowed for {access_level}"}
        
        # Check if endpoint is allowed
        allowed_endpoints = self.access_rules[access_level]["endpoints"]
        endpoint_allowed = any(
            endpoint.startswith(allowed_endpoint.replace('*', ''))
            for allowed_endpoint in allowed_endpoints
        )
        
        if not endpoint_allowed:
            return {"allowed": False, "error": f"Endpoint '{endpoint}' not allowed for {access_level}"}
        
        return {
            "allowed": True,
            "username": verification["username"],
            "access_level": access_level,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def create_session(self, token: str, client_info: Dict[str, Any]) -> str:
        """Create user session"""
        session_id = f"session_{len(self.active_sessions) + 1:06d}"
        
        self.active_sessions[session_id] = {
            "token": token,
            "client_info": client_info,
            "created_at": datetime.utcnow().isoformat(),
            "last_activity": datetime.utcnow().isoformat()
        }
        
        return session_id
    
    async def validate_session(self, session_id: str) -> bool:
        """Validate user session"""
        if session_id not in self.active_sessions:
            return False
        
        session = self.active_sessions[session_id]
        
        # Check session timeout (1 hour)
        last_activity = datetime.fromisoformat(session["last_activity"])
        if datetime.utcnow() - last_activity > timedelta(hours=1):
            del self.active_sessions[session_id]
            return False
        
        # Update last activity
        session["last_activity"] = datetime.utcnow().isoformat()
        
        return True
    
    async def revoke_session(self, session_id: str) -> bool:
        """Revoke user session"""
        if session_id in self.active_sessions:
            del self.active_sessions[session_id]
            return True
        return False
    
    def get_active_sessions(self) -> List[Dict[str, Any]]:
        """Get active sessions"""
        sessions = []
        for session_id, session_data in self.active_sessions.items():
            sessions.append({
                "session_id": session_id,
                "client_info": session_data["client_info"],
                "created_at": session_data["created_at"],
                "last_activity": session_data["last_activity"]
            })
        
        return sessions