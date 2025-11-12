export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  buyingPrice: number;
  stock: number;
  category: string;
  barcode?: string;
  image?: string;
  alt?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'qris';
  cashReceived?: number;
  change?: number;
  timestamp: Date;
  cashierName: string;
}

export interface PaymentState {
  method: 'cash' | 'qris' | null;
  cashAmount: number;
  change: number;
  isProcessing: boolean;
}

export interface BarcodeScanner {
  isActive: boolean;
  lastScanned: string;
  scanBuffer: string;
}

export interface QRISPayment {
  qrCode: string;
  amount: number;
  merchantId: string;
  transactionId: string;
}