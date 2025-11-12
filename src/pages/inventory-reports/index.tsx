import React, { useState, useEffect, useMemo } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import StatusIndicatorBar from '../../components/ui/StatusIndicatorBar';
import InventoryTable from './components/InventoryTable';
import InventoryFilters from './components/InventoryFilters';
import InventorySummaryCards from './components/InventorySummaryCards';
import CategoryDistributionChart from './components/CategoryDistributionChart';
import StockMovementHistory from './components/StockMovementHistory';
import ReorderRecommendations from './components/ReorderRecommendations';
import ExportControls from './components/ExportControls';

import Icon from '../../components/AppIcon';
import {
  Product,
  StockMovement,
  InventorySummary,
  CategoryDistribution,
  FilterOptions,
  SortConfig,
  ExportOptions,
  ReorderRecommendation } from
'./types';

const InventoryReports = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'movements' | 'recommendations'>('overview');
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    status: '',
    dateRange: { start: null, end: null },
    searchTerm: ''
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc'
  });

  // Mock data
  const mockProducts: Product[] = [
  {
    id: 'PRD001',
    name: 'Kopi Arabica Premium',
    sku: 'KAP-001',
    category: 'Minuman',
    currentStock: 45,
    reorderPoint: 20,
    maxStock: 100,
    unitPrice: 25000,
    totalValue: 1125000,
    lastMovement: new Date('2024-01-15'),
    movementType: 'out',
    supplier: 'PT Kopi Nusantara',
    status: 'in-stock',
    image: "https://images.unsplash.com/photo-1690983325192-a4c13c2e331d",
    alt: 'Premium arabica coffee beans in burlap sack with wooden scoop'
  },
  {
    id: 'PRD002',
    name: 'Teh Earl Grey',
    sku: 'TEG-002',
    category: 'Minuman',
    currentStock: 8,
    reorderPoint: 15,
    maxStock: 50,
    unitPrice: 18000,
    totalValue: 144000,
    lastMovement: new Date('2024-01-14'),
    movementType: 'out',
    supplier: 'CV Teh Berkualitas',
    status: 'low-stock',
    image: "https://images.unsplash.com/photo-1645869792834-b227329b63f4",
    alt: 'Earl grey tea leaves with bergamot oil in elegant glass jar'
  },
  {
    id: 'PRD003',
    name: 'Roti Tawar Gandum',
    sku: 'RTG-003',
    category: 'Makanan',
    currentStock: 0,
    reorderPoint: 10,
    maxStock: 30,
    unitPrice: 12000,
    totalValue: 0,
    lastMovement: new Date('2024-01-13'),
    movementType: 'out',
    supplier: 'Toko Roti Segar',
    status: 'out-of-stock',
    image: "https://images.unsplash.com/photo-1615329399228-5d5d98a40e35",
    alt: 'Fresh whole wheat bread loaf sliced on wooden cutting board'
  },
  {
    id: 'PRD004',
    name: 'Susu UHT Cokelat',
    sku: 'SUC-004',
    category: 'Minuman',
    currentStock: 85,
    reorderPoint: 25,
    maxStock: 60,
    unitPrice: 8500,
    totalValue: 722500,
    lastMovement: new Date('2024-01-16'),
    movementType: 'in',
    supplier: 'PT Susu Murni',
    status: 'overstock',
    image: "https://images.unsplash.com/photo-1611250315547-8282ebf54796",
    alt: 'Chocolate UHT milk cartons stacked in refrigerated display case'
  },
  {
    id: 'PRD005',
    name: 'Biskuit Cokelat Chip',
    sku: 'BCC-005',
    category: 'Makanan',
    currentStock: 32,
    reorderPoint: 15,
    maxStock: 40,
    unitPrice: 15000,
    totalValue: 480000,
    lastMovement: new Date('2024-01-15'),
    movementType: 'out',
    supplier: 'CV Biskuit Lezat',
    status: 'in-stock',
    image: "https://images.unsplash.com/photo-1585351194205-1814dc5d4939",
    alt: 'Chocolate chip cookies arranged on white ceramic plate with milk glass'
  }];


  const mockMovements: StockMovement[] = [
  {
    id: 'MOV001',
    productId: 'PRD001',
    productName: 'Kopi Arabica Premium',
    type: 'sale',
    quantity: -5,
    previousStock: 50,
    newStock: 45,
    date: new Date('2024-01-15T14:30:00'),
    reference: 'TXN-20240115-001',
    notes: 'Penjualan reguler'
  },
  {
    id: 'MOV002',
    productId: 'PRD002',
    productName: 'Teh Earl Grey',
    type: 'sale',
    quantity: -3,
    previousStock: 11,
    newStock: 8,
    date: new Date('2024-01-14T16:45:00'),
    reference: 'TXN-20240114-005',
    notes: 'Penjualan sore'
  },
  {
    id: 'MOV003',
    productId: 'PRD004',
    productName: 'Susu UHT Cokelat',
    type: 'purchase',
    quantity: 30,
    previousStock: 55,
    newStock: 85,
    date: new Date('2024-01-16T09:15:00'),
    reference: 'PO-20240116-001',
    notes: 'Restok bulanan'
  },
  {
    id: 'MOV004',
    productId: 'PRD003',
    productName: 'Roti Tawar Gandum',
    type: 'sale',
    quantity: -2,
    previousStock: 2,
    newStock: 0,
    date: new Date('2024-01-13T11:20:00'),
    reference: 'TXN-20240113-003',
    notes: 'Habis terjual'
  },
  {
    id: 'MOV005',
    productId: 'PRD005',
    productName: 'Biskuit Cokelat Chip',
    type: 'adjustment',
    quantity: -3,
    previousStock: 35,
    newStock: 32,
    date: new Date('2024-01-15T10:00:00'),
    reference: 'ADJ-20240115-001',
    notes: 'Penyesuaian stok rusak'
  }];


  const mockRecommendations: ReorderRecommendation[] = [
  {
    productId: 'PRD003',
    productName: 'Roti Tawar Gandum',
    currentStock: 0,
    reorderPoint: 10,
    suggestedQuantity: 25,
    priority: 'high',
    daysUntilStockout: 0
  },
  {
    productId: 'PRD002',
    productName: 'Teh Earl Grey',
    currentStock: 8,
    reorderPoint: 15,
    suggestedQuantity: 30,
    priority: 'medium',
    daysUntilStockout: 5
  }];


  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter((product) => {
      const matchesSearch = !filters.searchTerm ||
      product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      product.supplier.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesStatus = !filters.status || product.status === filters.status;

      let matchesDateRange = true;
      if (filters.dateRange.start || filters.dateRange.end) {
        const movementDate = product.lastMovement;
        if (filters.dateRange.start && movementDate < filters.dateRange.start) matchesDateRange = false;
        if (filters.dateRange.end && movementDate > filters.dateRange.end) matchesDateRange = false;
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesDateRange;
    });

    // Sort products
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [mockProducts, filters, sortConfig]);

  // Calculate summary
  const inventorySummary: InventorySummary = useMemo(() => {
    return {
      totalProducts: mockProducts.length,
      totalStockValue: mockProducts.reduce((sum, product) => sum + product.totalValue, 0),
      lowStockItems: mockProducts.filter((p) => p.status === 'low-stock').length,
      outOfStockItems: mockProducts.filter((p) => p.status === 'out-of-stock').length,
      overstockItems: mockProducts.filter((p) => p.status === 'overstock').length,
      totalMovements: mockMovements.length
    };
  }, [mockProducts, mockMovements]);

  // Calculate category distribution
  const categoryDistribution: CategoryDistribution[] = useMemo(() => {
    const categories = mockProducts.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = { count: 0, value: 0 };
      }
      acc[product.category].count++;
      acc[product.category].value += product.totalValue;
      return acc;
    }, {} as Record<string, {count: number;value: number;}>);

    const totalValue = Object.values(categories).reduce((sum, cat) => sum + cat.value, 0);

    return Object.entries(categories).map(([category, data]) => ({
      category,
      count: data.count,
      value: data.value,
      percentage: totalValue > 0 ? data.value / totalValue * 100 : 0
    }));
  }, [mockProducts]);

  const categories = useMemo(() => {
    return [...new Set(mockProducts.map((product) => product.category))];
  }, [mockProducts]);

  const handleProductSelect = (productId: string) => {
    setSelectedProducts((prev) =>
    prev.includes(productId) ?
    prev.filter((id) => id !== productId) :
    [...prev, productId]
    );
  };

  const handleFiltersReset = () => {
    setFilters({
      category: '',
      status: '',
      dateRange: { start: null, end: null },
      searchTerm: ''
    });
  };

  const handleExport = (options: ExportOptions) => {
    console.log('Exporting with options:', options);
    // Implement export logic here
    alert(`Export ${options.format.toUpperCase()} berhasil! Data akan diunduh dalam beberapa saat.`);
  };

  const handleCreatePurchaseOrder = (productId: string) => {
    console.log('Creating purchase order for product:', productId);
    alert('Fitur pembuatan Purchase Order akan segera tersedia!');
  };

  const tabs = [
  { id: 'overview', label: 'Ringkasan', icon: 'BarChart3' },
  { id: 'movements', label: 'Pergerakan', icon: 'Activity' },
  { id: 'recommendations', label: 'Rekomendasi', icon: 'AlertTriangle' }];


  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <main className="p-6">
          {/* Header */}
          <div className="mb-6">
            <NavigationBreadcrumbs
              customBreadcrumbs={[
              { label: 'Dashboard', href: '/' },
              { label: 'Laporan', href: '/reports' },
              { label: 'Inventori' }]
              } />

            <div className="flex items-center justify-between mt-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Laporan Inventori</h1>
                <p className="text-muted-foreground">Analisis stok dan pergerakan inventori</p>
              </div>
              <div className="flex items-center space-x-4">
                <QuickActionToolbar
                  customActions={[
                  { id: 'refresh', label: 'Refresh', icon: 'RefreshCw', onClick: () => window.location.reload() }]
                  } />

                <ExportControls
                  onExport={handleExport}
                  selectedProductsCount={selectedProducts.length} />

              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <InventorySummaryCards summary={inventorySummary} />

          {/* Filters */}
          <InventoryFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={handleFiltersReset}
            categories={categories} />


          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabs.map((tab) =>
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                      flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id ?
                  'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}
                    `
                  }>

                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                )}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' &&
          <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <InventoryTable
                  products={filteredProducts}
                  onSort={setSortConfig}
                  sortConfig={sortConfig}
                  onProductSelect={handleProductSelect}
                  selectedProducts={selectedProducts} />

                </div>
                <div>
                  <CategoryDistributionChart data={categoryDistribution} />
                </div>
              </div>
            </div>
          }

          {activeTab === 'movements' &&
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InventoryTable
                products={filteredProducts}
                onSort={setSortConfig}
                sortConfig={sortConfig}
                onProductSelect={handleProductSelect}
                selectedProducts={selectedProducts} />

              </div>
              <div>
                <StockMovementHistory movements={mockMovements} />
              </div>
            </div>
          }

          {activeTab === 'recommendations' &&
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InventoryTable
                products={filteredProducts}
                onSort={setSortConfig}
                sortConfig={sortConfig}
                onProductSelect={handleProductSelect}
                selectedProducts={selectedProducts} />

              </div>
              <div>
                <ReorderRecommendations
                recommendations={mockRecommendations}
                onCreatePurchaseOrder={handleCreatePurchaseOrder} />

              </div>
            </div>
          }
        </main>
      </div>

      <StatusIndicatorBar
        onStatusClick={(status) => console.log('Status clicked:', status)} />

    </div>);

};

export default InventoryReports;