import React, { useEffect, useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from "components/ui/AppIcon";
import { QRISPayment } from '../types';

interface QRISModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentConfirmed: () => void;
  amount: number;
  transactionId: string;
}

const QRISModal = ({ 
  isOpen, 
  onClose, 
  onPaymentConfirmed, 
  amount, 
  transactionId 
}: QRISModalProps) => {
  const [qrisData, setQrisData] = useState<QRISPayment | null>(null);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [isWaitingPayment, setIsWaitingPayment] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Generate QRIS data
      const qrisPayment: QRISPayment = {
        qrCode: `00020101021226580014ID.CO.QRIS.WWW0215ID20232024567890303UMI51440014ID.CO.QRIS.WWW0215ID20232024567890303UMI5204481253033605802ID5914SMARTPOS STORE6007JAKARTA61051234062070703A0163044B7A`,
        amount: amount,
        merchantId: "ID20232024567890",
        transactionId: transactionId
      };
      setQrisData(qrisPayment);
      setCountdown(300);
      setIsWaitingPayment(true);
    }
  }, [isOpen, amount, transactionId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      onClose();
    }
    return () => clearTimeout(timer);
  }, [isOpen, countdown, onClose]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handlePaymentConfirmed = () => {
    setIsWaitingPayment(false);
    onPaymentConfirmed();
    onClose();
  };

  if (!isOpen || !qrisData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevation-2 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="QrCode" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Pembayaran QRIS</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Amount */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-1">Total Pembayaran</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(amount)}</p>
          </div>

          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg mb-6 inline-block">
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
              {/* QR Code placeholder - in real implementation, use a QR code library */}
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 64 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 ${
                      Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <p className="text-sm text-foreground">Buka aplikasi e-wallet atau mobile banking</p>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <p className="text-sm text-foreground">Scan QR Code di atas</p>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <p className="text-sm text-foreground">Konfirmasi pembayaran di aplikasi Anda</p>
            </div>
          </div>

          {/* Timer */}
          <div className="bg-warning/10 rounded-lg p-3 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <Icon name="Clock" size={16} className="text-warning" />
              <span className="text-sm text-warning font-medium">
                Waktu tersisa: {formatTime(countdown)}
              </span>
            </div>
          </div>

          {/* Transaction Info */}
          <div className="bg-muted/50 rounded-lg p-3 mb-6 text-left">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">ID Transaksi:</span>
                <span className="font-mono">{transactionId}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Merchant ID:</span>
                <span className="font-mono">{qrisData.merchantId}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          {isWaitingPayment && (
            <div className="flex items-center justify-center space-x-2 text-warning mb-4">
              <Icon name="Clock" size={16} className="animate-pulse" />
              <span className="text-sm">Menunggu pembayaran...</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-4 border-t border-border">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            variant="success"
            fullWidth
            iconName="CheckCircle"
            onClick={handlePaymentConfirmed}
          >
            Konfirmasi Pembayaran
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRISModal;