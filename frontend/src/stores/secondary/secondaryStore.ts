import { create } from 'zustand';
import { CryptoStatus, AuditTrailStatus } from '../../types/api';

interface SecondaryState {
  // System State
  cryptoStatus: CryptoStatus | null;
  auditStatus: AuditTrailStatus | null;
  publicKey: string | null;
  systemIntegrity: any;
  currentTOTP: any;
  
  // Loading States
  loading: boolean;
  error: string | null;
  
  // Actions
  setCryptoStatus: (status: CryptoStatus) => void;
  setAuditStatus: (status: AuditTrailStatus) => void;
  setPublicKey: (key: string) => void;
  setSystemIntegrity: (integrity: any) => void;
  setCurrentTOTP: (totp: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async Actions
  fetchCryptoStatus: () => Promise<void>;
  fetchAuditStatus: () => Promise<void>;
  fetchPublicKey: () => Promise<void>;
  fetchSystemIntegrity: () => Promise<void>;
  fetchCurrentTOTP: () => Promise<void>;
}

export const useSecondaryStore = create<SecondaryState>((set) => ({
  // Initial State
  cryptoStatus: null,
  auditStatus: null,
  publicKey: null,
  systemIntegrity: null,
  currentTOTP: null,
  loading: false,
  error: null,

  // Synchronous Actions
  setCryptoStatus: (status) => set({ cryptoStatus: status }),
  setAuditStatus: (status) => set({ auditStatus: status }),
  setPublicKey: (key) => set({ publicKey: key }),
  setSystemIntegrity: (integrity) => set({ systemIntegrity: integrity }),
  setCurrentTOTP: (totp) => set({ currentTOTP: totp }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Async Actions
  fetchCryptoStatus: async () => {
    try {
      set({ loading: true, error: null });
      const { secondaryApiService } = await import('../../services/api/secondary/secondaryApi');
      const status = await secondaryApiService.getCryptoStatus();
      set({ cryptoStatus: status, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch crypto status', loading: false });
    }
  },

  fetchAuditStatus: async () => {
    try {
      set({ loading: true, error: null });
      const { secondaryApiService } = await import('../../services/api/secondary/secondaryApi');
      const status = await secondaryApiService.getAuditStatus();
      set({ auditStatus: status, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch audit status', loading: false });
    }
  },

  fetchPublicKey: async () => {
    try {
      set({ loading: true, error: null });
      const { secondaryApiService } = await import('../../services/api/secondary/secondaryApi');
      const keyData = await secondaryApiService.getPublicKey();
      set({ publicKey: keyData.public_key, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch public key', loading: false });
    }
  },

  fetchSystemIntegrity: async () => {
    try {
      set({ loading: true, error: null });
      const { secondaryApiService } = await import('../../services/api/secondary/secondaryApi');
      const integrity = await secondaryApiService.getSystemIntegrity();
      set({ systemIntegrity: integrity, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch system integrity', loading: false });
    }
  },

  fetchCurrentTOTP: async () => {
    try {
      set({ loading: true, error: null });
      const { secondaryApiService } = await import('../../services/api/secondary/secondaryApi');
      const totp = await secondaryApiService.getCurrentTOTP();
      set({ currentTOTP: totp, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch TOTP', loading: false });
    }
  },
}));