import { io, Socket } from 'socket.io-client';

class PrimaryWebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect() {
    this.socket = io('http://localhost:8000', {
      path: '/ws/primary'
    });

    this.socket.on('connect', () => {
      console.log('Connected to Primary Device WebSocket');
      this.emit('connected', { device: 'primary' });
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Primary Device WebSocket');
      this.emit('disconnected', { device: 'primary' });
    });

    // Real-time events
    this.socket.on('threat_detected', (data: any) => {
      this.emit('threat', data);
    });

    this.socket.on('network_stats', (data: any) => {
      this.emit('network_stats', data);
    });

    this.socket.on('system_health', (data: any) => {
      this.emit('system_health', data);
    });

    this.socket.on('ai_analysis', (data: any) => {
      this.emit('ai_analysis', data);
    });

    this.socket.on('firewall_event', (data: any) => {
      this.emit('firewall_event', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      this.listeners.set(event, eventListeners.filter(cb => cb !== callback));
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // Send commands to primary device
  sendCommand(command: string, data?: any) {
    if (this.socket) {
      this.socket.emit('command', { command, data });
    }
  }
}

export const primaryWebSocketService = new PrimaryWebSocketService();