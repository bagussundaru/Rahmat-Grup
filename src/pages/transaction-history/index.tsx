import React, { useState, useEffect, useMemo } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import StatusIndicatorBar from '../../components/ui/StatusIndicatorBar';
import TransactionFiltersComponent from './components/TransactionFilters';
import TransactionTable from './components/TransactionTable';
import TransactionDetailModal from './components/TransactionDetailModal';
import PaginationControls from './components/PaginationControls';
import ExportModal from './components/ExportModal';

import Icon from '../../components/AppIcon';
import { 
  Transaction, 
  TransactionFilters, 
  PaginationInfo, 
  SortConfig, 
  ExportOptions 
} from './types';

const TransactionHistoryPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock current user
  const currentUser = {
    name: 'Ahmad Rizki',
    role: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  };

  // Filters state
  const [filters, setFilters] = useState<TransactionFilters>({
    dateFrom: new Date(new Date().setDate(new Date().getDate() - 7)),
    dateTo: new Date(),
    paymentMethod: '',
    cashier: '',
    status: '',
    amountMin: null,
    amountMax: null,
    searchQuery: ''
  });

  // Pagination state
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 25
  });

  // Sort state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'date',
    direction: 'desc'
  });

  // Mock transaction data
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      date: new Date('2024-01-15T10:30:00'),
      time: '10:30',
      transactionId: 'TXN-20240115-001',
      totalAmount: 125000,
      paymentMethod: 'cash',
      cashier: 'Ahmad Rizki',
      status: 'completed',
      receiptNumber: 'R001234',
      subtotal: 115000,
      tax: 11500,
      discount: 1500,
      paymentDetails: {
        method: 'cash',
        amountPaid: 130000,
        change: 5000
      },
      items: [
        {
          id: '1',
          productId: 'P001',
          productName: 'Kopi Arabica Premium',
          sku: 'KAP-001',
          quantity: 2,
          unitPrice: 35000,
          totalPrice: 70000,
          discount: 0,
          category: 'Minuman'
        },
        {
          id: '2',
          productId: 'P002',
          productName: 'Roti Bakar Keju',
          sku: 'RBK-001',
          quantity: 1,
          unitPrice: 25000,
          totalPrice: 25000,
          discount: 1500,
          category: 'Makanan'
        },
        {
          id: '3',
          productId: 'P003',
          productName: 'Es Teh Manis',
          sku: 'ETM-001',
          quantity: 2,
          unitPrice: 10000,
          totalPrice: 20000,
          discount: 0,
          category: 'Minuman'
        }
      ],
      customerInfo: {
        name: 'Budi Santoso',
        phone: '081234567890'
      }
    },
    {
      id: '2',
      date: new Date('2024-01-15T11:45:00'),
      time: '11:45',
      transactionId: 'TXN-20240115-002',
      totalAmount: 85000,
      paymentMethod: 'qris',
      cashier: 'Siti Nurhaliza',
      status: 'completed',
      receiptNumber: 'R001235',
      subtotal: 78000,
      tax: 7800,
      discount: 800,
      paymentDetails: {
        method: 'qris',
        amountPaid: 85000,
        change: 0,
        qrisId: 'QR-20240115-002'
      },
      items: [
        {
          id: '4',
          productId: 'P004',
          productName: 'Nasi Gudeg Jogja',
          sku: 'NGJ-001',
          quantity: 1,
          unitPrice: 45000,
          totalPrice: 45000,
          discount: 0,
          category: 'Makanan'
        },
        {
          id: '5',
          productId: 'P005',
          productName: 'Jus Jeruk Segar',
          sku: 'JJS-001',
          quantity: 1,
          unitPrice: 15000,
          totalPrice: 15000,
          discount: 0,
          category: 'Minuman'
        },
        {
          id: '6',
          productId: 'P006',
          productName: 'Kerupuk Udang',
          sku: 'KU-001',
          quantity: 2,
          unitPrice: 9000,
          totalPrice: 18000,
          discount: 800,
          category: 'Snack'
        }
      ]
    },
    {
      id: '3',
      date: new Date('2024-01-15T14:20:00'),
      time: '14:20',
      transactionId: 'TXN-20240115-003',
      totalAmount: 67500,
      paymentMethod: 'card',
      cashier: 'Budi Santoso',
      status: 'refunded',
      receiptNumber: 'R001236',
      subtotal: 62500,
      tax: 6250,
      discount: 1250,
      paymentDetails: {
        method: 'card',
        amountPaid: 67500,
        change: 0,
        cardLast4: '1234'
      },
      items: [
        {
          id: '7',
          productId: 'P007',
          productName: 'Ayam Bakar Bumbu Rujak',
          sku: 'ABR-001',
          quantity: 1,
          unitPrice: 55000,
          totalPrice: 55000,
          discount: 1250,
          category: 'Makanan'
        },
        {
          id: '8',
          productId: 'P008',
          productName: 'Es Campur',
          sku: 'EC-001',
          quantity: 1,
          unitPrice: 12500,
          totalPrice: 12500,
          discount: 0,
          category: 'Dessert'
        }
      ],
      customerInfo: {
        name: 'Maya Sari',
        phone: '081987654321',
        email: 'maya.sari@email.com'
      }
    },
    {
      id: '4',
      date: new Date('2024-01-14T16:15:00'),
      time: '16:15',
      transactionId: 'TXN-20240114-004',
      totalAmount: 195000,
      paymentMethod: 'transfer',
      cashier: 'Maya Sari',
      status: 'completed',
      receiptNumber: 'R001237',
      subtotal: 180000,
      tax: 18000,
      discount: 3000,
      paymentDetails: {
        method: 'transfer',
        amountPaid: 195000,
        change: 0,
        reference: 'TF-20240114-004'
      },
      items: [
        {
          id: '9',
          productId: 'P009',
          productName: 'Paket Nasi Liwet Komplit',
          sku: 'PNL-001',
          quantity: 2,
          unitPrice: 65000,
          totalPrice: 130000,
          discount: 2000,
          category: 'Paket'
        },
        {
          id: '10',
          productId: 'P010',
          productName: 'Teh Botol Sosro',
          sku: 'TBS-001',
          quantity: 3,
          unitPrice: 8000,
          totalPrice: 24000,
          discount: 0,
          category: 'Minuman'
        },
        {
          id: '11',
          productId: 'P011',
          productName: 'Keripik Singkong',
          sku: 'KS-001',
          quantity: 2,
          unitPrice: 15000,
          totalPrice: 30000,
          discount: 1000,
          category: 'Snack'
        }
      ]
    },
    {
      id: '5',
      date: new Date('2024-01-14T09:30:00'),
      time: '09:30',
      transactionId: 'TXN-20240114-005',
      totalAmount: 45000,
      paymentMethod: 'cash',
      cashier: 'Ahmad Rizki',
      status: 'voided',
      receiptNumber: 'R001238',
      subtotal: 42000,
      tax: 4200,
      discount: 1200,
      paymentDetails: {
        method: 'cash',
        amountPaid: 50000,
        change: 5000
      },
      items: [
        {
          id: '12',
          productId: 'P012',
          productName: 'Mie Ayam Bakso',
          sku: 'MAB-001',
          quantity: 1,
          unitPrice: 28000,
          totalPrice: 28000,
          discount: 800,
          category: 'Makanan'
        },
        {
          id: '13',
          productId: 'P013',
          productName: 'Es Jeruk Nipis',
          sku: 'EJN-001',
          quantity: 2,
          unitPrice: 8000,
          totalPrice: 16000,
          discount: 400,
          category: 'Minuman'
        }
      ]
    }
  ];

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = mockTransactions.filter(transaction => {
      // Date filter
      if (filters.dateFrom && transaction.date < filters.dateFrom) return false;
      if (filters.dateTo && transaction.date > filters.dateTo) return false;
      
      // Payment method filter
      if (filters.paymentMethod && transaction.paymentMethod !== filters.paymentMethod) return false;
      
      // Cashier filter
      if (filters.cashier && !transaction.cashier.toLowerCase().includes(filters.cashier.toLowerCase())) return false;
      
      // Status filter
      if (filters.status && transaction.status !== filters.status) return false;
      
      // Amount range filter
      if (filters.amountMin && transaction.totalAmount < filters.amountMin) return false;
      if (filters.amountMax && transaction.totalAmount > filters.amountMax) return false;
      
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          transaction.transactionId.toLowerCase().includes(query) ||
          transaction.cashier.toLowerCase().includes(query) ||
          transaction.items.some(item => item.productName.toLowerCase().includes(query))
        );
      }
      
      return true;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];
      
      if (sortConfig.field === 'date') {
        aValue = new Date(aValue as Date).getTime();
        bValue = new Date(bValue as Date).getTime();
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [mockTransactions, filters, sortConfig]);

  // Paginated transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (paginationInfo.currentPage - 1) * paginationInfo.itemsPerPage;
    const endIndex = startIndex + paginationInfo.itemsPerPage;
    return filteredAndSortedTransactions.slice(startIndex, endIndex);
  }, [filteredAndSortedTransactions, paginationInfo.currentPage, paginationInfo.itemsPerPage]);

  // Update pagination info when filtered data changes
  useEffect(() => {
    const totalItems = filteredAndSortedTransactions.length;
    const totalPages = Math.ceil(totalItems / paginationInfo.itemsPerPage);
    
    setPaginationInfo(prev => ({
      ...prev,
      totalItems,
      totalPages,
      currentPage: Math.min(prev.currentPage, totalPages || 1)
    }));
  }, [filteredAndSortedTransactions, paginationInfo.itemsPerPage]);

  const handleSort = (field: keyof Transaction) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page: number) => {
    setPaginationInfo(prev => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPaginationInfo(prev => ({
      ...prev,
      itemsPerPage,
      currentPage: 1
    }));
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  const handleVoidTransaction = (transactionId: string) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan transaksi ini?')) {
      console.log('Voiding transaction:', transactionId);
      // In real app, this would call an API
    }
  };

  const handleReprintReceipt = (transaction: Transaction) => {
    console.log('Reprinting receipt for:', transaction.transactionId);
    // In real app, this would trigger thermal printer
    window.print();
  };

  const handleRefundTransaction = (transactionId: string) => {
    if (window.confirm('Apakah Anda yakin ingin memproses refund untuk transaksi ini?')) {
      console.log('Processing refund for:', transactionId);
      // In real app, this would call refund API
    }
  };

  const handleExport = async (options: ExportOptions) => {
    console.log('Exporting with options:', options);
    // In real app, this would generate and download the file
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create mock download
    const blob = new Blob(['Mock export data'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-export-${new Date().toISOString().split('T')[0]}.${options.format === 'excel' ? 'xlsx' : 'pdf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: new Date(new Date().setDate(new Date().getDate() - 7)),
      dateTo: new Date(),
      paymentMethod: '',
      cashier: '',
      status: '',
      amountMin: null,
      amountMax: null,
      searchQuery: ''
    });
    setPaginationInfo(prev => ({ ...prev, currentPage: 1 }));
  };

  const customQuickActions = [
    {
      label: 'Refresh Data',
      icon: 'RefreshCw',
      onClick: handleRefresh,
      variant: 'outline' as const,
      disabled: isRefreshing
    },
    {
      label: 'Export Excel',
      icon: 'Download',
      onClick: () => setIsExportModalOpen(true),
      variant: 'success' as const
    },
    {
      label: 'Filter Reset',
      icon: 'RotateCcw',
      onClick: resetFilters,
      variant: 'secondary' as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        currentUser={currentUser}
      />
      
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <NavigationBreadcrumbs customBreadcrumbs={[
                  { label: 'Dashboard', href: '/' },
                  { label: 'Riwayat Transaksi', href: '/transactions' }
                ]} />
                <div className="mt-2">
                  <h1 className="text-2xl font-bold text-foreground">Riwayat Transaksi</h1>
                  <p className="text-muted-foreground">
                    Kelola dan analisis semua transaksi penjualan
                  </p>
                </div>
              </div>
              <QuickActionToolbar customActions={customQuickActions} />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Receipt" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Transaksi</p>
                    <p className="text-xl font-bold text-foreground">
                      {filteredAndSortedTransactions.length.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="TrendingUp" size={20} className="text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Penjualan</p>
                    <p className="text-xl font-bold text-foreground">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(
                        filteredAndSortedTransactions
                          .filter(t => t.status === 'completed')
                          .reduce((sum, t) => sum + t.totalAmount, 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Icon name="RotateCcw" size={20} className="text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Refund</p>
                    <p className="text-xl font-bold text-foreground">
                      {filteredAndSortedTransactions.filter(t => t.status === 'refunded').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                    <Icon name="X" size={20} className="text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dibatalkan</p>
                    <p className="text-xl font-bold text-foreground">
                      {filteredAndSortedTransactions.filter(t => t.status === 'voided').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <TransactionFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              onReset={resetFilters}
              onExport={() => setIsExportModalOpen(true)}
            />

            {/* Transactions Table */}
            <TransactionTable
              transactions={paginatedTransactions}
              sortConfig={sortConfig}
              onSort={handleSort}
              onViewDetails={handleViewDetails}
              onVoidTransaction={handleVoidTransaction}
              onReprintReceipt={handleReprintReceipt}
              onRefundTransaction={handleRefundTransaction}
              currentUser={currentUser}
            />

            {/* Pagination */}
            <PaginationControls
              paginationInfo={paginationInfo}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </main>

          {/* Status Bar */}
          <StatusIndicatorBar onStatusClick={(status) => console.log('Status clicked:', status)} />
        </div>
      </div>

      {/* Modals */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTransaction(null);
        }}
        onReprintReceipt={handleReprintReceipt}
        onRefundTransaction={handleRefundTransaction}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default TransactionHistoryPage;