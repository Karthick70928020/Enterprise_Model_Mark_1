import { primaryWebSocketService } from './primaryWebsocket';
import { secondaryWebSocketService } from './secondaryWebsocket';

class RealTimeService {
  private listeners: Map<string, Function[]> = new Map();

  connectAll() {
    primaryWebSocketService.connect();
    secondaryWebSocketService.connect();

    // Forward events from both services
    primaryWebSocketService.on('threat', (data) => this.emit('threat', data));
    primaryWebSocketService.on('network_stats', (data) => this.emit('network_stats', data));
    primaryWebSocketService.on('system_health', (data) => this.emit('primary_health', data));
    
    secondaryWebSocketService.on('signature', (data) => this.emit('signature', data));
    secondaryWebSocketService.on('audit_update', (data) => this.emit('audit_update', data));
    secondaryWebSocketService.on('system_health', (data) => this.emit('secondary_health', data));
  }

  disconnectAll() {
    primaryWebSocketService.disconnect();
    secondaryWebSocketService.disconnect();
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

  // Send commands to specific device
  sendToPrimary(command: string, data?: any) {
    primaryWebSocketService.sendCommand(command, data);
  }

  sendToSecondary(command: string, data?: any) {
    secondaryWebSocketService.sendCommand(command, data);
  }
}

export const realTimeService = new RealTimeService();