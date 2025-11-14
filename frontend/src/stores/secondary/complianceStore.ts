import { create } from 'zustand';
import { complianceApiService } from '../../services/api/secondary/complianceApi';

interface ComplianceState {
  // Compliance Data
  complianceStatus: any;
  regulatoryResults: any[];
  insuranceReports: any[];
  evidencePackages: any[];
  supportedStandards: any[];
  
  // Loading States
  loading: boolean;
  error: string | null;
  
  // Actions
  setComplianceStatus: (status: any) => void;
  setRegulatoryResults: (results: any[]) => void;
  setInsuranceReports: (reports: any[]) => void;
  setEvidencePackages: (packages: any[]) => void;
  setSupportedStandards: (standards: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async Actions
  fetchComplianceStatus: () => Promise<void>;
  fetchRegulatoryResults: (standard?: string) => Promise<void>;
  fetchInsuranceReports: () => Promise<void>;
  fetchEvidencePackages: () => Promise<void>;
  fetchSupportedStandards: () => Promise<void>;
  runRegulatoryCheck: (standard: string) => Promise<void>;
  generateInsuranceReport: (period: string) => Promise<void>;
  generateEvidence: (requirements: any) => Promise<void>;
}

export const useComplianceStore = create<ComplianceState>((set, get) => ({
  // Initial State
  complianceStatus: null,
  regulatoryResults: [],
  insuranceReports: [],
  evidencePackages: [],
  supportedStandards: [],
  loading: false,
  error: null,

  // Synchronous Actions
  setComplianceStatus: (status) => set({ complianceStatus: status }),
  setRegulatoryResults: (results) => set({ regulatoryResults: results }),
  setInsuranceReports: (reports) => set({ insuranceReports: reports }),
  setEvidencePackages: (packages) => set({ evidencePackages: packages }),
  setSupportedStandards: (standards) => set({ supportedStandards: standards }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Async Actions
  fetchComplianceStatus: async () => {
    try {
      set({ loading: true, error: null });
      const status = await complianceApiService.getComplianceStatus();
      set({ complianceStatus: status, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch compliance status', loading: false });
    }
  },

  fetchRegulatoryResults: async (standard?: string) => {
    try {
      set({ loading: true, error: null });
      const results = await complianceApiService.getRegulatoryResults(standard);
      set({ regulatoryResults: results, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch regulatory results', loading: false });
    }
  },

  fetchInsuranceReports: async () => {
    try {
      set({ loading: true, error: null });
      const reports = await complianceApiService.getInsuranceReports();
      set({ insuranceReports: reports, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch insurance reports', loading: false });
    }
  },

  fetchEvidencePackages: async () => {
    try {
      set({ loading: true, error: null });
      const packages = await complianceApiService.getEvidencePackages();
      set({ evidencePackages: packages, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch evidence packages', loading: false });
    }
  },

  fetchSupportedStandards: async () => {
    try {
      set({ loading: true, error: null });
      const standards = await complianceApiService.getSupportedStandards();
      set({ supportedStandards: standards, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch supported standards', loading: false });
    }
  },

  runRegulatoryCheck: async (standard: string) => {
    try {
      set({ loading: true, error: null });
      await complianceApiService.runRegulatoryCheck(standard);
      
      // Refresh results after running check
      await get().fetchRegulatoryResults(standard);
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to run regulatory check', loading: false });
    }
  },

  generateInsuranceReport: async (period: string) => {
    try {
      set({ loading: true, error: null });
      await complianceApiService.generateInsuranceReport(period);
      
      // Refresh reports after generation
      await get().fetchInsuranceReports();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to generate insurance report', loading: false });
    }
  },

  generateEvidence: async (requirements: any) => {
    try {
      set({ loading: true, error: null });
      await complianceApiService.generateEvidence(requirements);
      
      // Refresh evidence packages after generation
      await get().fetchEvidencePackages();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to generate evidence', loading: false });
    }
  }
}));