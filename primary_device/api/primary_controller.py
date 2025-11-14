from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import List, Dict, Any
import json

from models.schemas import (
    SystemStatus, NetworkStats, ThreatReport, 
    PolicyConfig, LogEntry, SignatureRequest
)
from core.packet_analyzer import PacketAnalyzer
from services.network_monitor import NetworkMonitor
from services.threat_detector import ThreatDetector
from utils.crypto_helper import CryptoHelper

router = APIRouter()

# Initialize services
packet_analyzer = PacketAnalyzer()
network_monitor = NetworkMonitor()
threat_detector = ThreatDetector()
crypto_helper = CryptoHelper()

@router.get("/status", response_model=SystemStatus)
async def get_system_status():
    """Get overall system status"""
    return {
        "status": "operational",
        "threat_level": "low",
        "active_connections": 150,
        "blocked_threats": 25,
        "system_health": 95.5
    }

@router.get("/network/stats", response_model=NetworkStats)
async def get_network_stats():
    """Get network statistics"""
    return {
        "total_packets": 10000,
        "packets_per_second": 150,
        "bandwidth_usage": "45.2 Mbps",
        "active_threats": 3,
        "blocked_attempts": 12
    }

@router.get("/threats/current", response_model=List[ThreatReport])
async def get_current_threats():
    """Get current active threats"""
    # This would query the threat detector for active threats
    return [
        {
            "threat_id": "threat_001",
            "timestamp": "2024-01-01T10:30:00Z",
            "severity": "high",
            "type": "suspicious_outbound",
            "source_ip": "192.168.1.100",
            "description": "Unusual outbound data transfer",
            "status": "blocked"
        }
    ]

@router.post("/policy/enforce")
async def enforce_policy(policy: PolicyConfig, background_tasks: BackgroundTasks):
    """Enforce a new security policy"""
    try:
        # This would integrate with the policy enforcer
        background_tasks.add_task(
            threat_detector.update_policies,
            policy.dict()
        )
        return {"success": True, "message": "Policy enforcement started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/logs/submit")
async def submit_log_entry(log_entry: LogEntry):
    """Submit a log entry for cryptographic signing"""
    try:
        # Generate hash for the log entry
        log_hash = crypto_helper.generate_hash(log_entry.json())
        
        # Create signature request
        signature_request = SignatureRequest(
            log_hash=log_hash,
            previous_hash="prev_hash_placeholder",  # Would get from chain
            timestamp=log_entry.timestamp,
            device_id="primary_device_001"
        )
        
        # Send to secondary device for signing
        # signed_log = await send_to_secondary(signature_request)
        
        return {
            "success": True,
            "message": "Log submitted for signing",
            "log_hash": log_hash
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ai/models/status")
async def get_ai_models_status():
    """Get status of AI/ML models"""
    return {
        "autoencoder": {
            "status": "active",
            "accuracy": 0.956,
            "last_training": "2024-01-01T08:00:00Z"
        },
        "isolation_forest": {
            "status": "active", 
            "precision": 0.923,
            "last_training": "2024-01-01T08:00:00Z"
        }
    }