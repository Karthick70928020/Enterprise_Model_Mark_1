import { create } from 'zustand';
import { CryptoStatus } from '../../types/secondary';
import { cryptoApiService } from '../../services/api/secondary/cryptoApi';

interface CryptoState {
  // Crypto Data
  cryptoStatus: CryptoStatus | null;
  keyStatus: any;
  totpStatus: any;
  signatureStats: any;
  recentSignatures: any[];
  
  // Loading States
  loading: boolean;
  error: string | null;
  
  // Actions
  setCryptoStatus: (status: CryptoStatus) => void;
  setKeyStatus: (status: any) => void;
  setTOTPStatus: (status: any) => void;
  setSignatureStats: (stats: any) => void;
  setRecentSignatures: (signatures: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async Actions
  fetchCryptoStatus: () => Promise<void>;
  fetchKeyStatus: () => Promise<void>;
  fetchTOTPStatus: () => Promise<void>;
  fetchSignatureStats: () => Promise<void>;
  fetchRecentSignatures: (limit?: number) => Promise<void>;
  rotateKeys: () => Promise<void>;
  exportPublicKey: () => Promise<void>;
}

export const useCryptoStore = create<CryptoState>((set, get) => ({
  // Initial State
  cryptoStatus: null,
  keyStatus: null,
  totpStatus: null,
  signatureStats: null,
  recentSignatures: [],
  loading: false,
  error: null,

  // Synchronous Actions
  setCryptoStatus: (status) => set({ cryptoStatus: status }),
  setKeyStatus: (status) => set({ keyStatus: status }),
  setTOTPStatus: (status) => set({ totpStatus: status }),
  setSignatureStats: (stats) => set({ signatureStats: stats }),
  setRecentSignatures: (signatures) => set({ recentSignatures: signatures }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Async Actions
  fetchCryptoStatus: async () => {
    try {
      set({ loading: true, error: null });
      const status = await cryptoApiService.getTOTPStatus();
      set({ cryptoStatus: status, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch crypto status', loading: false });
    }
  },

  fetchKeyStatus: async () => {
    try {
      set({ loading: true, error: null });
      // This would be a custom endpoint for detailed key status
      const status = await cryptoApiService.getSignatureStats();
      set({ keyStatus: status, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch key status', loading: false });
    }
  },

  fetchTOTPStatus: async () => {
    try {
      set({ loading: true, error: null });
      const status = await cryptoApiService.getTOTPStatus();
      set({ totpStatus: status, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch TOTP status', loading: false });
    }
  },

  fetchSignatureStats: async () => {
    try {
      set({ loading: true, error: null });
      const stats = await cryptoApiService.getSignatureStats();
      set({ signatureStats: stats, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch signature stats', loading: false });
    }
  },

  fetchRecentSignatures: async (limit: number = 10) => {
    try {
      set({ loading: true, error: null });
      const signatures = await cryptoApiService.getRecentSignatures(limit);
      set({ recentSignatures: signatures, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch recent signatures', loading: false });
    }
  },

  rotateKeys: async () => {
    try {
      set({ loading: true, error: null });
      await cryptoApiService.generateKeyPair();
      
      // Refresh all crypto data after key rotation
      await Promise.all([
        get().fetchCryptoStatus(),
        get().fetchKeyStatus(),
        get().fetchSignatureStats()
      ]);
      
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to rotate keys', loading: false });
    }
  },

  exportPublicKey: async () => {
    try {
      set({ loading: true, error: null });
      const keyData = await cryptoApiService.exportPrivateKey('backup-password');
      // In a real app, this would trigger a download
      console.log('Public key exported:', keyData);
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to export public key', loading: false });
    }
  }
}));