import socket
import subprocess
from typing import Optional, List, Dict, Any

class NetworkUtils:
    @staticmethod
    def get_local_ip() -> str:
        """Get local IP address"""
        try:
            # Connect to a remote address to determine local IP
            with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
                s.connect(("8.8.8.8", 80))
                return s.getsockname()[0]
        except Exception:
            return "127.0.0.1"
    
    @staticmethod
    def is_port_open(host: str, port: int) -> bool:
        """Check if port is open on host"""
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(1)
                s.connect((host, port))
                return True
        except (socket.timeout, ConnectionRefusedError):
            return False
    
    @staticmethod
    def get_network_interfaces() -> List[Dict[str, Any]]:
        """Get list of network interfaces"""
        try:
            # This would use platform-specific commands
            # For demo, return mock data
            return [
                {"name": "eth0", "status": "up", "ip": "192.168.1.100"},
                {"name": "wlan0", "status": "up", "ip": "192.168.1.101"},
                {"name": "lo", "status": "up", "ip": "127.0.0.1"}
            ]
        except Exception:
            return []
    
    @staticmethod
    def validate_ip_address(ip: str) -> bool:
        """Validate IP address format"""
        try:
            socket.inet_aton(ip)
            return True
        except socket.error:
            return False
    
    @staticmethod
    def get_hostname() -> str:
        """Get system hostname"""
        return socket.gethostname()