export interface Product {
  id: string;
  name: string;
  sku: string;
  sellingPrice: number;
  buyingPrice: number;
  currentStock: number;
  category: string;
  barcode?: string;
  image?: string;
  alt?: string;
  description?: string;
  minStock?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  productCount: number;
}

export interface ProductFormData {
  name: string;
  sku: string;
  sellingPrice: number;
  buyingPrice: number;
  currentStock: number;
  category: string;
  barcode?: string;
  image?: string;
  alt?: string;
  description?: string;
  minStock?: number;
  isActive: boolean;
}

export interface ProductFilters {
  category: string;
  stockLevel: 'all' | 'low' | 'out';
  search: string;
}

export interface BulkAction {
  type: 'price-update' | 'category-change' | 'stock-adjustment' | 'delete';
  label: string;
  icon: string;
}

export interface ProductTableColumn {
  key: keyof Product;
  label: string;
  sortable: boolean;
  width?: string;
}

export interface SortConfig {
  key: keyof Product;
  direction: 'asc' | 'desc';
}

export interface BarcodeInput {
  value: string;
  timestamp: number;
}