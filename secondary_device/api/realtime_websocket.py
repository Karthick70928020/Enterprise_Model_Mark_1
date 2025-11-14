from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import json
from datetime import datetime
from services.secure_storage import SecureStorage
from services.totp_generator import TOTPGenerator

router = APIRouter()

class SecondaryConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.secure_storage = SecureStorage()
        self.totp_generator = TOTPGenerator()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"Secondary client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        print(f"Secondary client disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        disconnected_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected_connections.append(connection)
        
        for connection in disconnected_connections:
            self.disconnect(connection)

manager = SecondaryConnectionManager()

@router.websocket("/secondary")
async def websocket_secondary(websocket: WebSocket):
    await manager.connect(websocket)
    
    # Send initial status
    await manager.broadcast({
        "type": "system_status",
        "data": {
            "status": "connected",
            "timestamp": datetime.utcnow().isoformat(),
            "device": "secondary",
            "security_level": "high"
        }
    })
    
    try:
        while True:
            # Send TOTP updates
            totp_status = await manager.totp_generator.get_totp_status()
            await manager.broadcast({
                "type": "totp_update",
                "data": {
                    "current_code": totp_status["current_code"],
                    "remaining_seconds": totp_status["remaining_seconds"],
                    "timestamp": datetime.utcnow().isoformat()
                }
            })
            
            # Send audit trail updates
            audit_stats = await manager.secure_storage.get_audit_trail_stats()
            await manager.broadcast({
                "type": "audit_update",
                "data": {
                    "block_count": audit_stats["block_count"],
                    "last_block": audit_stats["last_block"],
                    "current_chain_hash": audit_stats["current_chain_hash"]
                }
            })
            
            # Simulate signature events
            import random
            if random.random() < 0.15:  # 15% chance
                await manager.broadcast({
                    "type": "signature_created",
                    "data": {
                        "signature_id": f"sig_{random.randint(10000, 99999)}",
                        "timestamp": datetime.utcnow().isoformat(),
                        "log_hash": f"hash_{random.randint(1000, 9999)}",
                        "device": "primary_device",
                        "status": "signed"
                    }
                })
            
            await asyncio.sleep(3)  # Update every 3 seconds
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)