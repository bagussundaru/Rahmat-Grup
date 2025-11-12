import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { DateRange } from '../types';

interface ExportActionsProps {
  dateRange: DateRange;
  onExportExcel: (type: 'sales' | 'transactions' | 'products') => void;
  onPrintReport: () => void;
  onRefreshData: () => void;
  isLoading?: boolean;
}

const ExportActions = ({ 
  dateRange, 
  onExportExcel, 
  onPrintReport, 
  onRefreshData,
  isLoading = false 
}: ExportActionsProps) => {
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const exportOptions = [
    {
      key: 'sales',
      label: 'Laporan Penjualan',
      icon: 'BarChart3',
      description: 'Data penjualan dan pendapatan'
    },
    {
      key: 'transactions',
      label: 'Riwayat Transaksi',
      icon: 'Receipt',
      description: 'Detail semua transaksi'
    },
    {
      key: 'products',
      label: 'Performa Produk',
      icon: 'Package',
      description: 'Analisis produk terlaris'
    }
  ];

  const handleExport = (type: 'sales' | 'transactions' | 'products') => {
    onExportExcel(type);
    setExportDropdownOpen(false);
  };

  const formatDateRange = () => {
    const start = dateRange.startDate.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const end = dateRange.endDate.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    return `${start} - ${end}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-sm font-medium text-foreground mb-1">
            Aksi Laporan
          </h3>
          <p className="text-xs text-muted-foreground">
            Periode: {formatDateRange()}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefreshData}
            loading={isLoading}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onPrintReport}
            iconName="Printer"
            iconPosition="left"
          >
            Cetak
          </Button>
          
          <div className="relative">
            <Button
              variant="default"
              size="sm"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              iconName="Download"
              iconPosition="left"
            >
              Export Excel
              <Icon 
                name="ChevronDown" 
                size={14} 
                className={`ml-1 transition-transform duration-150 ${
                  exportDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>
            
            {exportDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevation-2 py-2 z-200 animate-fade-in">
                {exportOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleExport(option.key as any)}
                    className="w-full flex items-start space-x-3 px-4 py-3 text-left hover:bg-muted transition-colors duration-150"
                  >
                    <Icon name={option.icon} size={18} className="text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-popover-foreground">
                        {option.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {exportDropdownOpen && (
        <div 
          className="fixed inset-0 z-100" 
          onClick={() => setExportDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default ExportActions;