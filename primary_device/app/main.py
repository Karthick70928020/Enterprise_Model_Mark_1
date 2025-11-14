from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio

from app.config import PrimaryConfig as config
from api.primary_controller import router as primary_router
from api.health_monitor import router as health_router
from api.policy_api import router as policy_router
from api.threat_intel_api import router as threat_router
from core.threat_detector import ThreatDetector
from core.policy_enforcer import PolicyEnforcer
from core.log_generator import LogGenerator
from services.system_log_collector import SystemLogCollector
from ml.model_manager import ModelManager
from utils.logger import setup_logger

# Setup logger
logger = setup_logger("primary_device")

app = FastAPI(
    title="Primary Device - AI Security Engine",
    description="Real-time threat detection and network security monitoring",
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
app.include_router(primary_router, prefix="/api/v1")
app.include_router(health_router, prefix="/api/v1")
app.include_router(policy_router, prefix="/api/v1")
app.include_router(threat_router, prefix="/api/v1")

# Global instances
threat_detector = ThreatDetector()
policy_enforcer = PolicyEnforcer()
log_generator = LogGenerator()
system_log_collector = SystemLogCollector()
model_manager = ModelManager()

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("Starting Primary Device Services...")
    
    # Initialize AI models
    await model_manager.initialize_models()
    logger.info("AI models initialized")
    
    # Start system log collection
    await system_log_collector.start_collection()
    logger.info("System log collection started")
    
    # Initialize threat detector
    await threat_detector.initialize()
    logger.info("Threat detector initialized")
    
    logger.info("Primary Device fully operational")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down Primary Device...")
    await system_log_collector.stop_collection()

@app.get("/")
async def root():
    return {
        "message": "Primary Device - AI Security Engine",
        "status": "operational",
        "version": "1.0.0",
        "services": {
            "threat_detection": "active",
            "policy_enforcement": "active",
            "log_generation": "active",
            "ai_analysis": "active"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "primary_device",
        "timestamp": "2024-01-01T00:00:00Z",
        "components": {
            "threat_detector": "operational",
            "policy_enforcer": "operational",
            "log_generator": "operational"
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=config.host,
        port=config.port,
        reload=config.debug,
        log_level="info"
    )