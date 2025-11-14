import numpy as np
from typing import Dict, Any, List
from datetime import datetime

class FeatureExtractor:
    def __init__(self):
        self.feature_names = [
            'packet_size', 'protocol_type', 'duration', 'source_bytes',
            'destination_bytes', 'count', 'serror_rate', 'rerror_rate',
            'same_srv_rate', 'diff_srv_rate', 'srv_count'
        ]
        
    async def extract_network_features(self, packet_data: Dict[str, Any]) -> List[float]:
        """Extract features from network packet data"""
        features = []
        
        # Packet size features
        features.append(packet_data.get('size', 0) / 1500)  # Normalized by MTU
        
        # Protocol features (one-hot encoded)
        protocol_features = self._encode_protocol(packet_data.get('protocol', 'TCP'))
        features.extend(protocol_features)
        
        # Statistical features (simulated)
        features.append(self._calculate_entropy(packet_data.get('payload', '')))
        features.append(packet_data.get('flags', 0) / 255)  # Normalized flags
        
        # Connection features
        features.append(packet_data.get('source_port', 0) / 65535)
        features.append(packet_data.get('dest_port', 0) / 65535)
        
        # Ensure we have exactly 11 features
        while len(features) < 11:
            features.append(0.0)
        
        return features[:11]  # Return exactly 11 features
    
    def _encode_protocol(self, protocol: str) -> List[float]:
        """One-hot encode protocol"""
        protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS']
        encoding = [0.0] * len(protocols)
        
        if protocol in protocols:
            encoding[protocols.index(protocol)] = 1.0
        
        return encoding
    
    def _calculate_entropy(self, data: str) -> float:
        """Calculate entropy of data"""
        if not data:
            return 0.0
        
        # Simple entropy calculation
        import math
        from collections import Counter
        
        counter = Counter(data)
        entropy = 0.0
        total_len = len(data)
        
        for count in counter.values():
            p_x = count / total_len
            entropy += -p_x * math.log2(p_x)
        
        return entropy / 8.0  # Normalize by max entropy for bytes
    
    async def extract_system_features(self, system_data: Dict[str, Any]) -> List[float]:
        """Extract features from system data"""
        features = [
            system_data.get('cpu_usage', 0) / 100,
            system_data.get('memory_usage', 0) / 100,
            system_data.get('disk_usage', 0) / 100,
            system_data.get('active_connections', 0) / 1000,
            system_data.get('failed_logins', 0) / 10
        ]
        
        # Pad with zeros if needed
        while len(features) < 8:
            features.append(0.0)
        
        return features[:8]
    
    def get_feature_names(self) -> List[str]:
        """Get feature names"""
        return self.feature_names.copy()