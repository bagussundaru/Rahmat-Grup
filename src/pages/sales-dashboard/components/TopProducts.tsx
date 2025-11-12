import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import { TopProduct } from '../types';

interface TopProductsProps {
  products: TopProduct[];
}

const TopProducts = ({ products }: TopProductsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return { icon: 'Trophy', color: 'text-yellow-500' };
      case 1:
        return { icon: 'Medal', color: 'text-gray-400' };
      case 2:
        return { icon: 'Award', color: 'text-amber-600' };
      default:
        return { icon: 'Star', color: 'text-muted-foreground' };
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Produk Terlaris</h3>
        <Icon name="TrendingUp" size={20} className="text-success" />
      </div>
      
      <div className="space-y-4">
        {products.map((product, index) => {
          const rank = getRankIcon(index);
          return (
            <div 
              key={product.id}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors duration-150"
            >
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-8 h-8 ${rank.color}`}>
                  <Icon name={rank.icon} size={18} />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  #{index + 1}
                </span>
              </div>
              
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {product.category}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {product.quantitySold} terjual
                </p>
                <p className="text-xs text-success">
                  {formatCurrency(product.revenue)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Produk Aktif</span>
          <span className="font-medium text-foreground">
            {products.length} produk
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;