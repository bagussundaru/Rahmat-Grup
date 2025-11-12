import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

import { TransactionFilters } from '../types';

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  onReset: () => void;
  onExport: () => void;
}

const TransactionFiltersComponent = ({ 
  filters, 
  onFiltersChange, 
  onReset, 
  onExport 
}: TransactionFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const paymentMethodOptions = [
    { value: '', label: 'Semua Metode Pembayaran' },
    { value: 'cash', label: 'Tunai' },
    { value: 'qris', label: 'QRIS' },
    { value: 'card', label: 'Kartu' },
    { value: 'transfer', label: 'Transfer' }
  ];

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'completed', label: 'Selesai' },
    { value: 'refunded', label: 'Dikembalikan' },
    { value: 'voided', label: 'Dibatalkan' },
    { value: 'pending', label: 'Pending' }
  ];

  const cashierOptions = [
    { value: '', label: 'Semua Kasir' },
    { value: 'ahmad-rizki', label: 'Ahmad Rizki' },
    { value: 'siti-nurhaliza', label: 'Siti Nurhaliza' },
    { value: 'budi-santoso', label: 'Budi Santoso' },
    { value: 'maya-sari', label: 'Maya Sari' }
  ];

  const handleFilterChange = (field: keyof TransactionFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    const date = value ? new Date(value) : null;
    handleFilterChange(field, date);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">Filter Transaksi</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {isExpanded ? 'Sembunyikan' : 'Tampilkan'} Filter
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={onExport}
            iconName="Download"
            iconPosition="left"
          >
            Export Excel
          </Button>
        </div>
      </div>

      {/* Quick Search */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Cari berdasarkan ID transaksi, nama produk, atau kasir..."
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div>
            <Input
              type="date"
              label="Tanggal Mulai"
              value={formatDateForInput(filters.dateFrom)}
              onChange={(e) => handleDateChange('dateFrom', e.target.value)}
            />
          </div>
          
          <div>
            <Input
              type="date"
              label="Tanggal Akhir"
              value={formatDateForInput(filters.dateTo)}
              onChange={(e) => handleDateChange('dateTo', e.target.value)}
            />
          </div>
          
          <div>
            <Select
              label="Metode Pembayaran"
              options={paymentMethodOptions}
              value={filters.paymentMethod}
              onChange={(value) => handleFilterChange('paymentMethod', value)}
            />
          </div>
          
          <div>
            <Select
              label="Status"
              options={statusOptions}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
          </div>
          
          <div>
            <Select
              label="Kasir"
              options={cashierOptions}
              value={filters.cashier}
              onChange={(value) => handleFilterChange('cashier', value)}
            />
          </div>
          
          <div>
            <Input
              type="number"
              label="Jumlah Minimum"
              placeholder="0"
              value={filters.amountMin || ''}
              onChange={(e) => handleFilterChange('amountMin', e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          
          <div>
            <Input
              type="number"
              label="Jumlah Maksimum"
              placeholder="1000000"
              value={filters.amountMax || ''}
              onChange={(e) => handleFilterChange('amountMax', e.target.value ? Number(e.target.value) : null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFiltersComponent;