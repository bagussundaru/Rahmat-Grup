export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  unitPrice: number;
  totalValue: number;
  lastMovement: Date;
  movementType: 'in' | 'out' | 'adjustment';
  supplier: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock';
  image: string;
  alt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'sale' | 'purchase' | 'adjustment' | 'return';
  quantity: number;
  previousStock: number;
  newStock: number;
  date: Date;
  reference: string;
  notes?: string;
}

export interface InventorySummary {
  totalProducts: number;
  totalStockValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  overstockItems: number;
  totalMovements: number;
}

export interface CategoryDistribution {
  category: string;
  count: number;
  value: number;
  percentage: number;
}

export interface FilterOptions {
  category: string;
  status: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  searchTerm: string;
}

export interface SortConfig {
  key: keyof Product;
  direction: 'asc' | 'desc';
}

export interface ExportOptions {
  format: 'excel' | 'pdf';
  includeMovements: boolean;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export interface ReorderRecommendation {
  productId: string;
  productName: string;
  currentStock: number;
  reorderPoint: number;
  suggestedQuantity: number;
  priority: 'high' | 'medium' | 'low';
  daysUntilStockout: number;
}