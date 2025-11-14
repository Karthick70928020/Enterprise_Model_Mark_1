import { create } from 'zustand';
import { ThreatReport } from '../../types/primary';
import { threatApiService } from '../../services/api/primary/threatApi';

interface ThreatState {
  // Threat Data
  currentThreats: ThreatReport[];
  threatHistory: any[];
  behavioralData: any[];
  patterns: any[];
  
  // Loading States
  loading: boolean;
  error: string | null;
  
  // Actions
  setCurrentThreats: (threats: ThreatReport[]) => void;
  setThreatHistory: (history: any[]) => void;
  setBehavioralData: (data: any[]) => void;
  setPatterns: (patterns: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async Actions
  fetchCurrentThreats: () => Promise<void>;
  fetchThreatHistory: (days?: number) => Promise<void>;
  fetchBehavioralData: () => Promise<void>;
  fetchPatterns: () => Promise<void>;
  mitigateThreat: (threatId: string, action: string) => Promise<void>;
}

export const useThreatStore = create<ThreatState>((set, get) => ({
  // Initial State
  currentThreats: [],
  threatHistory: [],
  behavioralData: [],
  patterns: [],
  loading: false,
  error: null,

  // Synchronous Actions
  setCurrentThreats: (threats) => set({ currentThreats: threats }),
  setThreatHistory: (history) => set({ threatHistory: history }),
  setBehavioralData: (data) => set({ behavioralData: data }),
  setPatterns: (patterns) => set({ patterns: patterns }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Async Actions
  fetchCurrentThreats: async () => {
    try {
      set({ loading: true, error: null });
      const threats = await threatApiService.getActiveThreats();
      set({ currentThreats: threats, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch current threats', loading: false });
    }
  },

  fetchThreatHistory: async (days: number = 7) => {
    try {
      set({ loading: true, error: null });
      const history = await threatApiService.getThreatHistory(days);
      set({ threatHistory: history, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch threat history', loading: false });
    }
  },

  fetchBehavioralData: async () => {
    try {
      set({ loading: true, error: null });
      const data = await threatApiService.getBehavioralAnalysis();
      set({ behavioralData: data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch behavioral data', loading: false });
    }
  },

  fetchPatterns: async () => {
    try {
      set({ loading: true, error: null });
      const patterns = await threatApiService.getDetectedPatterns();
      set({ patterns: patterns, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch patterns', loading: false });
    }
  },

  mitigateThreat: async (threatId: string, action: string) => {
    try {
      set({ loading: true, error: null });
      await threatApiService.mitigateThreat(threatId, action);
      
      // Refresh current threats after mitigation
      await get().fetchCurrentThreats();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to mitigate threat', loading: false });
    }
  }
}));