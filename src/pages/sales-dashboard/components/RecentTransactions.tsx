import React from 'react';
import Icon from "components/ui/AppIcon";
import Button from '../../../components/ui/Button';
import { Transaction } from '../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onViewAll: () => void;
  onViewTransaction: (transactionId: string) => void;
}

const RecentTransactions = ({ 
  transactions, 
  onViewAll, 
  onViewTransaction 
}: RecentTransactionsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Banknote';
      case 'qris':
        return 'QrCode';
      case 'card':
        return 'CreditCard';
      default:
        return 'Wallet';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Tunai';
      case 'qris':
        return 'QRIS';
      case 'card':
        return 'Kartu';
      default:
        return method;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'refunded':
        return 'text-error bg-error/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'refunded':
        return 'Refund';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Transaksi Terbaru</h3>
        <Button variant="outline" size="sm" onClick={onViewAll}>
          Lihat Semua
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Waktu
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Total
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Pembayaran
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Kasir
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr 
                key={transaction.id}
                className={`border-b border-border hover:bg-muted/30 transition-colors duration-150 ${
                  index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                }`}
              >
                <td className="p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {transaction.date}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.time}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(transaction.totalAmount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.items} item
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getPaymentMethodIcon(transaction.paymentMethod)} 
                      size={16} 
                      className="text-muted-foreground"
                    />
                    <span className="text-sm text-foreground">
                      {getPaymentMethodLabel(transaction.paymentMethod)}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm text-foreground">{transaction.cashierName}</p>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    {getStatusLabel(transaction.status)}
                  </span>
                </td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewTransaction(transaction.id)}
                    iconName="Eye"
                    iconPosition="left"
                  >
                    Detail
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;