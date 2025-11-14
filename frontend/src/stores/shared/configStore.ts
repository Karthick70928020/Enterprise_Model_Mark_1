import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SystemConfig {
  // API Configuration
  primaryApiUrl: string;
  secondaryApiUrl: string;
  apiTimeout: number;
  
  // Security Settings
  autoBlockThreshold: number;
  dataRetentionDays: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  
  // Notification Settings
  emailAlerts: boolean;
  pushNotifications: boolean;
  alertThreshold: 'low' | 'medium' | 'high';
  
  // Backup Settings
  autoBackup: boolean;
  backupInterval: number; // hours
  backupRetention: number; // days
}

interface ConfigState {
  config: SystemConfig;
  isLoaded: boolean;
  
  // Actions
  updateConfig: (updates: Partial<SystemConfig>) => void;
  resetConfig: () => void;
  loadConfig: () => Promise<void>;
  saveConfig: () => Promise<void>;
}

const defaultConfig: SystemConfig = {
  primaryApiUrl: 'http://localhost:8000/api/v1',
  secondaryApiUrl: 'http://localhost:8001/api/v1',
  apiTimeout: 10000,
  autoBlockThreshold: 0.8,
  dataRetentionDays: 90,
  logLevel: 'info',
  emailAlerts: true,
  pushNotifications: true,
  alertThreshold: 'medium',
  autoBackup: true,
  backupInterval: 24,
  backupRetention: 30
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      isLoaded: false,

      updateConfig: (updates) => {
        set((state) => ({
          config: { ...state.config, ...updates }
        }));
      },

      resetConfig: () => {
        set({
          config: defaultConfig
        });
      },

      loadConfig: async () => {
        // Simulate loading from API/localStorage
        setTimeout(() => {
          set({ isLoaded: true });
        }, 500);
      },

      saveConfig: async () => {
        // Simulate saving to API
        const { config } = get();
        console.log('Saving config:', config);
        
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      }
    }),
    {
      name: 'aegis-config-storage',
      partialize: (state) => ({ config: state.config })
    }
  )
);

// Configuration utility functions
export const ConfigUtils = {
  validateApiUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  getLogLevelColor: (level: string): string => {
    switch (level) {
      case 'error':
        return 'text-red-600';
      case 'warn':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      case 'debug':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  },

  formatConfigForDisplay: (config: SystemConfig) => {
    return {
      'API Settings': {
        'Primary API': config.primaryApiUrl,
        'Secondary API': config.secondaryApiUrl,
        'Timeout': `${config.apiTimeout}ms`
      },
      'Security': {
        'Auto-block Threshold': `${(config.autoBlockThreshold * 100).toFixed(0)}%`,
        'Data Retention': `${config.dataRetentionDays} days`,
        'Log Level': config.logLevel.toUpperCase()
      },
      'Notifications': {
        'Email Alerts': config.emailAlerts ? 'Enabled' : 'Disabled',
        'Push Notifications': config.pushNotifications ? 'Enabled' : 'Disabled',
        'Alert Threshold': config.alertThreshold.toUpperCase()
      },
      'Backup': {
        'Auto Backup': config.autoBackup ? 'Enabled' : 'Disabled',
        'Backup Interval': `${config.backupInterval} hours`,
        'Backup Retention': `${config.backupRetention} days`
      }
    };
  }
};