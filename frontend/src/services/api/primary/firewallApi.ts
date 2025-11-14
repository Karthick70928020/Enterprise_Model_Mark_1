import axios from 'axios';
import { FirewallRule, FirewallStats } from '../../../types/primary';

const FIREWALL_API_BASE = 'http://localhost:8000/api/v1/firewall';

const firewallApi = axios.create({
  baseURL: FIREWALL_API_BASE,
  timeout: 10000,
});

export const firewallApiService = {
  // Rules management
  getRules: async (): Promise<FirewallRule[]> => {
    const response = await firewallApi.get('/rules');
    return response.data;
  },

  createRule: async (rule: Partial<FirewallRule>): Promise<FirewallRule> => {
    const response = await firewallApi.post('/rules', rule);
    return response.data;
  },

  updateRule: async (ruleId: string, rule: Partial<FirewallRule>): Promise<FirewallRule> => {
    const response = await firewallApi.put(`/rules/${ruleId}`, rule);
    return response.data;
  },

  deleteRule: async (ruleId: string): Promise<void> => {
    await firewallApi.delete(`/rules/${ruleId}`);
  },

  toggleRule: async (ruleId: string, enabled: boolean): Promise<void> => {
    await firewallApi.patch(`/rules/${ruleId}`, { enabled });
  },

  // Firewall statistics
  getStats: async (): Promise<FirewallStats> => {
    const response = await firewallApi.get('/stats');
    return response.data;
  },

  // Rule logging
  getRuleLogs: async (limit: number = 50) => {
    const response = await firewallApi.get(`/logs?limit=${limit}`);
    return response.data;
  },

  // Policy management
  getPolicies: async () => {
    const response = await firewallApi.get('/policies');
    return response.data;
  },

  createPolicy: async (policy: any) => {
    const response = await firewallApi.post('/policies', policy);
    return response.data;
  },

  // DLP rules
  getDLPRules: async () => {
    const response = await firewallApi.get('/dlp/rules');
    return response.data;
  },

  createDLPRule: async (rule: any) => {
    const response = await firewallApi.post('/dlp/rules', rule);
    return response.data;
  }
};

export default firewallApiService;