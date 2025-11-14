import { create } from 'zustand';
import { usePrimaryStore } from './primaryStore';
import { useSecondaryStore } from './secondaryStore';
import { useUIStore } from './shared/uiStore';
import { useNotificationStore } from './shared/notificationStore';
import { useConfigStore } from './shared/configStore';

interface RootState {
  // System-wide state
  initialized: boolean;
  systemStatus: 'loading' | 'ready' | 'error';
  lastUpdate: string;
  
  // Actions
  initialize: () => Promise<void>;
  refreshAll: () => Promise<void>;
  getSystemHealth: () => { status: string; components: any };
}

export const useRootStore = create<RootState>((set, get) => ({
  initialized: false,
  systemStatus: 'loading',
  lastUpdate: new Date().toISOString(),

  initialize: async () => {
    try {
      set({ systemStatus: 'loading' });
      
      // Initialize all stores
      await Promise.all([
        usePrimaryStore.getState().fetchSystemStatus(),
        useSecondaryStore.getState().fetchCryptoStatus(),
        useConfigStore.getState().loadConfig()
      ]);

      set({
        initialized: true,
        systemStatus: 'ready',
        lastUpdate: new Date().toISOString()
      });

      // Show welcome notification
      useNotificationStore.getState().addNotification({
        type: 'success',
        title: 'System Ready',
        message: 'Project Aegis is now fully operational and monitoring your network.'
      });

    } catch (error) {
      set({ systemStatus: 'error' });
      
      useNotificationStore.getState().addNotification({
        type: 'error',
        title: 'Initialization Failed',
        message: 'Failed to initialize system components. Please check your configuration.'
      });
    }
  },

  refreshAll: async () => {
    try {
      // Refresh data from all stores
      await Promise.all([
        usePrimaryStore.getState().fetchSystemStatus(),
        usePrimaryStore.getState().fetchNetworkStats(),
        usePrimaryStore.getState().fetchCurrentThreats(),
        useSecondaryStore.getState().fetchCryptoStatus(),
        useSecondaryStore.getState().fetchAuditStatus()
      ]);

      set({
        lastUpdate: new Date().toISOString()
      });

      useNotificationStore.getState().addNotification({
        type: 'success',
        title: 'Data Refreshed',
        message: 'All system data has been updated successfully.'
      });

    } catch (error) {
      useNotificationStore.getState().addNotification({
        type: 'error',
        title: 'Refresh Failed',
        message: 'Failed to refresh system data. Some information may be outdated.'
      });
    }
  },

  getSystemHealth: () => {
    const primaryState = usePrimaryStore.getState();
    const secondaryState = useSecondaryStore.getState();
    const uiState = useUIStore.getState();

    const components = {
      primary: primaryState.systemStatus?.status === 'operational' ? 'healthy' : 'degraded',
      secondary: secondaryState.cryptoStatus?.key_initialized ? 'healthy' : 'degraded',
      frontend: 'healthy',
      database: 'healthy'
    };

    const allHealthy = Object.values(components).every(status => status === 'healthy');
    
    return {
      status: allHealthy ? 'healthy' : 'degraded',
      components
    };
  }
}));

// Export a hook that provides access to all stores
export const useAegisStore = () => {
  const root = useRootStore();
  const primary = usePrimaryStore();
  const secondary = useSecondaryStore();
  const ui = useUIStore();
  const notifications = useNotificationStore();
  const config = useConfigStore();

  return {
    // Root state
    ...root,
    
    // Individual stores
    primary,
    secondary,
    ui,
    notifications,
    config,

    // Combined actions
    refreshAllData: async () => {
      await root.refreshAll();
    },

    // System status
    get overallStatus() {
      return root.getSystemHealth();
    },

    // Quick access to common data
    get threatLevel() {
      return primary.systemStatus?.threat_level || 'unknown';
    },

    get cryptoStatus() {
      return secondary.cryptoStatus?.key_initialized || false;
    },

    get unreadNotifications() {
      return notifications.unreadCount;
    }
  };
};