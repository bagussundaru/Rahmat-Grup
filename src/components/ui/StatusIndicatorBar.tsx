import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

interface SystemStatus {
  barcode: 'connected' | 'disconnected' | 'error';
  printer: 'connected' | 'disconnected' | 'error';
  network: 'connected' | 'disconnected' | 'slow';
  sync: 'synced' | 'syncing' | 'error';
  lastSync?: Date;
}

interface StatusIndicatorBarProps {
  className?: string;
  onStatusClick?: (status: keyof SystemStatus) => void;
}

const StatusIndicatorBar = ({ className = '', onStatusClick }: StatusIndicatorBarProps) => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    barcode: 'connected',
    printer: 'connected',
    network: 'connected',
    sync: 'synced',
    lastSync: new Date()
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        sync: Math.random() > 0.9 ? 'syncing' : 'synced'
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': case'synced':
        return 'text-success';
      case 'syncing': case'slow':
        return 'text-warning';
      case 'disconnected': case'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (type: keyof SystemStatus, status: string) => {
    switch (type) {
      case 'barcode':
        return status === 'connected' ? 'Scan' : 'ScanLine';
      case 'printer':
        return status === 'connected' ? 'Printer' : 'PrinterX';
      case 'network':
        return status === 'connected' ? 'Wifi' : status === 'slow' ? 'WifiOff' : 'WifiOff';
      case 'sync':
        return status === 'syncing' ? 'RefreshCw' : status === 'synced' ? 'CheckCircle' : 'AlertCircle';
      default:
        return 'Circle';
    }
  };

  const getStatusLabel = (type: keyof SystemStatus, status: string) => {
    const labels = {
      barcode: { connected: 'Scanner Aktif', disconnected: 'Scanner Terputus', error: 'Scanner Error' },
      printer: { connected: 'Printer Siap', disconnected: 'Printer Terputus', error: 'Printer Error' },
      network: { connected: 'Online', disconnected: 'Offline', slow: 'Koneksi Lambat' },
      sync: { synced: 'Data Tersinkron', syncing: 'Sinkronisasi...', error: 'Sync Error' }
    };
    return labels[type][status as keyof typeof labels[typeof type]] || status;
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    
    return date.toLocaleDateString('id-ID');
  };

  const handleStatusClick = (statusType: keyof SystemStatus) => {
    onStatusClick?.(statusType);
  };

  return (
    <div className={`bg-card border-t border-border ${className}`}>
      <div className="flex items-center justify-between px-4 py-2">
        {/* Status Indicators */}
        <div className="flex items-center space-x-4">
          {Object.entries(systemStatus).map(([key, value]) => {
            if (key === 'lastSync') return null;
            
            const statusKey = key as keyof SystemStatus;
            const statusValue = value as string;
            
            return (
              <button
                key={key}
                onClick={() => handleStatusClick(statusKey)}
                className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-muted transition-colors duration-150 group"
                title={getStatusLabel(statusKey, statusValue)}
              >
                <Icon
                  name={getStatusIcon(statusKey, statusValue)}
                  size={14}
                  className={`${getStatusColor(statusValue)} ${statusValue === 'syncing' ? 'animate-spin' : ''}`}
                />
                {isExpanded && (
                  <span className="text-xs text-muted-foreground">
                    {getStatusLabel(statusKey, statusValue)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* System Info */}
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          {systemStatus.lastSync && (
            <span>
              Sync: {formatLastSync(systemStatus.lastSync)}
            </span>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 hover:text-foreground transition-colors duration-150"
          >
            <Icon
              name={isExpanded ? 'ChevronDown' : 'ChevronUp'}
              size={14}
            />
            <span>{isExpanded ? 'Sembunyikan' : 'Detail'}</span>
          </button>
        </div>
      </div>

      {/* Expanded Status Details */}
      {isExpanded && (
        <div className="px-4 pb-3 border-t border-border animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            {Object.entries(systemStatus).map(([key, value]) => {
              if (key === 'lastSync') return null;
              
              const statusKey = key as keyof SystemStatus;
              const statusValue = value as string;
              
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Icon
                    name={getStatusIcon(statusKey, statusValue)}
                    size={16}
                    className={getStatusColor(statusValue)}
                  />
                  <div>
                    <p className="text-xs font-medium text-foreground capitalize">
                      {key === 'barcode' ? 'Scanner' : key === 'sync' ? 'Sinkronisasi' : key}
                    </p>
                    <p className={`text-xs ${getStatusColor(statusValue)}`}>
                      {getStatusLabel(statusKey, statusValue)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusIndicatorBar;