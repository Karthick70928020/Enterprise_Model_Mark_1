import { create } from 'zustand';
import { FirewallRule, FirewallStats } from '../../types/primary';
import { firewallApiService } from '../../services/api/primary/firewallApi';

interface FirewallState {
  // Firewall Data
  rules: FirewallRule[];
  stats: FirewallStats | null;
  ruleLogs: any[];
  policies: any[];
  dlpRules: any[];
  
  // Loading States
  loading: boolean;
  error: string | null;
  
  // Actions
  setRules: (rules: FirewallRule[]) => void;
  setStats: (stats: FirewallStats) => void;
  setRuleLogs: (logs: any[]) => void;
  setPolicies: (policies: any[]) => void;
  setDlpRules: (rules: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async Actions
  fetchRules: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchRuleLogs: (limit?: number) => Promise<void>;
  fetchPolicies: () => Promise<void>;
  fetchDlpRules: () => Promise<void>;
  addRule: (rule: Partial<FirewallRule>) => Promise<void>;
  updateRule: (ruleId: string, rule: Partial<FirewallRule>) => Promise<void>;
  deleteRule: (ruleId: string) => Promise<void>;
  enableRule: (ruleId: string) => Promise<void>;
  disableRule: (ruleId: string) => Promise<void>;
}

export const useFirewallStore = create<FirewallState>((set, get) => ({
  // Initial State
  rules: [],
  stats: null,
  ruleLogs: [],
  policies: [],
  dlpRules: [],
  loading: false,
  error: null,

  // Synchronous Actions
  setRules: (rules) => set({ rules }),
  setStats: (stats) => set({ stats }),
  setRuleLogs: (logs) => set({ ruleLogs: logs }),
  setPolicies: (policies) => set({ policies }),
  setDlpRules: (rules) => set({ dlpRules: rules }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Async Actions
  fetchRules: async () => {
    try {
      set({ loading: true, error: null });
      const rules = await firewallApiService.getRules();
      set({ rules, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch firewall rules', loading: false });
    }
  },

  fetchStats: async () => {
    try {
      set({ loading: true, error: null });
      const stats = await firewallApiService.getStats();
      set({ stats, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch firewall stats', loading: false });
    }
  },

  fetchRuleLogs: async (limit: number = 50) => {
    try {
      set({ loading: true, error: null });
      const logs = await firewallApiService.getRuleLogs(limit);
      set({ ruleLogs: logs, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch rule logs', loading: false });
    }
  },

  fetchPolicies: async () => {
    try {
      set({ loading: true, error: null });
      const policies = await firewallApiService.getPolicies();
      set({ policies, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch policies', loading: false });
    }
  },

  fetchDlpRules: async () => {
    try {
      set({ loading: true, error: null });
      const rules = await firewallApiService.getDLPRules();
      set({ dlpRules: rules, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch DLP rules', loading: false });
    }
  },

  addRule: async (rule: Partial<FirewallRule>) => {
    try {
      set({ loading: true, error: null });
      const newRule = await firewallApiService.createRule(rule);
      set(state => ({ 
        rules: [...state.rules, newRule],
        loading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to add firewall rule', loading: false });
    }
  },

  updateRule: async (ruleId: string, rule: Partial<FirewallRule>) => {
    try {
      set({ loading: true, error: null });
      const updatedRule = await firewallApiService.updateRule(ruleId, rule);
      set(state => ({
        rules: state.rules.map(r => r.id === ruleId ? updatedRule : r),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update firewall rule', loading: false });
    }
  },

  deleteRule: async (ruleId: string) => {
    try {
      set({ loading: true, error: null });
      await firewallApiService.deleteRule(ruleId);
      set(state => ({
        rules: state.rules.filter(r => r.id !== ruleId),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete firewall rule', loading: false });
    }
  },

  enableRule: async (ruleId: string) => {
    try {
      set({ loading: true, error: null });
      await firewallApiService.toggleRule(ruleId, true);
      set(state => ({
        rules: state.rules.map(r => 
          r.id === ruleId ? { ...r, enabled: true } : r
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to enable firewall rule', loading: false });
    }
  },

  disableRule: async (ruleId: string) => {
    try {
      set({ loading: true, error: null });
      await firewallApiService.toggleRule(ruleId, false);
      set(state => ({
        rules: state.rules.map(r => 
          r.id === ruleId ? { ...r, enabled: false } : r
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to disable firewall rule', loading: false });
    }
  }
}));