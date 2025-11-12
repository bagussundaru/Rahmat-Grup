import React from 'react';
import Icon from '../../../components/AppIcon';
import { InventorySummary } from '../types';

interface InventorySummaryCardsProps {
  summary: InventorySummary;
}

const InventorySummaryCards = ({ summary }: InventorySummaryCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const cards = [
    {
      title: 'Total Produk',
      value: summary.totalProducts.toLocaleString('id-ID'),
      icon: 'Package',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Jumlah produk aktif'
    },
    {
      title: 'Nilai Stok Total',
      value: formatCurrency(summary.totalStockValue),
      icon: 'DollarSign',
      color: 'text-success',
      bgColor: 'bg-success/10',
      description: 'Total nilai inventori'
    },
    {
      title: 'Stok Menipis',
      value: summary.lowStockItems.toLocaleString('id-ID'),
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      description: 'Produk perlu restock'
    },
    {
      title: 'Stok Habis',
      value: summary.outOfStockItems.toLocaleString('id-ID'),
      icon: 'AlertCircle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      description: 'Produk tidak tersedia'
    },
    {
      title: 'Stok Berlebih',
      value: summary.overstockItems.toLocaleString('id-ID'),
      icon: 'TrendingUp',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      description: 'Produk stok berlebihan'
    },
    {
      title: 'Total Pergerakan',
      value: summary.totalMovements.toLocaleString('id-ID'),
      icon: 'Activity',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      description: 'Pergerakan bulan ini'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-card rounded-lg border border-border p-4 hover:shadow-elevation-1 transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-foreground mb-1">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center flex-shrink-0`}>
              <Icon name={card.icon} size={20} className={card.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventorySummaryCards;