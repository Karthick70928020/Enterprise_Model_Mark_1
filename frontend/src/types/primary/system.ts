export interface SystemStatus {
  status: string;
  threat_level: string;
  active_connections: number;
  blocked_threats: number;
  system_health: number;
}

export interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'degraded';
  uptime: string;
  cpu_usage: number;
  memory_usage: number;
  last_restart: string;
}

export interface HealthMetrics {
  timestamp: string;
  cpu_percent: number;
  memory_percent: number;
  disk_usage: number;
  network_throughput: number;
  active_processes: number;
}

export interface SystemInfo {
  hostname: string;
  os: string;
  kernel: string;
  architecture: string;
  uptime: string;
  current_time: string;
}