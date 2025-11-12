import React from 'react';
import { useLocation } from 'react-router-dom';
import Button from './Button';


interface QuickAction {
  label: string;
  icon: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'success' | 'warning' | 'destructive';
  shortcut?: string;
  disabled?: boolean;
}

interface QuickActionToolbarProps {
  customActions?: QuickAction[];
  className?: string;
}

const QuickActionToolbar = ({ customActions, className = '' }: QuickActionToolbarProps) => {
  const location = useLocation();

  const getDefaultActions = (): QuickAction[] => {
    switch (location.pathname) {
      case '/pos-cashier-interface':
        return [
          {
            label: 'Transaksi Baru',
            icon: 'Plus',
            onClick: () => console.log('New transaction'),
            variant: 'default',
            shortcut: 'Ctrl+N'
          },
          {
            label: 'Scan Barcode',
            icon: 'Scan',
            onClick: () => console.log('Scan barcode'),
            variant: 'outline',
            shortcut: 'F2'
          },
          {
            label: 'Pembayaran',
            icon: 'CreditCard',
            onClick: () => console.log('Process payment'),
            variant: 'success',
            shortcut: 'F12'
          }
        ];
      
      case '/product-management':
        return [
          {
            label: 'Tambah Produk',
            icon: 'Plus',
            onClick: () => console.log('Add product'),
            variant: 'default',
            shortcut: 'Ctrl+N'
          },
          {
            label: 'Import Data',
            icon: 'Upload',
            onClick: () => console.log('Import data'),
            variant: 'outline',
            shortcut: 'Ctrl+I'
          },
          {
            label: 'Export Data',
            icon: 'Download',
            onClick: () => console.log('Export data'),
            variant: 'secondary',
            shortcut: 'Ctrl+E'
          }
        ];
      
      case '/sales-dashboard':
        return [
          {
            label: 'Refresh Data',
            icon: 'RefreshCw',
            onClick: () => console.log('Refresh data'),
            variant: 'outline',
            shortcut: 'F5'
          },
          {
            label: 'Export Laporan',
            icon: 'FileText',
            onClick: () => console.log('Export report'),
            variant: 'secondary',
            shortcut: 'Ctrl+E'
          },
          {
            label: 'Filter Tanggal',
            icon: 'Calendar',
            onClick: () => console.log('Date filter'),
            variant: 'outline'
          }
        ];
      
      case '/inventory-reports':
        return [
          {
            label: 'Generate Laporan',
            icon: 'FileText',
            onClick: () => console.log('Generate report'),
            variant: 'default',
            shortcut: 'Ctrl+G'
          },
          {
            label: 'Export Excel',
            icon: 'Download',
            onClick: () => console.log('Export Excel'),
            variant: 'success',
            shortcut: 'Ctrl+E'
          },
          {
            label: 'Print Laporan',
            icon: 'Printer',
            onClick: () => console.log('Print report'),
            variant: 'outline',
            shortcut: 'Ctrl+P'
          }
        ];
      
      case '/transaction-history':
        return [
          {
            label: 'Filter Transaksi',
            icon: 'Filter',
            onClick: () => console.log('Filter transactions'),
            variant: 'outline',
            shortcut: 'Ctrl+F'
          },
          {
            label: 'Export Data',
            icon: 'Download',
            onClick: () => console.log('Export transactions'),
            variant: 'secondary',
            shortcut: 'Ctrl+E'
          },
          {
            label: 'Cetak Struk',
            icon: 'Printer',
            onClick: () => console.log('Print receipt'),
            variant: 'outline',
            shortcut: 'Ctrl+P'
          }
        ];
      
      default:
        return [];
    }
  };

  const actions = customActions || getDefaultActions();

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {actions.map((action, index) => (
        <div key={index} className="relative group">
          <Button
            variant={action.variant || 'default'}
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled}
            iconName={action.icon}
            iconPosition="left"
            className="transition-smooth hover:shadow-elevation-1"
          >
            {action.label}
          </Button>
          
          {action.shortcut && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-elevation-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-200">
              {action.shortcut}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuickActionToolbar;