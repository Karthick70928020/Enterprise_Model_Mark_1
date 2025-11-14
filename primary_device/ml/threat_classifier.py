import numpy as np
from typing import Dict, Any, List
from datetime import datetime

class ThreatClassifier:
    def __init__(self):
        self.model = None
        self.feature_names = [
            'packet_size', 'protocol_type', 'source_bytes', 
            'destination_bytes', 'count', 'serror_rate', 'rerror_rate'
        ]
        self.threat_categories = [
            'normal', 'probe', 'dos', 'u2r', 'r2l'
        ]
        
    async def initialize_model(self):
        """Initialize threat classification model"""
        # In production, this would load a pre-trained model
        # For demo, we'll use a simple rule-based approach
        print("Threat classification model initialized")
        
    async def classify_threat(self, features: Dict[str, float]) -> Dict[str, Any]:
        """Classify threat based on features"""
        # Extract features
        feature_vector = [features.get(name, 0) for name in self.feature_names]
        
        # Simple rule-based classification for demo
        threat_score = self._calculate_threat_score(feature_vector)
        threat_category = self._determine_threat_category(threat_score)
        confidence = self._calculate_confidence(feature_vector)
        
        return {
            "threat_category": threat_category,
            "threat_score": threat_score,
            "confidence": confidence,
            "timestamp": datetime.utcnow().isoformat(),
            "features_used": self.feature_names
        }
    
    def _calculate_threat_score(self, features: List[float]) -> float:
        """Calculate threat score from features"""
        # Simple weighted sum for demo
        weights = [0.1, 0.2, 0.15, 0.15, 0.2, 0.1, 0.1]
        score = sum(w * f for w, f in zip(weights, features))
        return min(score / 100, 1.0)  # Normalize to 0-1
    
    def _determine_threat_category(self, score: float) -> str:
        """Determine threat category based on score"""
        if score >= 0.8:
            return "r2l"  # Remote to local
        elif score >= 0.6:
            return "u2r"  # User to root
        elif score >= 0.4:
            return "dos"  # Denial of service
        elif score >= 0.2:
            return "probe"  # Surveillance
        else:
            return "normal"
    
    def _calculate_confidence(self, features: List[float]) -> float:
        """Calculate classification confidence"""
        # Simple confidence calculation based on feature completeness
        non_zero_features = sum(1 for f in features if f > 0)
        confidence = non_zero_features / len(features)
        return round(confidence, 3)
    
    async def batch_classify(self, feature_list: List[Dict[str, float]]) -> List[Dict[str, Any]]:
        """Classify multiple feature sets"""
        results = []
        for features in feature_list:
            result = await self.classify_threat(features)
            results.append(result)
        return results