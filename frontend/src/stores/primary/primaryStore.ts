import { create } from 'zustand';
import { SystemStatus, NetworkStats, ThreatReport } from '../../types/api';

interface PrimaryState {
  // System State
  systemStatus: SystemStatus | null;
  networkStats: NetworkStats | null;
  currentThreats: ThreatReport[];
  aiModelsStatus: any;
  
  // Loading States
  loading: boolean;
  error: string | null;
  
  // Actions
  setSystemStatus: (status: SystemStatus) => void;
  setNetworkStats: (stats: NetworkStats) => void;
  setCurrentThreats: (threats: ThreatReport[]) => void;
  setAIModelsStatus: (status: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async Actions
  fetchSystemStatus: () => Promise<void>;
  fetchNetworkStats: () => Promise<void>;
  fetchCurrentThreats: () => Promise<void>;
  fetchAIModelsStatus: () => Promise<void>;
}

export const usePrimaryStore = create<PrimaryState>((set, get) => ({
  // Initial State
  systemStatus: null,
  networkStats: null,
  currentThreats: [],
  aiModelsStatus: null,
  loading: false,
  error: null,

  // Synchronous Actions
  setSystemStatus: (status) => set({ systemStatus: status }),
  setNetworkStats: (stats) => set({ networkStats: stats }),
  setCurrentThreats: (threats) => set({ currentThreats: threats }),
  setAIModelsStatus: (status) => set({ aiModelsStatus: status }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Async Actions
  fetchSystemStatus: async () => {
    try {
      set({ loading: true, error: null });
      const { primaryApiService } = await import('../../services/api/primary/primaryApi');
      const status = await primaryApiService.getSystemStatus();
      set({ systemStatus: status, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch system status', loading: false });
    }
  },

  fetchNetworkStats: async () => {
    try {
      set({ loading: true, error: null });
      const { primaryApiService } = await import('../../services/api/primary/primaryApi');
      const stats = await primaryApiService.getNetworkStats();
      set({ networkStats: stats, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch network stats', loading: false });
    }
  },

  fetchCurrentThreats: async () => {
    try {
      set({ loading: true, error: null });
      const { primaryApiService } = await import('../../services/api/primary/primaryApi');
      const threats = await primaryApiService.getCurrentThreats();
      set({ currentThreats: threats, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch current threats', loading: false });
    }
  },

  fetchAIModelsStatus: async () => {
    try {
      set({ loading: true, error: null });
      const { primaryApiService } = await import('../../services/api/primary/primaryApi');
      const status = await primaryApiService.getAIModelsStatus();
      set({ aiModelsStatus: status, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch AI models status', loading: false });
    }
  },
}));