import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from "components/ui/AppIcon";
import { Transaction, SortConfig } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
  sortConfig: SortConfig;
  onSort: (field: keyof Transaction) => void;
  onViewDetails: (transaction: Transaction) => void;
  onVoidTransaction: (transactionId: string) => void;
  onReprintReceipt: (transaction: Transaction) => void;
  onRefundTransaction: (transactionId: string) => void;
  currentUser: { role: string };
}

const TransactionTable = ({
  transactions,
  sortConfig,
  onSort,
  onViewDetails,
  onVoidTransaction,
  onReprintReceipt,
  onRefundTransaction,
  currentUser
}: TransactionTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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

  const getStatusBadge = (status: Transaction['status']) => {
    const statusConfig = {
      completed: { color: 'bg-success text-success-foreground', label: 'Selesai' },
      refunded: { color: 'bg-warning text-warning-foreground', label: 'Dikembalikan' },
      voided: { color: 'bg-destructive text-destructive-foreground', label: 'Dibatalkan' },
      pending: { color: 'bg-secondary text-secondary-foreground', label: 'Pending' }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
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

  const toggleRowExpansion = (transactionId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(transactionId)) {
      newExpanded.delete(transactionId);
    } else {
      newExpanded.add(transactionId);
    }
    setExpandedRows(newExpanded);
  };

  const getSortIcon = (field: keyof Transaction) => {
    if (sortConfig.field !== field) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const canVoidTransaction = (transaction: Transaction) => {
    return currentUser.role === 'admin' && transaction.status === 'completed';
  };

  const canRefundTransaction = (transaction: Transaction) => {
    return transaction.status === 'completed';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('date')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Tanggal</span>
                  {getSortIcon('date')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('transactionId')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>ID Transaksi</span>
                  {getSortIcon('transactionId')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('totalAmount')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Total</span>
                  {getSortIcon('totalAmount')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">Pembayaran</th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('cashier')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Kasir</span>
                  {getSortIcon('cashier')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((transaction) => (
              <React.Fragment key={transaction.id}>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="font-medium text-foreground">
                        {formatDate(transaction.date)}
                      </div>
                      <div className="text-muted-foreground">
                        {transaction.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="font-mono text-foreground">
                        {transaction.transactionId}
                      </div>
                      <div className="text-muted-foreground">
                        #{transaction.receiptNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-foreground">
                      {formatCurrency(transaction.totalAmount)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-foreground">
                      {getPaymentMethodLabel(transaction.paymentMethod)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-foreground">
                      {transaction.cashier}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(transaction.id)}
                        iconName={expandedRows.has(transaction.id) ? "ChevronUp" : "ChevronDown"}
                        className="h-8 w-8 p-0"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(transaction)}
                        iconName="Eye"
                        className="h-8 w-8 p-0"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReprintReceipt(transaction)}
                        iconName="Printer"
                        className="h-8 w-8 p-0"
                      />
                      {canRefundTransaction(transaction) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRefundTransaction(transaction.id)}
                          iconName="RotateCcw"
                          className="h-8 w-8 p-0 text-warning hover:text-warning"
                        />
                      )}
                      {canVoidTransaction(transaction) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onVoidTransaction(transaction.id)}
                          iconName="X"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        />
                      )}
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row Details */}
                {expandedRows.has(transaction.id) && (
                  <tr>
                    <td colSpan={7} className="px-4 py-3 bg-muted/30">
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">Detail Item:</h4>
                        <div className="grid gap-2">
                          {transaction.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm bg-card p-2 rounded border">
                              <div>
                                <span className="font-medium text-foreground">{item.productName}</span>
                                <span className="text-muted-foreground ml-2">({item.sku})</span>
                              </div>
                              <div className="text-right">
                                <div className="text-foreground">
                                  {item.quantity} × {formatCurrency(item.unitPrice)} = {formatCurrency(item.totalPrice)}
                                </div>
                                {item.discount > 0 && (
                                  <div className="text-warning text-xs">
                                    Diskon: -{formatCurrency(item.discount)}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center pt-2 border-t border-border">
                          <div className="text-sm text-muted-foreground">
                            Subtotal: {formatCurrency(transaction.subtotal)} | 
                            Pajak: {formatCurrency(transaction.tax)} | 
                            Diskon: -{formatCurrency(transaction.discount)}
                          </div>
                          <div className="text-sm font-semibold text-foreground">
                            Total: {formatCurrency(transaction.totalAmount)}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;