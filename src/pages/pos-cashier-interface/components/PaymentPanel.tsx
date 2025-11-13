import React, { useState } from 'react';
import { getSettings } from '../../../utils/settings';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from "components/ui/AppIcon";
import { PaymentState, Transaction } from '../types';

interface PaymentPanelProps {
  total: number;
  onProcessPayment: (paymentData: PaymentState) => void;
  onShowQRIS: () => void;
  isProcessing: boolean;
  disabled: boolean;
}

const PaymentPanel = ({ 
  total, 
  onProcessPayment, 
  onShowQRIS, 
  isProcessing, 
  disabled 
}: PaymentPanelProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | null>(null);
  const [cashAmount, setCashAmount] = useState<string>('');
  const [change, setChange] = useState<number>(0);

  const settings = getSettings();
  const taxRate = 0; // retail: no tax
  const discountPercent = settings.discountPercent ?? 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const discountAmount = Math.floor(total * (discountPercent / 100));
  const taxableBase = Math.max(0, total - discountAmount);
  const taxAmount = 0;
  const grandTotal = taxableBase + taxAmount;

  const handleCashAmountChange = (value: string) => {
    setCashAmount(value);
    const numericValue = parseFloat(value) || 0;
    setChange(Math.max(0, numericValue - grandTotal));
  };

  const handleCashPayment = () => {
    const cashValue = parseFloat(cashAmount) || 0;
    if (cashValue >= grandTotal) {
      onProcessPayment({
        method: 'cash',
        cashAmount: cashValue,
        change: cashValue - grandTotal,
        isProcessing: false
      });
    }
  };

  const handleQRISPayment = () => {
    setPaymentMethod('qris');
    onShowQRIS();
    onProcessPayment({
      method: 'qris',
      cashAmount: 0,
      change: 0,
      isProcessing: false
    });
  };

  const quickCashAmounts = [
    { label: '50K', value: 50000 },
    { label: '100K', value: 100000 },
    { label: '200K', value: 200000 },
    { label: 'Pas', value: grandTotal }
  ];

  const isValidCashAmount = parseFloat(cashAmount) >= grandTotal;

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground mb-2">Pembayaran</h2>
        <div className="bg-primary/10 rounded-lg p-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Diskon ({discountPercent}%)</span>
            <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pajak (0%)</span>
            <span className="font-semibold">{formatCurrency(0)}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Total Pembayaran</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(grandTotal)}</p>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-4 flex-1">
        {/* Cash Payment */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Icon name="Banknote" size={20} className="text-success" />
            <h3 className="font-medium text-foreground">Pembayaran Tunai</h3>
          </div>
          
          <Input
            type="number"
            placeholder="Masukkan jumlah uang tunai"
            value={cashAmount}
            onChange={(e) => handleCashAmountChange(e.target.value)}
            disabled={disabled || isProcessing}
            className="text-lg"
          />
          
          {/* Quick Cash Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {quickCashAmounts.map((amount) => (
              <Button
                key={amount.label}
                variant="outline"
                size="sm"
                onClick={() => handleCashAmountChange(amount.value.toString())}
                disabled={disabled || isProcessing}
                className="text-xs"
              >
                {amount.label}
              </Button>
            ))}
          </div>
          
          {/* Change Display */}
          {cashAmount && parseFloat(cashAmount) > 0 && (
            <div className="bg-muted rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Kembalian:</span>
                <span className={`font-semibold ${
                  change >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {formatCurrency(change)}
                </span>
              </div>
              {change < 0 && (
                <p className="text-xs text-destructive mt-1">
                  Uang tunai kurang {formatCurrency(Math.abs(change))}
                </p>
              )}
            </div>
          )}
          
          <Button
            variant="success"
            fullWidth
            iconName="Banknote"
            onClick={handleCashPayment}
            disabled={disabled || isProcessing || !isValidCashAmount}
            loading={isProcessing && paymentMethod === 'cash'}
          >
            Proses Pembayaran Tunai
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 border-t border-border"></div>
          <span className="text-xs text-muted-foreground">ATAU</span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        {/* QRIS Payment */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Icon name="QrCode" size={20} className="text-primary" />
            <h3 className="font-medium text-foreground">Pembayaran QRIS</h3>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <Icon name="QrCode" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Pembayaran digital menggunakan QR Code
            </p>
          </div>
          
          <Button
            variant="default"
            fullWidth
            iconName="QrCode"
            onClick={handleQRISPayment}
            disabled={disabled || isProcessing}
            loading={isProcessing && paymentMethod === 'qris'}
          >
            Tampilkan QR Code
          </Button>
        </div>
      </div>

      {/* Transaction Actions */}
      <div className="border-t border-border pt-4 mt-4 space-y-2">
        <Button
          variant="outline"
          fullWidth
          iconName="Calculator"
          disabled={disabled}
        >
          Kalkulator
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Percent"
            disabled={disabled}
          >
            Diskon
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Receipt"
            disabled={disabled}
          >
            Catatan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPanel;
