import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import StatusIndicatorBar from '../../components/ui/StatusIndicatorBar';
import MetricCards from './components/MetricCards';
import RecentTransactions from './components/RecentTransactions';
import DateRangeSelector from './components/DateRangeSelector';
import SalesChart from './components/SalesChart';
import PaymentMethodChart from './components/PaymentMethodChart';
import TopProducts from './components/TopProducts';
import HourlyChart from './components/HourlyChart';
import ExportActions from './components/ExportActions';
import {
  MetricCard,
  Transaction,
  DateRange,
  SalesData,
  PaymentMethodData,
  TopProduct,
  HourlyData } from
'./types';

const SalesDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
    preset: 'today'
  });

  // Mock data
  const metricCards: MetricCard[] = [
  {
    id: '1',
    title: 'Pendapatan Hari Ini',
    value: 15750000,
    change: 12.5,
    changeType: 'increase',
    icon: 'TrendingUp',
    color: 'bg-primary',
    description: 'Dibanding kemarin'
  },
  {
    id: '2',
    title: 'Total Transaksi',
    value: 247,
    change: 8.2,
    changeType: 'increase',
    icon: 'Receipt',
    color: 'bg-accent',
    description: 'Transaksi hari ini'
  },
  {
    id: '3',
    title: 'Rata-rata Penjualan',
    value: 63765,
    change: -2.1,
    changeType: 'decrease',
    icon: 'Calculator',
    color: 'bg-warning',
    description: 'Per transaksi'
  },
  {
    id: '4',
    title: 'Produk Terjual',
    value: 892,
    change: 15.3,
    changeType: 'increase',
    icon: 'Package',
    color: 'bg-success',
    description: 'Item hari ini'
  }];


  const recentTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    date: '15/12/2024',
    time: '14:32',
    totalAmount: 125000,
    paymentMethod: 'qris',
    cashierName: 'Sari Dewi',
    items: 3,
    status: 'completed'
  },
  {
    id: 'TXN-002',
    date: '15/12/2024',
    time: '14:28',
    totalAmount: 89500,
    paymentMethod: 'cash',
    cashierName: 'Ahmad Rizki',
    items: 2,
    status: 'completed'
  },
  {
    id: 'TXN-003',
    date: '15/12/2024',
    time: '14:25',
    totalAmount: 245000,
    paymentMethod: 'card',
    cashierName: 'Sari Dewi',
    items: 5,
    status: 'completed'
  },
  {
    id: 'TXN-004',
    date: '15/12/2024',
    time: '14:20',
    totalAmount: 67500,
    paymentMethod: 'qris',
    cashierName: 'Budi Santoso',
    items: 1,
    status: 'refunded'
  },
  {
    id: 'TXN-005',
    date: '15/12/2024',
    time: '14:15',
    totalAmount: 156000,
    paymentMethod: 'cash',
    cashierName: 'Ahmad Rizki',
    items: 4,
    status: 'completed'
  }];


  const salesData: SalesData[] = [
  { date: '2024-12-09', revenue: 12500000, transactions: 185 },
  { date: '2024-12-10', revenue: 14200000, transactions: 210 },
  { date: '2024-12-11', revenue: 13800000, transactions: 195 },
  { date: '2024-12-12', revenue: 16100000, transactions: 235 },
  { date: '2024-12-13', revenue: 15300000, transactions: 220 },
  { date: '2024-12-14', revenue: 17500000, transactions: 265 },
  { date: '2024-12-15', revenue: 15750000, transactions: 247 }];


  const paymentMethodData: PaymentMethodData[] = [
  {
    method: 'Tunai',
    amount: 8500000,
    percentage: 54.0,
    color: 'var(--color-primary)'
  },
  {
    method: 'QRIS',
    amount: 4750000,
    percentage: 30.2,
    color: 'var(--color-accent)'
  },
  {
    method: 'Kartu',
    amount: 2500000,
    percentage: 15.8,
    color: 'var(--color-warning)'
  }];


  const topProducts: TopProduct[] = [
  {
    id: 'PRD-001',
    name: 'Kopi Arabica Premium',
    category: 'Minuman',
    quantitySold: 45,
    revenue: 1350000,
    image: "https://images.unsplash.com/photo-1643045431901-6406cb6f4019",
    alt: 'Premium arabica coffee beans in white ceramic cup on wooden table'
  },
  {
    id: 'PRD-002',
    name: 'Roti Bakar Keju',
    category: 'Makanan',
    quantitySold: 38,
    revenue: 950000,
    image: "https://images.unsplash.com/photo-1618650158177-f3ce47a9910a",
    alt: 'Golden grilled cheese sandwich with melted cheese on wooden cutting board'
  },
  {
    id: 'PRD-003',
    name: 'Es Teh Manis',
    category: 'Minuman',
    quantitySold: 62,
    revenue: 775000,
    image: "https://images.unsplash.com/photo-1567523116908-1f1c367a469d",
    alt: 'Glass of iced sweet tea with ice cubes and mint leaves on marble surface'
  },
  {
    id: 'PRD-004',
    name: 'Nasi Gudeg Jogja',
    category: 'Makanan',
    quantitySold: 28,
    revenue: 700000,
    image: "https://images.unsplash.com/photo-1728413257806-353b5c1ab35d",
    alt: 'Traditional Javanese gudeg dish with rice and side dishes on banana leaf'
  },
  {
    id: 'PRD-005',
    name: 'Jus Alpukat',
    category: 'Minuman',
    quantitySold: 35,
    revenue: 525000,
    image: "https://images.unsplash.com/photo-1605909870133-3b55c227362d",
    alt: 'Fresh avocado juice in tall glass with avocado slices and straw'
  }];


  const hourlyData: HourlyData[] = [
  { hour: '08', transactions: 12, revenue: 450000 },
  { hour: '09', transactions: 18, revenue: 675000 },
  { hour: '10', transactions: 25, revenue: 925000 },
  { hour: '11', transactions: 32, revenue: 1200000 },
  { hour: '12', transactions: 45, revenue: 1750000 },
  { hour: '13', transactions: 38, revenue: 1450000 },
  { hour: '14', transactions: 28, revenue: 1100000 },
  { hour: '15', transactions: 22, revenue: 850000 },
  { hour: '16', transactions: 15, revenue: 575000 },
  { hour: '17', transactions: 12, revenue: 475000 }];


  const handleViewAllTransactions = () => {
    navigate('/transaction-history');
  };

  const handleViewTransaction = (transactionId: string) => {
    navigate(`/transaction-history?id=${transactionId}`);
  };

  const handleExportExcel = (type: 'sales' | 'transactions' | 'products') => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      console.log(`Exporting ${type} data to Excel...`);
      setIsLoading(false);
    }, 2000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Data refreshed');
      setIsLoading(false);
    }, 1500);
  };

  const handleStatusClick = (status: string) => {
    console.log(`Status clicked: ${status}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentUser={{
          name: 'Manager Toko',
          role: 'owner'
        }} />


      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <main className="p-6">
          {/* Header */}
          <div className="mb-6">
            <NavigationBreadcrumbs />
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-4 space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard Penjualan</h1>
                <p className="text-muted-foreground">
                  Analisis performa bisnis dan laporan penjualan real-time
                </p>
              </div>
              <QuickActionToolbar />
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="mb-6">
            <DateRangeSelector
              dateRange={dateRange}
              onDateRangeChange={setDateRange} />

          </div>

          {/* Export Actions */}
          <div className="mb-6">
            <ExportActions
              dateRange={dateRange}
              onExportExcel={handleExportExcel}
              onPrintReport={handlePrintReport}
              onRefreshData={handleRefreshData}
              isLoading={isLoading} />

          </div>

          {/* Metric Cards */}
          <div className="mb-8">
            <MetricCards metrics={metricCards} />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SalesChart
              data={salesData}
              type="line"
              title="Tren Penjualan 7 Hari Terakhir" />

            <PaymentMethodChart data={paymentMethodData} />
          </div>

          {/* Secondary Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <HourlyChart data={hourlyData} />
            </div>
            <TopProducts products={topProducts} />
          </div>

          {/* Recent Transactions */}
          <div className="mb-8">
            <RecentTransactions
              transactions={recentTransactions}
              onViewAll={handleViewAllTransactions}
              onViewTransaction={handleViewTransaction} />

          </div>
        </main>

        <StatusIndicatorBar
          onStatusClick={handleStatusClick}
          className="fixed bottom-0 left-0 right-0" />

      </div>
    </div>);

};

export default SalesDashboard;
