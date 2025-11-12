import React from 'react';
import Icon from "components/ui/AppIcon";
import { StockMovement } from '../types';

interface StockMovementHistoryProps {
  movements: StockMovement[];
}

const StockMovementHistory = ({ movements }: StockMovementHistoryProps) => {
  const getMovementIcon = (type: StockMovement['type']) => {
    switch (type) {
      case 'sale':
        return { icon: 'ShoppingCart', color: 'text-error' };
      case 'purchase':
        return { icon: 'Package', color: 'text-success' };
      case 'adjustment':
        return { icon: 'Edit', color: 'text-warning' };
      case 'return':
        return { icon: 'RotateCcw', color: 'text-secondary' };
      default:
        return { icon: 'Activity', color: 'text-muted-foreground' };
    }
  };

  const getMovementLabel = (type: StockMovement['type']) => {
    switch (type) {
      case 'sale':
        return 'Penjualan';
      case 'purchase':
        return 'Pembelian';
      case 'adjustment':
        return 'Penyesuaian';
      case 'return':
        return 'Retur';
      default:
        return type;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getQuantityDisplay = (movement: StockMovement) => {
    const isIncrease = movement.type === 'purchase' || (movement.type === 'adjustment' && movement.quantity > 0);
    const sign = isIncrease ? '+' : '-';
    const color = isIncrease ? 'text-success' : 'text-error';
    
    return (
      <span className={`font-medium ${color}`}>
        {sign}{Math.abs(movement.quantity).toLocaleString('id-ID')}
      </span>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Riwayat Pergerakan Stok</h3>
        <div className="text-sm text-muted-foreground">
          {movements.length} pergerakan terakhir
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {movements.map((movement) => {
          const iconConfig = getMovementIcon(movement.type);
          
          return (
            <div key={movement.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
              <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0`}>
                <Icon name={iconConfig.icon} size={16} className={iconConfig.color} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{movement.productName}</p>
                    <p className="text-xs text-muted-foreground">{getMovementLabel(movement.type)} - {movement.reference}</p>
                    {movement.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{movement.notes}</p>
                    )}
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-sm">
                      {getQuantityDisplay(movement)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {movement.previousStock.toLocaleString('id-ID')} → {movement.newStock.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">{formatDate(movement.date)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {movements.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Belum ada pergerakan stok</p>
        </div>
      )}
    </div>
  );
};

export default StockMovementHistory;