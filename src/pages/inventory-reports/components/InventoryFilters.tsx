import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { FilterOptions } from '../types';

interface InventoryFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
  categories: string[];
}

const InventoryFilters = ({ filters, onFiltersChange, onReset, categories }: InventoryFiltersProps) => {
  const categoryOptions = [
    { value: '', label: 'Semua Kategori' },
    ...categories.map(category => ({ value: category, label: category }))
  ];

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'in-stock', label: 'Stok Tersedia' },
    { value: 'low-stock', label: 'Stok Menipis' },
    { value: 'out-of-stock', label: 'Stok Habis' },
    { value: 'overstock', label: 'Stok Berlebih' }
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [type]: value ? new Date(value) : null
      }
    });
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Cari produk, SKU, atau supplier..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <div>
          <Select
            options={categoryOptions}
            value={filters.category}
            onChange={(value) => handleFilterChange('category', value)}
            placeholder="Pilih Kategori"
          />
        </div>

        {/* Status Filter */}
        <div>
          <Select
            options={statusOptions}
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Pilih Status"
          />
        </div>

        {/* Date Range Start */}
        <div>
          <Input
            type="date"
            label="Dari Tanggal"
            value={formatDateForInput(filters.dateRange.start)}
            onChange={(e) => handleDateRangeChange('start', e.target.value)}
          />
        </div>

        {/* Date Range End */}
        <div>
          <Input
            type="date"
            label="Sampai Tanggal"
            value={formatDateForInput(filters.dateRange.end)}
            onChange={(e) => handleDateRangeChange('end', e.target.value)}
          />
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          {filters.searchTerm || filters.category || filters.status || filters.dateRange.start || filters.dateRange.end ? (
            <span>Filter aktif diterapkan</span>
          ) : (
            <span>Menampilkan semua data</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            iconName="X"
          >
            Reset Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters;