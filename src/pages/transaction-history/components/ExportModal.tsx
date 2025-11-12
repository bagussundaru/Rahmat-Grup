import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from "components/ui/AppIcon";
import { ExportOptions } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
}

const ExportModal = ({ isOpen, onClose, onExport }: ExportModalProps) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'excel',
    dateRange: {
      from: new Date(new Date().setDate(new Date().getDate() - 30)),
      to: new Date()
    },
    includeItems: true,
    includePaymentDetails: true
  });

  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    const date = new Date(value);
    setExportOptions(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: date
      }
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(exportOptions);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getDaysCount = () => {
    const diffTime = exportOptions.dateRange.to.getTime() - exportOptions.dateRange.from.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevation-2 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Export Data Transaksi</h2>
            <p className="text-sm text-muted-foreground">
              Pilih rentang tanggal dan format export
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            className="h-8 w-8 p-0"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Date Range */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Rentang Tanggal</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                label="Dari Tanggal"
                value={formatDateForInput(exportOptions.dateRange.from)}
                onChange={(e) => handleDateChange('from', e.target.value)}
              />
              <Input
                type="date"
                label="Sampai Tanggal"
                value={formatDateForInput(exportOptions.dateRange.to)}
                onChange={(e) => handleDateChange('to', e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {getDaysCount()} hari data akan di-export
            </p>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Opsi Export</h3>
            <div className="space-y-2">
              <Checkbox
                label="Sertakan detail item pembelian"
                description="Menampilkan semua produk dalam setiap transaksi"
                checked={exportOptions.includeItems}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  includeItems: e.target.checked
                }))}
              />
              <Checkbox
                label="Sertakan detail pembayaran"
                description="Menampilkan informasi metode dan detail pembayaran"
                checked={exportOptions.includePaymentDetails}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  includePaymentDetails: e.target.checked
                }))}
              />
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Format File</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setExportOptions(prev => ({ ...prev, format: 'excel' }))}
                className={`p-3 rounded-lg border-2 transition-all ${
                  exportOptions.format === 'excel' ?'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="FileSpreadsheet" size={20} />
                  <span className="text-sm font-medium">Excel (.xlsx)</span>
                </div>
              </button>
              <button
                onClick={() => setExportOptions(prev => ({ ...prev, format: 'pdf' }))}
                className={`p-3 rounded-lg border-2 transition-all ${
                  exportOptions.format === 'pdf' ?'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="FileText" size={20} />
                  <span className="text-sm font-medium">PDF (.pdf)</span>
                </div>
              </button>
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-primary mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Informasi Export:</p>
                <ul className="space-y-1">
                  <li>• File akan diunduh otomatis setelah proses selesai</li>
                  <li>• Data yang di-export sesuai dengan filter yang aktif</li>
                  <li>• Proses export mungkin membutuhkan waktu untuk data besar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Batal
          </Button>
          <Button
            variant="success"
            onClick={handleExport}
            loading={isExporting}
            iconName="Download"
            iconPosition="left"
          >
            {isExporting ? 'Mengexport...' : 'Export Data'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;