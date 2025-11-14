import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Sidebar state
  sidebarOpen: boolean;
  activeDevice: 'primary' | 'secondary';
  
  // Theme and appearance
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  
  // Dashboard settings
  autoRefresh: boolean;
  refreshInterval: number;
  visibleMetrics: string[];
  
  // Notification preferences
  showNotifications: boolean;
  notificationSound: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setActiveDevice: (device: 'primary' | 'secondary') => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleCompactMode: () => void;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  toggleMetricVisibility: (metricId: string) => void;
  setNotificationPreferences: (show: boolean, sound: boolean) => void;
  resetSettings: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarOpen: true,
      activeDevice: 'primary',
      theme: 'light',
      compactMode: false,
      autoRefresh: true,
      refreshInterval: 10000, // 10 seconds
      visibleMetrics: [
        'network_traffic',
        'threat_level',
        'system_health',
        'crypto_status',
        'audit_integrity'
      ],
      showNotifications: true,
      notificationSound: true,

      // Actions
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setActiveDevice: (device) => {
        set({ activeDevice: device });
      },

      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          // System theme - check prefers-color-scheme
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (isDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },

      toggleCompactMode: () => {
        set((state) => ({ compactMode: !state.compactMode }));
      },

      setAutoRefresh: (enabled) => {
        set({ autoRefresh: enabled });
      },

      setRefreshInterval: (interval) => {
        set({ refreshInterval: Math.max(2000, interval) }); // Minimum 2 seconds
      },

      toggleMetricVisibility: (metricId) => {
        set((state) => {
          const currentMetrics = [...state.visibleMetrics];
          const index = currentMetrics.indexOf(metricId);
          
          if (index > -1) {
            // Remove metric
            currentMetrics.splice(index, 1);
          } else {
            // Add metric
            currentMetrics.push(metricId);
          }
          
          return { visibleMetrics: currentMetrics };
        });
      },

      setNotificationPreferences: (show, sound) => {
        set({ 
          showNotifications: show,
          notificationSound: sound 
        });
      },

      resetSettings: () => {
        set({
          sidebarOpen: true,
          theme: 'light',
          compactMode: false,
          autoRefresh: true,
          refreshInterval: 10000,
          visibleMetrics: [
            'network_traffic',
            'threat_level',
            'system_health',
            'crypto_status',
            'audit_integrity'
          ],
          showNotifications: true,
          notificationSound: true
        });
      }
    }),
    {
      name: 'aegis-ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        compactMode: state.compactMode,
        autoRefresh: state.autoRefresh,
        refreshInterval: state.refreshInterval,
        visibleMetrics: state.visibleMetrics,
        showNotifications: state.showNotifications,
        notificationSound: state.notificationSound
      })
    }
  )
);

// Additional UI utility functions
export const UIUtils = {
  // Get appropriate color based on threat level
  getThreatColor: (level: string): string => {
    switch (level) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  },

  // Format numbers for display
  formatNumber: (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },

  // Format bytes for display
  formatBytes: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  // Format timestamp for display
  formatTimestamp: (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  },

  // Get status indicator color
  getStatusColor: (status: string): string => {
    switch (status) {
      case 'healthy':
      case 'operational':
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'degraded':
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'offline':
      case 'error':
      case 'inactive':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }
};

// Custom hooks for UI functionality
export const useUI = () => {
  const {
    theme,
    setTheme,
    compactMode,
    toggleCompactMode,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval
  } = useUIStore();

  return {
    theme,
    setTheme,
    compactMode,
    toggleCompactMode,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
    UIUtils
  };
};