import asyncio
from datetime import datetime
from typing import Dict, Any, List
import platform
import subprocess
import re

class SystemLogCollector:
    def __init__(self):
        self.is_collecting = False
        self.collected_logs = []
        self.system_info = self._get_system_info()
        
    def _get_system_info(self) -> Dict[str, Any]:
        """Get system information"""
        return {
            "platform": platform.system(),
            "platform_version": platform.version(),
            "architecture": platform.architecture()[0],
            "hostname": platform.node(),
            "processor": platform.processor()
        }
    
    async def start_collection(self):
        """Start system log collection"""
        self.is_collecting = True
        print("System log collection started")
        
        # Start background collection task
        asyncio.create_task(self._collect_logs_continuously())
    
    async def stop_collection(self):
        """Stop system log collection"""
        self.is_collecting = False
        print("System log collection stopped")
    
    async def _collect_logs_continuously(self):
        """Continuously collect system logs"""
        while self.is_collecting:
            try:
                # Collect various system logs
                await self._collect_system_logs()
                await self._collect_network_stats()
                await self._collect_security_events()
                
                # Wait before next collection
                await asyncio.sleep(30)  # Collect every 30 seconds
                
            except Exception as e:
                print(f"Error collecting system logs: {e}")
                await asyncio.sleep(60)  # Wait longer on error
    
    async def _collect_system_logs(self):
        """Collect system-level logs"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "type": "system_health",
            "source": "system_collector",
            "severity": "info",
            "details": {
                "cpu_usage": await self._get_cpu_usage(),
                "memory_usage": await self._get_memory_usage(),
                "disk_usage": await self._get_disk_usage(),
                "system_uptime": await self._get_system_uptime()
            }
        }
        
        self.collected_logs.append(log_entry)
    
    async def _collect_network_stats(self):
        """Collect network statistics"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "type": "network_stats", 
            "source": "system_collector",
            "severity": "info",
            "details": {
                "active_connections": await self._get_active_connections(),
                "network_interfaces": await self._get_network_interfaces(),
                "bandwidth_usage": "simulated_data"  # Would use real monitoring
            }
        }
        
        self.collected_logs.append(log_entry)
    
    async def _collect_security_events(self):
        """Collect security-related events"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "type": "security_scan",
            "source": "system_collector", 
            "severity": "info",
            "details": {
                "failed_logins": await self._get_failed_logins(),
                "suspicious_processes": await self._get_suspicious_processes(),
                "firewall_status": "active"
            }
        }
        
        self.collected_logs.append(log_entry)
    
    async def _get_cpu_usage(self) -> float:
        """Get CPU usage percentage"""
        # Simplified for demo - would use psutil in production
        import random
        return round(random.uniform(5, 80), 2)
    
    async def _get_memory_usage(self) -> float:
        """Get memory usage percentage"""
        import random
        return round(random.uniform(30, 90), 2)
    
    async def _get_disk_usage(self) -> float:
        """Get disk usage percentage"""
        import random
        return round(random.uniform(20, 85), 2)
    
    async def _get_system_uptime(self) -> str:
        """Get system uptime"""
        return "7 days, 12:30:15"  # Simplified
    
    async def _get_active_connections(self) -> int:
        """Get number of active network connections"""
        import random
        return random.randint(50, 500)
    
    async def _get_network_interfaces(self) -> List[str]:
        """Get network interfaces"""
        return ["eth0", "wlan0", "lo"]
    
    async def _get_failed_logins(self) -> int:
        """Get number of failed login attempts"""
        import random
        return random.randint(0, 5)
    
    async def _get_suspicious_processes(self) -> List[str]:
        """Get suspicious processes"""
        return []  # Simplified
    
    def get_recent_logs(self, count: int = 50) -> List[Dict[str, Any]]:
        """Get recently collected logs"""
        return self.collected_logs[-count:] if self.collected_logs else []
    
    def get_collection_stats(self) -> Dict[str, Any]:
        """Get collection statistics"""
        type_counts = {}
        for log in self.collected_logs:
            log_type = log.get("type", "unknown")
            type_counts[log_type] = type_counts.get(log_type, 0) + 1
        
        return {
            "total_logs": len(self.collected_logs),
            "log_types": type_counts,
            "system_info": self.system_info,
            "collection_active": self.is_collecting
        }