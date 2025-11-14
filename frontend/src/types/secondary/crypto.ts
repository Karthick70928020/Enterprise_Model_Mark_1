export interface CryptoStatus {
  key_initialized: boolean;
  needs_rotation: boolean;
  days_since_rotation: number;
  totp_initialized: boolean;
  current_totp_interval: number;
  public_key_fingerprint: string;
}

export interface KeyInfo {
  algorithm: string;
  key_size: number;
  created_at: string;
  expires_at: string;
  fingerprint: string;
  status: 'active' | 'expired' | 'compromised';
}

export interface SignatureRequest {
  log_hash: string;
  previous_hash: string;
  timestamp: string;
  device_id: string;
  totp_code: string;
}

export interface SignatureResponse {
  signature: string;
  signed_at: string;
  public_key: string;
}

export interface TOTPStatus {
  current_code: string;
  remaining_seconds: number;
  valid_until: string;
}