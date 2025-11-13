import React, { useState } from 'react';
import Icon from "components/ui/AppIcon";
import Image from "components/ui/AppImage";
import Button from '../../../components/ui/Button';
import { Product, SortConfig } from '../types';

interface InventoryTableProps {
  products: Product[];
  onSort: (config: SortConfig) => void;
  sortConfig: SortConfig;
  onProductSelect: (productId: string) => void;
  selectedProducts: string[];
}

const InventoryTable = ({ 
  products, 
  onSort, 
  sortConfig, 
  onProductSelect, 
  selectedProducts 
}: InventoryTableProps) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleSort = (key: keyof Product) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    onSort({ key, direction });
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      products.forEach(product => onProductSelect(product.id));
    } else {
      selectedProducts.forEach(id => onProductSelect(id));
    }
  };

  const getStatusBadge = (status: Product['status']) => {
    const statusConfig = {
      'in-stock': { color: 'bg-success text-success-foreground', label: 'Stok Tersedia' },
      'low-stock': { color: 'bg-warning text-warning-foreground', label: 'Stok Menipis' },
      'out-of-stock': { color: 'bg-error text-error-foreground', label: 'Stok Habis' },
      'overstock': { color: 'bg-secondary text-secondary-foreground', label: 'Stok Berlebih' }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getSortIcon = (key: keyof Product) => {
    if (sortConfig.key !== key) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full zebra-table">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="p-3 text-left text-sm font-medium text-foreground">Produk</th>
              <th 
                className="p-3 text-left text-sm font-medium text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('sku')}
              >
                <div className="flex items-center space-x-1">
                  <span>SKU</span>
                  {getSortIcon('sku')}
                </div>
              </th>
              <th 
                className="p-3 text-left text-sm font-medium text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center space-x-1">
                  <span>Kategori</span>
                  {getSortIcon('category')}
                </div>
              </th>
              <th 
                className="p-3 text-right text-sm font-medium text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('currentStock')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Stok Saat Ini</span>
                  {getSortIcon('currentStock')}
                </div>
              </th>
              <th 
                className="p-3 text-right text-sm font-medium text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('reorderPoint')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Titik Reorder</span>
                  {getSortIcon('reorderPoint')}
                </div>
              </th>
              <th 
                className="p-3 text-right text-sm font-medium text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('unitPrice')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Harga Satuan</span>
                  {getSortIcon('unitPrice')}
                </div>
              </th>
              <th 
                className="p-3 text-right text-sm font-medium text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('totalValue')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Nilai Total</span>
                  {getSortIcon('totalValue')}
                </div>
              </th>
              <th className="p-3 text-center text-sm font-medium text-foreground">Status</th>
              <th 
                className="p-3 text-left text-sm font-medium text-foreground cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => handleSort('lastMovement')}
              >
                <div className="flex items-center space-x-1">
                  <span>Pergerakan Terakhir</span>
                  {getSortIcon('lastMovement')}
                </div>
              </th>
              <th className="p-3 text-center text-sm font-medium text-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => onProductSelect(product.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.supplier}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <span className="text-sm text-foreground font-mono">{product.sku}</span>
                </td>
                <td className="p-3">
                  <span className="text-sm text-foreground">{product.category}</span>
                </td>
                <td className="p-3 text-right">
                  <span className="text-sm font-medium text-foreground">{product.currentStock.toLocaleString('id-ID')}</span>
                </td>
                <td className="p-3 text-right">
                  <span className="text-sm text-muted-foreground">{product.reorderPoint.toLocaleString('id-ID')}</span>
                </td>
                <td className="p-3 text-right">
                  <span className="text-sm text-foreground">{formatCurrency(product.unitPrice)}</span>
                </td>
                <td className="p-3 text-right">
                  <span className="text-sm font-medium text-foreground">{formatCurrency(product.totalValue)}</span>
                </td>
                <td className="p-3 text-center">
                  {getStatusBadge(product.status)}
                </td>
                <td className="p-3">
                  <div className="text-sm text-muted-foreground">
                    <p>{formatDate(product.lastMovement)}</p>
                    <p className="text-xs capitalize">{product.movementType === 'in' ? 'Masuk' : product.movementType === 'out' ? 'Keluar' : 'Penyesuaian'}</p>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Eye"
                    onClick={() => console.log('View product details:', product.id)}
                  >
                    Detail
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {products.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Tidak ada data produk yang ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
