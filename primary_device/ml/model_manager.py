import asyncio
from datetime import datetime
from typing import Dict, Any, List

from ml.autoencoder_model import AutoencoderModel
from ml.isolation_forest_model import IsolationForestModel
from ml.feature_extractor import FeatureExtractor

class ModelManager:
    def __init__(self):
        self.autoencoder = AutoencoderModel()
        self.isolation_forest = IsolationForestModel()
        self.feature_extractor = FeatureExtractor()
        self.model_health = {
            "autoencoder": "healthy",
            "isolation_forest": "healthy"
        }
        
    async def initialize_models(self):
        """Initialize all ML models"""
        print("Initializing ML models...")
        
        await self.autoencoder.initialize()
        await self.isolation_forest.initialize()
        
        print("All ML models initialized successfully")
    
    async def analyze_data(self, data: Dict[str, Any], data_type: str = "network") -> Dict[str, Any]:
        """Analyze data using all models"""
        # Extract features
        if data_type == "network":
            features = await self.feature_extractor.extract_network_features(data)
        else:
            features = await self.feature_extractor.extract_system_features(data)
        
        # Get predictions from both models
        autoencoder_result = await self.autoencoder.detect_anomalies(features)
        isolation_forest_result = await self.isolation_forest.detect_outliers(features)
        
        # Combine results
        combined_score = (
            autoencoder_result.get('anomaly_score', 0) +
            isolation_forest_result.get('outlier_score', 0)
        ) / 2
        
        is_anomaly = (
            autoencoder_result.get('is_anomaly', False) or
            isolation_forest_result.get('is_outlier', False)
        )
        
        return {
            "combined_score": round(combined_score, 4),
            "is_anomaly": is_anomaly,
            "autoencoder_result": autoencoder_result,
            "isolation_forest_result": isolation_forest_result,
            "features_used": len(features),
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def health_check(self) -> Dict[str, Any]:
        """Check health of all models"""
        return {
            "autoencoder": {
                "status": self.model_health["autoencoder"],
                "is_trained": self.autoencoder.is_trained,
                "info": self.autoencoder.get_model_info()
            },
            "isolation_forest": {
                "status": self.model_health["isolation_forest"],
                "is_trained": self.isolation_forest.is_trained,
                "info": self.isolation_forest.get_model_info()
            },
            "feature_extractor": {
                "status": "healthy",
                "feature_count": len(self.feature_extractor.get_feature_names())
            }
        }
    
    async def train_models(self, training_data: List[Dict[str, Any]], data_type: str = "network"):
        """Train all models with new data"""
        print("Training ML models...")
        
        # Extract features from training data
        features = []
        for data_point in training_data:
            if data_type == "network":
                feature_vector = await self.feature_extractor.extract_network_features(data_point)
            else:
                feature_vector = await self.feature_extractor.extract_system_features(data_point)
            features.append(feature_vector)
        
        # Train models
        autoencoder_result = await self.autoencoder.train_model(features)
        isolation_forest_result = await self.isolation_forest.train_model(features)
        
        return {
            "autoencoder_training": autoencoder_result,
            "isolation_forest_training": isolation_forest_result,
            "total_samples": len(features),
            "feature_dimension": len(features[0]) if features else 0
        }
    
    def get_model_stats(self) -> Dict[str, Any]:
        """Get model statistics"""
        return {
            "models_initialized": self.autoencoder.is_trained and self.isolation_forest.is_trained,
            "feature_names": self.feature_extractor.get_feature_names(),
            "last_health_check": datetime.utcnow().isoformat()
        }