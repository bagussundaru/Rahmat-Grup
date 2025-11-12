import React from 'react';
import Icon from "components/ui/AppIcon";
import { Product } from '../types';

interface ProductStatsProps {
  products: Product[];
}

const ProductStats = ({ products }: ProductStatsProps) => {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const lowStockProducts = products.filter(p => p.currentStock <= (p.minStock || 10)).length;
  const outOfStockProducts = products.filter(p => p.currentStock === 0).length;
  
  const totalValue = products.reduce((sum, product) => {
    return sum + (product.currentStock * product.buyingPrice);
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const stats = [
    {
      label: 'Total Produk',
      value: totalProducts,
      icon: 'Package',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Produk Aktif',
      value: activeProducts,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Stok Rendah',
      value: lowStockProducts,
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Stok Habis',
      value: outOfStockProducts,
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-card rounded-lg border border-border p-4 hover:shadow-elevation-1 transition-shadow duration-150"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <Icon name={stat.icon} size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Total Inventory Value */}
      <div className="bg-card rounded-lg border border-border p-4 hover:shadow-elevation-1 transition-shadow duration-150">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Icon name="DollarSign" size={20} className="text-accent" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{formatCurrency(totalValue)}</p>
            <p className="text-sm text-muted-foreground">Nilai Inventori</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductStats;