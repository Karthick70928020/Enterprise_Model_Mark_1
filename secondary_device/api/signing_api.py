from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, Any

from models.schemas import SignatureRequest, SignatureResponse
from core.key_manager import KeyManager
from services.totp_generator import TOTPGenerator
from services.secure_storage import SecureStorage

router = APIRouter()

key_manager = KeyManager()
totp_generator = TOTPGenerator()
secure_storage = SecureStorage()

@router.post("/sign/log", response_model=SignatureResponse)
async def sign_log_entry(request: SignatureRequest, background_tasks: BackgroundTasks):
    """Sign a log entry with cryptographic signature"""
    try:
        # Verify TOTP (in production, this would be required)
        # if not totp_generator.verify_code(request.totp_code):
        #     raise HTTPException(status_code=401, detail="Invalid TOTP code")
        
        # Create data to sign
        data_to_sign = f"{request.log_hash}{request.previous_hash}{request.timestamp.isoformat()}"
        
        # Generate signature
        signature_info = await key_manager.sign_data(data_to_sign, "000000")  # Demo TOTP
        
        # Prepare log data for storage
        log_data = {
            "log_hash": request.log_hash,
            "previous_hash": request.previous_hash,
            "timestamp": request.timestamp.isoformat(),
            "device_id": request.device_id,
            "data_to_sign": data_to_sign
        }
        
        # Store in secure audit trail (async)
        background_tasks.add_task(
            secure_storage.store_signed_log,
            log_data,
            signature_info
        )
        
        return SignatureResponse(
            signature=signature_info["signature"],
            signed_at=signature_info["timestamp"],
            public_key=signature_info["public_key_fingerprint"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signing failed: {str(e)}")

@router.post("/verify/signature")
async def verify_signature(verification_data: Dict[str, Any]):
    """Verify a signature"""
    try:
        data = verification_data.get("data")
        signature = verification_data.get("signature")
        public_key_pem = verification_data.get("public_key")
        
        if not all([data, signature, public_key_pem]):
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        is_valid = await key_manager.verify_signature(data, signature, public_key_pem)
        
        return {
            "verified": is_valid,
            "timestamp": "2024-01-01T00:00:00Z"  # Use actual timestamp
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")

@router.get("/totp/current")
async def get_current_totp():
    """Get current TOTP code (for demonstration only)"""
    # In production, this endpoint would not exist
    # It's here only for demo purposes
    try:
        current_code = totp_generator.generate_current_code()
        remaining_time = totp_generator.get_remaining_time()
        
        return {
            "current_code": current_code,
            "remaining_seconds": int(remaining_time),
            "valid_until": "2024-01-01T00:00:00Z"  # Use actual timestamp
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TOTP generation failed: {str(e)}")