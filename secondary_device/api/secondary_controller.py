from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any

from core.signature_engine import SignatureEngine
from core.alert_manager import AlertManager
from core.audit_manager import AuditManager
from services.audit_trail_manager import AuditTrailManager
from services.compliance_reporter import ComplianceReporter
from security.access_controller import AccessController

router = APIRouter()

# Initialize services
signature_engine = SignatureEngine()
alert_manager = AlertManager()
audit_manager = AuditManager()
audit_trail_manager = AuditTrailManager()
compliance_reporter = ComplianceReporter()
access_controller = AccessController()

@router.get("/status")
async def get_system_status():
    """Get secondary device system status"""
    try:
        crypto_health = await signature_engine.health_check()
        audit_health = await audit_trail_manager.health_check()
        alert_stats = alert_manager.get_alert_stats()
        
        return {
            "status": "operational",
            "security_level": "high",
            "crypto_health": crypto_health,
            "audit_health": audit_health,
            "alert_status": alert_stats,
            "timestamp": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get system status: {str(e)}")

@router.get("/crypto/status")
async def get_crypto_status():
    """Get cryptographic system status"""
    try:
        health = await signature_engine.health_check()
        public_key_fingerprint = await signature_engine.get_public_key_fingerprint()
        
        return {
            "key_initialized": health["key_initialized"],
            "public_key_fingerprint": public_key_fingerprint,
            "signature_stats": health["signature_stats"],
            "algorithm": "RSA-PSS-SHA256",
            "key_size": 2048
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get crypto status: {str(e)}")

@router.get("/audit/status")
async def get_audit_status():
    """Get audit trail status"""
    try:
        audit_info = await audit_trail_manager.get_audit_trail_info()
        integrity_check = await audit_trail_manager.verify_audit_integrity()
        
        return {
            "block_count": audit_info["block_count"],
            "integrity_verified": integrity_check["integrity"],
            "first_block_time": audit_info["first_block_time"],
            "last_block_time": audit_info["last_block_time"],
            "current_chain_hash": audit_info["current_chain_hash"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get audit status: {str(e)}")

@router.post("/sign/log")
async def sign_log_entry(signature_request: Dict[str, Any]):
    """Sign a log entry"""
    try:
        # Extract request data
        log_hash = signature_request.get("log_hash")
        previous_hash = signature_request.get("previous_hash")
        timestamp = signature_request.get("timestamp")
        device_id = signature_request.get("device_id")
        totp_code = signature_request.get("totp_code", "000000")
        
        if not all([log_hash, previous_hash, timestamp, device_id]):
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        # Create data to sign
        data_to_sign = f"{log_hash}{previous_hash}{timestamp}{device_id}"
        
        # Generate signature
        signature_info = await signature_engine.sign_data(data_to_sign, totp_code)
        
        # Prepare log data for audit trail
        log_data = {
            "log_hash": log_hash,
            "previous_hash": previous_hash,
            "timestamp": timestamp,
            "device_id": device_id,
            "data_to_sign": data_to_sign
        }
        
        # Store in audit trail
        audit_result = await audit_trail_manager.add_signed_entry(log_data, signature_info)
        
        # Log audit event
        await audit_manager.log_crypto_operation(
            operation="sign_log",
            key_fingerprint=signature_info["public_key_fingerprint"],
            status="success",
            details={
                "device_id": device_id,
                "log_hash": log_hash,
                "block_hash": audit_result["block_hash"]
            }
        )
        
        return {
            "signature": signature_info["signature"],
            "signed_at": signature_info["timestamp"],
            "public_key": signature_info["public_key_fingerprint"],
            "audit_block_hash": audit_result["block_hash"]
        }
        
    except Exception as e:
        # Log failed signing attempt
        await audit_manager.log_crypto_operation(
            operation="sign_log",
            key_fingerprint="unknown",
            status="failed",
            details={"error": str(e)}
        )
        
        raise HTTPException(status_code=500, detail=f"Signing failed: {str(e)}")

@router.get("/keys/public")
async def get_public_key():
    """Get public key for verification"""
    try:
        public_key_fingerprint = await signature_engine.get_public_key_fingerprint()
        
        return {
            "public_key_fingerprint": public_key_fingerprint,
            "algorithm": "RSA-2048",
            "purpose": "signature_verification"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get public key: {str(e)}")