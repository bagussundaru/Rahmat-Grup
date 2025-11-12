import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

import { ExportOptions } from '../types';

interface ExportControlsProps {
  onExport: (options: ExportOptions) => void;
  selectedProductsCount: number;
}

const ExportControls = ({ onExport, selectedProductsCount }: ExportControlsProps) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'excel',
    includeMovements: false,
    dateRange: {
      start: null,
      end: null
    }
  });

  const handleExport = () => {
    onExport(exportOptions);
    setIsExportModalOpen(false);
  };

  const handleQuickExport = (format: ExportOptions['format']) => {
    onExport({
      format,
      includeMovements: false,
      dateRange: { start: null, end: null }
    });
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    setExportOptions(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: value ? new Date(value) : null
      }
    }));
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Quick Export Buttons */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleQuickExport('excel')}
        iconName="FileSpreadsheet"
        iconPosition="left"
      >
        Export Excel
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleQuickExport('pdf')}
        iconName="FileText"
        iconPosition="left"
      >
        Export PDF
      </Button>

      {/* Advanced Export */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsExportModalOpen(true)}
        iconName="Settings"
        iconPosition="left"
      >
        Export Lanjutan
      </Button>

      {/* Print Report */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.print()}
        iconName="Printer"
        iconPosition="left"
      >
        Cetak
      </Button>

      {/* Selected Items Info */}
      {selectedProductsCount > 0 && (
        <div className="text-sm text-muted-foreground">
          {selectedProductsCount} produk dipilih
        </div>
      )}

      {/* Advanced Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200">
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Opsi Export Lanjutan</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExportModalOpen(false)}
                iconName="X"
              />
            </div>

            <div className="space-y-4">
              {/* Format Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Format Export</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="format"
                      value="excel"
                      checked={exportOptions.format === 'excel'}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as 'excel' }))}
                      className="text-primary"
                    />
                    <span className="text-sm text-foreground">Excel (.xlsx)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="format"
                      value="pdf"
                      checked={exportOptions.format === 'pdf'}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as 'pdf' }))}
                      className="text-primary"
                    />
                    <span className="text-sm text-foreground">PDF</span>
                  </label>
                </div>
              </div>

              {/* Include Movements */}
              <div>
                <Checkbox
                  label="Sertakan Riwayat Pergerakan Stok"
                  description="Tambahkan data pergerakan stok dalam export"
                  checked={exportOptions.includeMovements}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeMovements: e.target.checked }))}
                />
              </div>

              {/* Date Range */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground block">Rentang Tanggal Pergerakan</label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="date"
                    label="Dari"
                    value={formatDateForInput(exportOptions.dateRange.start)}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  />
                  <Input
                    type="date"
                    label="Sampai"
                    value={formatDateForInput(exportOptions.dateRange.end)}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setIsExportModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                variant="default"
                onClick={handleExport}
                iconName="Download"
                iconPosition="left"
              >
                Export Data
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportControls;