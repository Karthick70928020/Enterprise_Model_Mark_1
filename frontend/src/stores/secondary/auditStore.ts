import { create } from 'zustand';
import { AuditTrailStatus } from '../../types/secondary';
import { auditApiService } from '../../services/api/secondary/auditApi';

interface AuditState {
  // Audit Data
  auditStatus: AuditTrailStatus | null;
  auditTrail: any[];
  forensicEvidence: any[];
  integrityResults: any;
  
  // Loading States
  loading: boolean;
  error: string | null;
  
  // Actions
  setAuditStatus: (status: AuditTrailStatus) => void;
  setAuditTrail: (trail: any[]) => void;
  setForensicEvidence: (evidence: any[]) => void;
  setIntegrityResults: (results: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async Actions
  fetchAuditStatus: () => Promise<void>;
  fetchAuditTrail: (startDate?: string, endDate?: string, limit?: number) => Promise<void>;
  fetchForensicEvidence: (incidentId?: string) => Promise<void>;
  verifyAuditIntegrity: () => Promise<any>;
  generateEvidenceReport: (criteria: any) => Promise<void>;
}

export const useAuditStore = create<AuditState>((set, get) => ({
  // Initial State
  auditStatus: null,
  auditTrail: [],
  forensicEvidence: [],
  integrityResults: null,
  loading: false,
  error: null,

  // Synchronous Actions
  setAuditStatus: (status) => set({ auditStatus: status }),
  setAuditTrail: (trail) => set({ auditTrail: trail }),
  setForensicEvidence: (evidence) => set({ forensicEvidence: evidence }),
  setIntegrityResults: (results) => set({ integrityResults: results }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Async Actions
  fetchAuditStatus: async () => {
    try {
      set({ loading: true, error: null });
      const status = await auditApiService.getAuditStats();
      set({ auditStatus: status, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch audit status', loading: false });
    }
  },

  fetchAuditTrail: async (startDate?: string, endDate?: string, limit?: number) => {
    try {
      set({ loading: true, error: null });
      const trail = await auditApiService.getAuditTrail(startDate, endDate, limit);
      set({ auditTrail: trail, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch audit trail', loading: false });
    }
  },

  fetchForensicEvidence: async (incidentId?: string) => {
    try {
      set({ loading: true, error: null });
      let evidence;
      if (incidentId) {
        evidence = await auditApiService.getForensicEvidence(incidentId);
      } else {
        // Fetch all evidence or recent evidence
        evidence = await auditApiService.getForensicEvidence('recent');
      }
      set({ forensicEvidence: evidence, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch forensic evidence', loading: false });
    }
  },

  verifyAuditIntegrity: async () => {
    try {
      set({ loading: true, error: null });
      const results = await auditApiService.verifyIntegrity();
      set({ integrityResults: results, loading: false });
      return results;
    } catch (error) {
      set({ error: 'Failed to verify audit integrity', loading: false });
      throw error;
    }
  },

  generateEvidenceReport: async (criteria: any) => {
    try {
      set({ loading: true, error: null });
      const report = await auditApiService.generateEvidenceReport(criteria);
      set({ loading: false });
      return report;
    } catch (error) {
      set({ error: 'Failed to generate evidence report', loading: false });
      throw error;
    }
  }
}));