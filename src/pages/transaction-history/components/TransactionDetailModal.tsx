import React from 'react';
import Button from '../../../components/ui/Button';

import { Transaction } from '../types';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onReprintReceipt: (transaction: Transaction) => void;
  onRefundTransaction: (transactionId: string) => void;
}

const TransactionDetailModal = ({
  transaction,
  isOpen,
  onClose,
  onReprintReceipt,
  onRefundTransaction
}: TransactionDetailModalProps) => {
  if (!isOpen || !transaction) return null;

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const statusConfig = {
      completed: { color: 'bg-success text-success-foreground', label: 'Selesai' },
      refunded: { color: 'bg-warning text-warning-foreground', label: 'Dikembalikan' },
      voided: { color: 'bg-destructive text-destructive-foreground', label: 'Dibatalkan' },
      pending: { color: 'bg-secondary text-secondary-foreground', label: 'Pending' }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: Transaction['paymentMethod']) => {
    const labels = {
      cash: 'Tunai',
      qris: 'QRIS',
      card: 'Kartu',
      transfer: 'Transfer'
    };
    return labels[method];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevation-2 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Detail Transaksi</h2>
            <p className="text-sm text-muted-foreground">
              {transaction.transactionId} • {formatDate(transaction.date)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(transaction.status)}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
              className="h-8 w-8 p-0"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Informasi Transaksi</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID Transaksi:</span>
                    <span className="font-mono text-foreground">{transaction.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">No. Struk:</span>
                    <span className="font-mono text-foreground">{transaction.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tanggal & Waktu:</span>
                    <span className="text-foreground">{formatDate(transaction.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kasir:</span>
                    <span className="text-foreground">{transaction.cashier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Metode Pembayaran:</span>
                    <span className="text-foreground">{getPaymentMethodLabel(transaction.paymentMethod)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              {transaction.customerInfo && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Informasi Pelanggan</h3>
                  <div className="space-y-2 text-sm">
                    {transaction.customerInfo.name && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nama:</span>
                        <span className="text-foreground">{transaction.customerInfo.name}</span>
                      </div>
                    )}
                    {transaction.customerInfo.phone && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Telepon:</span>
                        <span className="text-foreground">{transaction.customerInfo.phone}</span>
                      </div>
                    )}
                    {transaction.customerInfo.membershipId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID Member:</span>
                        <span className="text-foreground">{transaction.customerInfo.membershipId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Details */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Detail Pembayaran</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jumlah Dibayar:</span>
                    <span className="text-foreground">{formatCurrency(transaction.paymentDetails.amountPaid)}</span>
                  </div>
                  {transaction.paymentDetails.change > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kembalian:</span>
                      <span className="text-foreground">{formatCurrency(transaction.paymentDetails.change)}</span>
                    </div>
                  )}
                  {transaction.paymentDetails.reference && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Referensi:</span>
                      <span className="font-mono text-foreground">{transaction.paymentDetails.reference}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Item Pembelian</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {transaction.items.map((item) => (
                  <div key={item.id} className="bg-muted p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-medium text-foreground">{item.productName}</h4>
                        <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                        <p className="text-xs text-muted-foreground">Kategori: {item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{formatCurrency(item.totalPrice)}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                    </div>
                    {item.discount > 0 && (
                      <div className="text-xs text-warning">
                        Diskon: -{formatCurrency(item.discount)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="bg-muted p-4 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="text-foreground">{formatCurrency(transaction.subtotal)}</span>
                </div>
                {transaction.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diskon:</span>
                    <span className="text-warning">-{formatCurrency(transaction.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pajak:</span>
                  <span className="text-foreground">{formatCurrency(transaction.tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                  <span className="text-foreground">Total:</span>
                  <span className="text-foreground">{formatCurrency(transaction.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onReprintReceipt(transaction)}
            iconName="Printer"
            iconPosition="left"
          >
            Cetak Ulang Struk
          </Button>
          {transaction.status === 'completed' && (
            <Button
              variant="warning"
              onClick={() => onRefundTransaction(transaction.id)}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Proses Refund
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;