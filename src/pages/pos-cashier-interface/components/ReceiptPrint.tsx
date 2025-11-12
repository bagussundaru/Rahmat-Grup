import React from 'react';
import { Transaction } from '../types';

interface ReceiptPrintProps {
  transaction: Transaction;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
}

const ReceiptPrint = ({ 
  transaction, 
  storeName = "SmartPOS Store",
  storeAddress = "Jl. Raya Bisnis No. 123, Jakarta",
  storePhone = "021-1234-5678"
}: ReceiptPrintProps) => {
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
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <>
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-print, .receipt-print * {
            visibility: visible;
          }
          .receipt-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 58mm !important;
            font-size: 10px !important;
            line-height: 1.2 !important;
            margin: 0 !important;
            padding: 2mm !important;
          }
          .no-print {
            display: none !important;
          }
          .receipt-header {
            text-align: center;
            margin-bottom: 3mm;
          }
          .receipt-line {
            border-top: 1px dashed #000;
            margin: 2mm 0;
          }
          .receipt-item {
            display: flex;
            justify-content: space-between;
            margin: 1mm 0;
          }
          .receipt-total {
            font-weight: bold;
            font-size: 11px;
          }
        }
      `}</style>

      {/* Print Button */}
      <div className="no-print mb-4">
        <button
          onClick={printReceipt}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-150"
        >
          Cetak Struk
        </button>
      </div>

      {/* Receipt Content */}
      <div className="receipt-print bg-white text-black p-4 max-w-xs mx-auto border border-gray-300">
        {/* Header */}
        <div className="receipt-header text-center mb-4">
          <h1 className="text-lg font-bold">{storeName}</h1>
          <p className="text-xs">{storeAddress}</p>
          <p className="text-xs">Telp: {storePhone}</p>
        </div>

        <div className="receipt-line"></div>

        {/* Transaction Info */}
        <div className="text-xs mb-3">
          <div className="flex justify-between">
            <span>No. Transaksi:</span>
            <span className="font-mono">{transaction.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{formatDate(transaction.timestamp)}</span>
          </div>
          <div className="flex justify-between">
            <span>Kasir:</span>
            <span>{transaction.cashierName}</span>
          </div>
        </div>

        <div className="receipt-line"></div>

        {/* Items */}
        <div className="mb-3">
          {transaction.items.map((item, index) => (
            <div key={index} className="mb-2">
              <div className="text-xs font-medium">{item.product.name}</div>
              <div className="flex justify-between text-xs">
                <span>{item.quantity} x {formatCurrency(item.product.price)}</span>
                <span>{formatCurrency(item.subtotal)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="receipt-line"></div>

        {/* Totals */}
        <div className="text-xs mb-3">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(transaction.subtotal)}</span>
          </div>
          {transaction.discount > 0 && (
            <div className="flex justify-between">
              <span>Diskon:</span>
              <span>-{formatCurrency(transaction.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Pajak (11%):</span>
            <span>{formatCurrency(transaction.tax)}</span>
          </div>
          <div className="receipt-line"></div>
          <div className="flex justify-between receipt-total">
            <span>TOTAL:</span>
            <span>{formatCurrency(transaction.total)}</span>
          </div>
        </div>

        <div className="receipt-line"></div>

        {/* Payment Info */}
        <div className="text-xs mb-3">
          <div className="flex justify-between">
            <span>Metode Bayar:</span>
            <span className="uppercase">{transaction.paymentMethod}</span>
          </div>
          {transaction.paymentMethod === 'cash' && (
            <>
              <div className="flex justify-between">
                <span>Tunai:</span>
                <span>{formatCurrency(transaction.cashReceived || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kembalian:</span>
                <span>{formatCurrency(transaction.change || 0)}</span>
              </div>
            </>
          )}
        </div>

        <div className="receipt-line"></div>

        {/* Footer */}
        <div className="text-center text-xs mt-4">
          <p>Terima kasih atas kunjungan Anda!</p>
          <p>Barang yang sudah dibeli tidak dapat dikembalikan</p>
          <p className="mt-2">www.smartpos.co.id</p>
        </div>
      </div>
    </>
  );
};

export default ReceiptPrint;