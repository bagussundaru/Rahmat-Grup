export interface MetricCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: string;
  description?: string;
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  totalAmount: number;
  paymentMethod: 'cash' | 'qris' | 'card';
  cashierName: string;
  items: number;
  status: 'completed' | 'refunded' | 'pending';
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface SalesData {
  date: string;
  revenue: number;
  transactions: number;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  quantitySold: number;
  revenue: number;
  image: string;
  alt: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
  preset: 'today' | 'week' | 'month' | 'custom';
}

export interface PaymentMethodData {
  method: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface HourlyData {
  hour: string;
  transactions: number;
  revenue: number;
}