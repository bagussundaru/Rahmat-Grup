import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { ProductFilters, ProductCategory } from '../types';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  categories: ProductCategory[];
  totalProducts: number;
  filteredCount: number;
  onClearFilters: () => void;
}

const ProductFiltersComponent = ({
  filters,
  onFiltersChange,
  categories,
  totalProducts,
  filteredCount,
  onClearFilters
}: ProductFiltersProps) => {
  const categoryOptions = [
    { value: '', label: 'Semua Kategori' },
    ...categories.map(category => ({
      value: category.id,
      label: `${category.name} (${category.productCount})`
    }))
  ];

  const stockLevelOptions = [
    { value: 'all', label: 'Semua Stok' },
    { value: 'low', label: 'Stok Rendah' },
    { value: 'out', label: 'Stok Habis' }
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value
    });
  };

  const handleCategoryChange = (value: string | number) => {
    onFiltersChange({
      ...filters,
      category: value as string
    });
  };

  const handleStockLevelChange = (value: string | number) => {
    onFiltersChange({
      ...filters,
      stockLevel: value as 'all' | 'low' | 'out'
    });
  };

  const hasActiveFilters = filters.search || filters.category || filters.stockLevel !== 'all';

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Cari produk berdasarkan nama atau SKU..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>

          <div className="flex gap-3">
            <Select
              options={categoryOptions}
              value={filters.category}
              onChange={handleCategoryChange}
              placeholder="Kategori"
              className="min-w-48"
            />

            <Select
              options={stockLevelOptions}
              value={filters.stockLevel}
              onChange={handleStockLevelChange}
              className="min-w-40"
            />
          </div>
        </div>

        {/* Results Info and Clear */}
        <div className="flex items-center justify-between lg:justify-end gap-4">
          <div className="text-sm text-muted-foreground">
            {filteredCount === totalProducts ? (
              <span>Menampilkan {totalProducts} produk</span>
            ) : (
              <span>
                Menampilkan {filteredCount} dari {totalProducts} produk
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              className="text-muted-foreground hover:text-foreground"
            >
              Hapus Filter
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Filter aktif:</span>
          
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
              <Icon name="Search" size={12} />
              "{filters.search}"
            </span>
          )}
          
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-sm">
              <Icon name="Tag" size={12} />
              {categories.find(c => c.id === filters.category)?.name}
            </span>
          )}
          
          {filters.stockLevel !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning/10 text-warning rounded-md text-sm">
              <Icon name="Package" size={12} />
              {stockLevelOptions.find(s => s.value === filters.stockLevel)?.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFiltersComponent;