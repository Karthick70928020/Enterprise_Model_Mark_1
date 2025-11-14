from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import json
from datetime import datetime
from services.network_monitor import NetworkMonitor
from core.packet_analyzer import PacketAnalyzer

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.network_monitor = NetworkMonitor()
        self.packet_analyzer = PacketAnalyzer()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"Client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        print(f"Client disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        disconnected_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected_connections.append(connection)
        
        for connection in disconnected_connections:
            self.disconnect(connection)

manager = ConnectionManager()

@router.websocket("/primary")
async def websocket_primary(websocket: WebSocket):
    await manager.connect(websocket)
    
    # Send initial status
    await manager.broadcast({
        "type": "system_status",
        "data": {
            "status": "connected",
            "timestamp": datetime.utcnow().isoformat(),
            "device": "primary"
        }
    })
    
    try:
        # Simulate real-time data updates
        while True:
            # Send network stats
            stats = manager.network_monitor.get_monitoring_stats()
            await manager.broadcast({
                "type": "network_stats",
                "data": {
                    "packets_processed": stats["packets_processed"],
                    "threats_detected": stats["threats_detected"],
                    "timestamp": datetime.utcnow().isoformat()
                }
            })
            
            # Send AI analysis stats
            analyzer_stats = manager.packet_analyzer.get_stats()
            await manager.broadcast({
                "type": "ai_analysis",
                "data": {
                    "total_packets": analyzer_stats["total_packets"],
                    "suspicious_packets": analyzer_stats["suspicious_packets"],
                    "last_analysis": analyzer_stats["last_analysis"]
                }
            })
            
            # Simulate occasional threats
            import random
            if random.random() < 0.1:  # 10% chance
                await manager.broadcast({
                    "type": "threat_detected",
                    "data": {
                        "threat_id": f"threat_{random.randint(1000, 9999)}",
                        "timestamp": datetime.utcnow().isoformat(),
                        "severity": random.choice(["low", "medium", "high"]),
                        "type": "suspicious_connection",
                        "source_ip": f"192.168.1.{random.randint(100, 200)}",
                        "description": "Unusual outbound traffic pattern detected",
                        "status": "investigating"
                    }
                })
            
            await asyncio.sleep(2)  # Update every 2 seconds
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)