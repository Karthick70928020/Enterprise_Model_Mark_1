import { create } from 'zustand';
import { NetworkStats } from '../../types/primary';
import { networkApiService } from '../../services/api/primary/networkApi';

interface NetworkState {
  // Network Data
  networkStats: NetworkStats | null;
  trafficData: any[];
  protocolStats: any[];
  topTalkers: any[];
  
  // Loading States
  loading: boolean;
  error: string | null;
  
  // Actions
  setNetworkStats: (stats: NetworkStats) => void;
  setTrafficData: (data: any[]) => void;
  setProtocolStats: (stats: any[]) => void;
  setTopTalkers: (talkers: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async Actions
  fetchNetworkStats: () => Promise<void>;
  fetchTrafficData: (timeRange: string) => Promise<void>;
  fetchProtocolStats: () => Promise<void>;
  fetchTopTalkers: (limit?: number) => Promise<void>;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  // Initial State
  networkStats: null,
  trafficData: [],
  protocolStats: [],
  topTalkers: [],
  loading: false,
  error: null,

  // Synchronous Actions
  setNetworkStats: (stats) => set({ networkStats: stats }),
  setTrafficData: (data) => set({ trafficData: data }),
  setProtocolStats: (stats) => set({ protocolStats: stats }),
  setTopTalkers: (talkers) => set({ topTalkers: talkers }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Async Actions
  fetchNetworkStats: async () => {
    try {
      set({ loading: true, error: null });
      const stats = await networkApiService.getLiveTraffic();
      set({ networkStats: stats, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch network stats', loading: false });
    }
  },

  fetchTrafficData: async (timeRange: string = '1h') => {
    try {
      set({ loading: true, error: null });
      const data = await networkApiService.getBandwidthUsage(timeRange);
      set({ trafficData: data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch traffic data', loading: false });
    }
  },

  fetchProtocolStats: async () => {
    try {
      set({ loading: true, error: null });
      const stats = await networkApiService.getProtocolStats();
      set({ protocolStats: stats, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch protocol stats', loading: false });
    }
  },

  fetchTopTalkers: async (limit: number = 10) => {
    try {
      set({ loading: true, error: null });
      const talkers = await networkApiService.getTopTalkers(limit);
      set({ topTalkers: talkers, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch top talkers', loading: false });
    }
  }
}));