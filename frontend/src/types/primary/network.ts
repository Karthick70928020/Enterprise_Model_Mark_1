export interface NetworkStats {
  total_packets: number;
  packets_per_second: number;
  bandwidth_usage: string;
  active_threats: number;
  blocked_attempts: number;
}

export interface PacketData {
  timestamp: string;
  source: string;
  destination: string;
  protocol: string;
  size: number;
  risk_level: string;
  flags: number;
  payload_sample: string;
}

export interface TrafficFlow {
  timestamp: string;
  packets: number;
  threats: number;
}

export interface NetworkInterface {
  name: string;
  status: 'up' | 'down';
  ip_address: string;
  mac_address: string;
  packets_received: number;
  packets_sent: number;
}

export interface Connection {
  id: string;
  source_ip: string;
  source_port: number;
  destination_ip: string;
  destination_port: number;
  protocol: string;
  status: 'established' | 'closed' | 'timeout';
  start_time: string;
  last_activity: string;
}