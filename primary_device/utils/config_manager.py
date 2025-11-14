import json
import yaml
from typing import Dict, Any, Optional
from pathlib import Path

class ConfigManager:
    def __init__(self, config_path: Optional[str] = None):
        self.config_path = Path(config_path) if config_path else Path("config")
        self.config_data = {}
        
    def load_config(self, environment: str = "development") -> Dict[str, Any]:
        """Load configuration for specified environment"""
        config_file = self.config_path / f"{environment}.json"
        
        if config_file.exists():
            with open(config_file, 'r') as f:
                self.config_data = json.load(f)
        else:
            # Fallback to default configuration
            self.config_data = self._get_default_config()
        
        return self.config_data
    
    def _get_default_config(self) -> Dict[str, Any]:
        """Get default configuration"""
        return {
            "environment": "development",
            "logging": {
                "level": "INFO",
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            },
            "api": {
                "host": "localhost",
                "port": 8000,
                "debug": True
            }
        }
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value by key"""
        keys = key.split('.')
        value = self.config_data
        
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default
        
        return value
    
    def update_config(self, updates: Dict[str, Any]):
        """Update configuration with new values"""
        def update_nested(config_dict, update_dict):
            for key, value in update_dict.items():
                if isinstance(value, dict) and key in config_dict and isinstance(config_dict[key], dict):
                    update_nested(config_dict[key], value)
                else:
                    config_dict[key] = value
        
        update_nested(self.config_data, updates)