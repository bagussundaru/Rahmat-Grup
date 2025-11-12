import React from 'react';
import Icon from "components/ui/AppIcon";
import Button from '../../../components/ui/Button';
import { CartItem } from '../types';

interface ShoppingCartProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

const ShoppingCart = ({
  items,
  subtotal,
  tax,
  discount,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: ShoppingCartProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Keranjang Belanja</h2>
        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            iconName="Trash2"
            onClick={onClearCart}
            className="text-destructive hover:text-destructive"
          >
            Kosongkan
          </Button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Icon name="ShoppingCart" size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Keranjang masih kosong</p>
            <p className="text-sm text-muted-foreground mt-1">Scan barcode atau tambah produk secara manual</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-muted/50 rounded-lg p-3 border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground text-sm">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">SKU: {item.product.sku}</p>
                    <p className="text-sm font-medium text-primary mt-1">
                      {formatCurrency(item.product.price)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-destructive hover:text-destructive h-6 w-6"
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="h-6 w-6"
                    >
                      <Icon name="Minus" size={12} />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="h-6 w-6"
                    >
                      <Icon name="Plus" size={12} />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals */}
      {items.length > 0 && (
        <div className="border-t border-border p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Diskon:</span>
              <span className="font-medium text-success">-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pajak (11%):</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
            <span>Total:</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;