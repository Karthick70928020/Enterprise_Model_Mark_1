import React, { useState, useEffect } from 'react';

interface Packet {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  protocol: string;
  size: number;
  risk: string;
}

const LivePacketCapture: React.FC = () => {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [isCapturing, setIsCapturing] = useState(true);

  useEffect(() => {
    if (!isCapturing) return;

    const generateMockPacket = (): Packet => {
      const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'SSH'];
      const risks = ['low', 'low', 'low', 'medium', 'high'];
      
      return {
        id: `pkt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        timestamp: new Date().toLocaleTimeString(),
        source: `192.168.1.${Math.floor(Math.random() * 255)}`,
        destination: `10.0.0.${Math.floor(Math.random() * 255)}`,
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        size: Math.floor(Math.random() * 1500) + 64,
        risk: risks[Math.floor(Math.random() * risks.length)]
      };
    };

    const interval = setInterval(() => {
      setPackets(prev => {
        const newPacket = generateMockPacket();
        const newPackets = [newPacket, ...prev.slice(0, 9)]; // Keep last 10 packets
        return newPackets;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCapturing]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-danger-600 bg-danger-50';
      case 'medium': return 'text-warning-600 bg-warning-50';
      case 'low': return 'text-success-600 bg-success-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Live Packet Capture</h2>
        <button
          onClick={() => setIsCapturing(!isCapturing)}
          className={`px-3 py-1 rounded text-sm font-medium ${
            isCapturing 
              ? 'bg-danger-100 text-danger-700 hover:bg-danger-200' 
              : 'bg-success-100 text-success-700 hover:bg-success-200'
          }`}
        >
          {isCapturing ? 'Stop' : 'Start'}
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {packets.map((packet) => (
          <div
            key={packet.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(packet.risk)}`}>
                {packet.risk.toUpperCase()}
              </div>
              <div className="text-sm font-mono text-gray-600">{packet.timestamp}</div>
              <div className="text-sm">
                <span className="font-medium">{packet.source}</span>
                <span className="mx-2">→</span>
                <span className="font-medium">{packet.destination}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{packet.protocol}</span>
              <span className="text-sm text-gray-600">{packet.size} bytes</span>
            </div>
          </div>
        ))}
        
        {packets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No packets captured. Start capture to see live traffic.
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <span>Total Packets: {packets.length}</span>
        <span>Status: {isCapturing ? 'Capturing...' : 'Paused'}</span>
      </div>
    </div>
  );
};

export default LivePacketCapture;