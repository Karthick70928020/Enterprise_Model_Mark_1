from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
import os
import inspect

from app.config import config
from api.secondary_controller import router as secondary_router
from api.verification_api import router as verification_router
from api.alert_api import router as alert_router
from api.audit_api import router as audit_router
from core.signature_engine import SignatureEngine
from core.log_verifier import LogVerifier
from core.alert_manager import AlertManager
from core.audit_manager import AuditManager
from services.audit_trail_manager import AuditTrailManager
from services.compliance_reporter import ComplianceReporter
from services.verification_service import VerificationService
from security.access_controller import AccessController
from utils.secure_logger import setup_secure_logger

# Setup secure logger
logger = setup_secure_logger("secondary_device")

# Security scheme
security = HTTPBearer()

app = FastAPI(
    title="Secondary Device - Cryptographic Control Unit",
    description="Hardware-secured cryptographic operations and immutable logging",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(secondary_router, prefix="/api/v1")
app.include_router(verification_router, prefix="/api/v1")
app.include_router(alert_router, prefix="/api/v1")
app.include_router(audit_router, prefix="/api/v1")

# Global instances
signature_engine = SignatureEngine()
log_verifier = LogVerifier()
alert_manager = AlertManager()
audit_manager = AuditManager()
audit_trail_manager = AuditTrailManager()
compliance_reporter = ComplianceReporter()
verification_service = VerificationService()
access_controller = AccessController()

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Verify authentication token"""
    token = credentials.credentials
    if not await access_controller.verify_token(token):
        raise HTTPException(status_code=401, detail="Invalid token")
    return token

@app.on_event("startup")
async def startup_event():
    """Initialize cryptographic services on startup"""
    logger.info("Starting Secondary Device Services...")
    
    # Initialize cryptographic components
    await signature_engine.initialize()
    logger.info("Signature engine initialized")
    
    # Initialize audit trail
    await audit_trail_manager.initialize()
    logger.info("Audit trail manager initialized")
    
    # Initialize verification service
    await verification_service.initialize()
    logger.info("Verification service initialized")
    
    # Initialize alert manager
    await alert_manager.initialize()
    logger.info("Alert manager initialized")
    
    logger.info("Secondary Device fully operational")

@app.on_event("shutdown")
async def shutdown_event():
    """Secure cleanup on shutdown"""
    logger.info("Securely shutting down Secondary Device...")
    await signature_engine.secure_cleanup()

@app.get("/")
async def root():
    return {
        "message": "Secondary Device - Cryptographic Control Unit",
        "status": "operational",
        "version": "1.0.0",
        "security_level": "high",
        "services": {
            "signature_engine": "active",
            "log_verification": "active",
            "audit_trail": "active",
            "alert_system": "active"
        }
    }
@app.get("/health")
async def health_check(token: str = Depends(verify_token)):
    crypto_health = await signature_engine.health_check()
    audit_health = await audit_trail_manager.health_check()

    # Dynamically find a health-check method name and handle sync/async results without direct attribute access
    v_func = (
        getattr(verification_service, "health_check", None)
        or getattr(verification_service, "check_health", None)
        or getattr(verification_service, "health", None)
    )

    if callable(v_func):
        v = v_func()
    else:
        v = {"status": "unavailable"}

    if inspect.isawaitable(v):
        verification_health = await v
    else:
        verification_health = v

    return {
        "status": "healthy",
        "service": "secondary_device",
        "crypto_health": crypto_health,
        "audit_health": audit_health,
        "verification_health": verification_health,
        "timestamp": "2024-01-01T00:00:00Z"
    }

if __name__ == "__main__":
    # Create necessary directories
    os.makedirs("secure_storage", exist_ok=True)
    os.makedirs("backup_keys", exist_ok=True)
    
    uvicorn.run(
        "app.main:app",
        host=config.host,
        port=config.port,
        reload=config.debug,
        log_level="info"
    )