export interface Transaction {
  id: string;
  date: Date;
  time: string;
  transactionId: string;
  totalAmount: number;
  paymentMethod: 'cash' | 'qris' | 'card' | 'transfer';
  cashier: string;
  status: 'completed' | 'refunded' | 'voided' | 'pending';
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  discount: number;
  paymentDetails: PaymentDetails;
  receiptNumber: string;
  customerInfo?: CustomerInfo;
}

export interface TransactionItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
  category: string;
}

export interface PaymentDetails {
  method: 'cash' | 'qris' | 'card' | 'transfer';
  amountPaid: number;
  change: number;
  reference?: string;
  cardLast4?: string;
  qrisId?: string;
}

export interface CustomerInfo {
  name?: string;
  phone?: string;
  email?: string;
  membershipId?: string;
}

export interface TransactionFilters {
  dateFrom: Date | null;
  dateTo: Date | null;
  paymentMethod: string;
  cashier: string;
  status: string;
  amountMin: number | null;
  amountMax: number | null;
  searchQuery: string;
}

export interface ExportOptions {
  format: 'excel' | 'pdf';
  dateRange: {
    from: Date;
    to: Date;
  };
  includeItems: boolean;
  includePaymentDetails: boolean;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface SortConfig {
  field: keyof Transaction;
  direction: 'asc' | 'desc';
}