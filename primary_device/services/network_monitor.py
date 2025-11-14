import asyncio
import random
from datetime import datetime
from typing import Dict, Any, Callable
import json

class NetworkMonitor:
    def __init__(self):
        self.is_monitoring = False
        self.packet_handlers = []
        self.monitoring_stats = {
            "start_time": None,
            "packets_processed": 0,
            "threats_detected": 0
        }
    
    async def start_monitoring(self):
        """Start network monitoring"""
        self.is_monitoring = True
        self.monitoring_stats["start_time"] = datetime.utcnow().isoformat()
        print("Network monitoring started")
        
        # Start the packet generation simulation
        asyncio.create_task(self._simulate_packet_capture())
    
    async def stop_monitoring(self):
        """Stop network monitoring"""
        self.is_monitoring = False
        print("Network monitoring stopped")
    
    def add_packet_handler(self, handler: Callable):
        """Add a packet handler for processing packets"""
        self.packet_handlers.append(handler)
    
    async def _simulate_packet_capture(self):
        """Simulate packet capture for demonstration"""
        packet_types = [
            {"protocol": "TCP", "risk": "low"},
            {"protocol": "UDP", "risk": "low"},
            {"protocol": "HTTP", "risk": "medium"},
            {"protocol": "HTTPS", "risk": "low"},
            {"protocol": "DNS", "risk": "low"},
            {"protocol": "FTP", "risk": "high"},
            {"protocol": "SSH", "risk": "medium"},
        ]
        
        while self.is_monitoring:
            # Generate simulated packet
            packet_type = random.choice(packet_types)
            packet = self._generate_simulated_packet(packet_type)
            
            # Process packet through all handlers
            for handler in self.packet_handlers:
                await handler(packet)
            
            self.monitoring_stats["packets_processed"] += 1
            
            # Random delay to simulate real traffic
            await asyncio.sleep(random.uniform(0.1, 0.5))
    
    def _generate_simulated_packet(self, packet_type: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a simulated network packet"""
        source_ips = ["192.168.1.100", "192.168.1.101", "192.168.1.102", "10.0.0.50"]
        dest_ips = ["8.8.8.8", "1.1.1.1", "142.251.32.110", "151.101.1.69"]
        
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "source": random.choice(source_ips),
            "destination": random.choice(dest_ips),
            "protocol": packet_type["protocol"],
            "size": random.randint(64, 1500),
            "risk_level": packet_type["risk"],
            "flags": random.randint(0, 255),
            "payload_sample": "simulated_payload_data"
        }
    
    def get_monitoring_stats(self) -> Dict[str, Any]:
        """Get monitoring statistics"""
        return self.monitoring_stats.copy()