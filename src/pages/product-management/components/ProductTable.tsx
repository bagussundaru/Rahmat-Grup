import React, { useState, useMemo } from 'react';
import Icon from "components/ui/AppIcon";
import Image from "components/ui/AppImage";
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Product, SortConfig, ProductTableColumn } from '../types';

interface ProductTableProps {
  products: Product[];
  selectedProducts: string[];
  onSelectProduct: (productId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  sortConfig: SortConfig;
  onSort: (key: keyof Product) => void;
}

const ProductTable = ({
  products,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
  onEditProduct,
  onDeleteProduct,
  sortConfig,
  onSort
}: ProductTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const columns: ProductTableColumn[] = [
    { key: 'name', label: 'Nama Produk', sortable: true, width: '25%' },
    { key: 'sku', label: 'SKU', sortable: true, width: '15%' },
    { key: 'category', label: 'Kategori', sortable: true, width: '15%' },
    { key: 'sellingPrice', label: 'Harga Jual', sortable: true, width: '12%' },
    { key: 'buyingPrice', label: 'Harga Beli', sortable: true, width: '12%' },
    { key: 'currentStock', label: 'Stok', sortable: true, width: '10%' },
    { key: 'isActive', label: 'Status', sortable: true, width: '8%' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStockStatus = (stock: number, minStock: number = 10) => {
    if (stock === 0) return { label: 'Habis', color: 'text-error' };
    if (stock <= minStock) return { label: 'Rendah', color: 'text-warning' };
    return { label: 'Normal', color: 'text-success' };
  };

  const getSortIcon = (columnKey: keyof Product) => {
    if (sortConfig.key !== columnKey) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const allSelected = products.length > 0 && selectedProducts.length === products.length;
  const someSelected = selectedProducts.length > 0 && selectedProducts.length < products.length;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left p-4 font-medium text-foreground"
                  style={{ width: column.width }}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => onSort(column.key)}
                      className="flex items-center space-x-2 hover:text-primary transition-colors duration-150"
                    >
                      <span>{column.label}</span>
                      <Icon
                        name={getSortIcon(column.key)}
                        size={14}
                        className="text-muted-foreground"
                      />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              <th className="w-24 p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const stockStatus = getStockStatus(product.currentStock, product.minStock);
              const isSelected = selectedProducts.includes(product.id);
              const isHovered = hoveredRow === product.id;

              return (
                <tr
                  key={product.id}
                  className={`
                    border-b border-border transition-colors duration-150
                    ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'}
                  `}
                  onMouseEnter={() => setHoveredRow(product.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="p-4">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => onSelectProduct(product.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.alt || `Gambar produk ${product.name}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon name="Package" size={16} className="text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-xs">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-foreground font-mono">{product.sku}</td>
                  <td className="p-4 text-sm text-foreground">{product.category}</td>
                  <td className="p-4 text-sm font-medium text-foreground">
                    {formatCurrency(product.sellingPrice)}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {formatCurrency(product.buyingPrice)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground">
                        {product.currentStock}
                      </span>
                      <span className={`text-xs ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`
                        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${product.isActive
                          ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                        }
                      `}
                    >
                      {product.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditProduct(product)}
                        className="h-8 w-8"
                      >
                        <Icon name="Edit" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteProduct(product.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.currentStock, product.minStock);
          const isSelected = selectedProducts.includes(product.id);

          return (
            <div
              key={product.id}
              className={`
                border border-border rounded-lg p-4 transition-colors duration-150
                ${isSelected ? 'bg-primary/5 border-primary/20' : 'bg-card'}
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onSelectProduct(product.id)}
                  />
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.alt || `Gambar produk ${product.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon name="Package" size={20} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditProduct(product)}
                    className="h-8 w-8"
                  >
                    <Icon name="Edit" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteProduct(product.id)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <h3 className="font-medium text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Kategori</p>
                    <p className="font-medium text-foreground">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <span
                      className={`
                        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${product.isActive
                          ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                        }
                      `}
                    >
                      {product.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Harga Jual</p>
                    <p className="font-medium text-foreground">
                      {formatCurrency(product.sellingPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stok</p>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">
                        {product.currentStock}
                      </span>
                      <span className={`text-xs ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Tidak ada produk</h3>
          <p className="text-muted-foreground">
            Belum ada produk yang ditambahkan. Klik tombol "Tambah Produk" untuk memulai.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductTable;