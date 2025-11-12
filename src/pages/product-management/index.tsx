import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import StatusIndicatorBar from '../../components/ui/StatusIndicatorBar';


import ProductTable from './components/ProductTable';
import ProductFilters from './components/ProductFilters';
import ProductFormModal from './components/ProductFormModal';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import ProductStats from './components/ProductStats';
import {
  Product,
  ProductCategory,
  ProductFilters as ProductFiltersType,
  ProductFormData,
  SortConfig } from
'./types';

const ProductManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filters, setFilters] = useState<ProductFiltersType>({
    category: '',
    stockLevel: 'all',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc'
  });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data initialization
  useEffect(() => {
    const mockCategories: ProductCategory[] = [
    { id: 'electronics', name: 'Elektronik', description: 'Perangkat elektronik dan gadget', productCount: 15 },
    { id: 'fashion', name: 'Fashion', description: 'Pakaian dan aksesoris', productCount: 25 },
    { id: 'food', name: 'Makanan & Minuman', description: 'Produk konsumsi', productCount: 18 },
    { id: 'books', name: 'Buku & Alat Tulis', description: 'Buku dan perlengkapan kantor', productCount: 12 },
    { id: 'health', name: 'Kesehatan & Kecantikan', description: 'Produk perawatan', productCount: 8 }];


    const mockProducts: Product[] = [
    {
      id: 'prod-001',
      name: 'iPhone 15 Pro Max',
      sku: 'IPH15PM-256-BLU',
      sellingPrice: 18999000,
      buyingPrice: 16500000,
      currentStock: 5,
      category: 'electronics',
      barcode: '1234567890123',
      image: "https://images.unsplash.com/photo-1697292866700-148d1078b17a",
      alt: 'iPhone 15 Pro Max berwarna biru titanium dengan layar 6.7 inci',
      description: 'Smartphone flagship Apple dengan chip A17 Pro dan kamera 48MP',
      minStock: 3,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 'prod-002',
      name: 'Samsung Galaxy S24 Ultra',
      sku: 'SGS24U-512-BLK',
      sellingPrice: 17999000,
      buyingPrice: 15800000,
      currentStock: 8,
      category: 'electronics',
      barcode: '2345678901234',
      image: "https://images.unsplash.com/photo-1707410420102-faff6eb0e033",
      alt: 'Samsung Galaxy S24 Ultra hitam dengan S Pen dan layar Dynamic AMOLED',
      description: 'Smartphone Android premium dengan S Pen dan kamera 200MP',
      minStock: 5,
      isActive: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: 'prod-003',
      name: 'MacBook Air M3',
      sku: 'MBA-M3-13-SLV',
      sellingPrice: 16999000,
      buyingPrice: 15200000,
      currentStock: 3,
      category: 'electronics',
      barcode: '3456789012345',
      image: "https://images.unsplash.com/photo-1608810832512-55200d57b14e",
      alt: 'MacBook Air M3 silver dengan layar 13 inci dan keyboard backlit',
      description: 'Laptop ultra-tipis Apple dengan chip M3 dan layar Liquid Retina',
      minStock: 2,
      isActive: true,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-22')
    },
    {
      id: 'prod-004',
      name: 'Nike Air Jordan 1 Retro',
      sku: 'NAJ1R-42-RED',
      sellingPrice: 2499000,
      buyingPrice: 1800000,
      currentStock: 12,
      category: 'fashion',
      barcode: '4567890123456',
      image: "https://images.unsplash.com/photo-1622831619806-ac62c4862163",
      alt: 'Sepatu Nike Air Jordan 1 Retro merah putih ukuran 42',
      description: 'Sepatu basket klasik dengan desain ikonik Michael Jordan',
      minStock: 8,
      isActive: true,
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-16')
    },
    {
      id: 'prod-005',
      name: 'Adidas Ultraboost 22',
      sku: 'AUB22-41-BLK',
      sellingPrice: 2799000,
      buyingPrice: 2100000,
      currentStock: 0,
      category: 'fashion',
      barcode: '5678901234567',
      image: "https://images.unsplash.com/photo-1511499008188-de491bbbae98",
      alt: 'Sepatu lari Adidas Ultraboost 22 hitam dengan teknologi Boost',
      description: 'Sepatu lari premium dengan teknologi Boost untuk kenyamanan maksimal',
      minStock: 6,
      isActive: true,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-14')
    },
    {
      id: 'prod-006',
      name: 'Kopi Arabica Premium',
      sku: 'KAP-250G-ORG',
      sellingPrice: 125000,
      buyingPrice: 85000,
      currentStock: 45,
      category: 'food',
      barcode: '6789012345678',
      image: "https://images.unsplash.com/photo-1681183133764-7278bd6f9ba3",
      alt: 'Kemasan kopi arabica premium organik 250 gram dengan biji kopi berkualitas tinggi',
      description: 'Kopi arabica single origin dari dataran tinggi Aceh',
      minStock: 20,
      isActive: true,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-12')
    },
    {
      id: 'prod-007',
      name: 'Teh Earl Grey Premium',
      sku: 'TEG-100G-ENG',
      sellingPrice: 89000,
      buyingPrice: 65000,
      currentStock: 28,
      category: 'food',
      barcode: '7890123456789',
      image: "https://images.unsplash.com/photo-1548832178-ffea5a4edc2e",
      alt: 'Kotak teh Earl Grey premium dengan daun teh berkualitas tinggi dan aroma bergamot',
      description: 'Teh hitam premium dengan aroma bergamot khas Inggris',
      minStock: 15,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: 'prod-008',
      name: 'Novel "Laskar Pelangi"',
      sku: 'NLP-2024-IND',
      sellingPrice: 95000,
      buyingPrice: 70000,
      currentStock: 22,
      category: 'books',
      barcode: '8901234567890',
      image: "https://images.unsplash.com/photo-1616323213852-f1933cbffd62",
      alt: 'Buku novel Laskar Pelangi dengan sampul berwarna-warni menampilkan anak-anak sekolah',
      description: 'Novel bestseller karya Andrea Hirata tentang perjuangan pendidikan',
      minStock: 10,
      isActive: true,
      createdAt: new Date('2023-12-28'),
      updatedAt: new Date('2024-01-08')
    },
    {
      id: 'prod-009',
      name: 'Serum Vitamin C',
      sku: 'SVC-30ML-GLW',
      sellingPrice: 185000,
      buyingPrice: 135000,
      currentStock: 15,
      category: 'health',
      barcode: '9012345678901',
      image: "https://images.unsplash.com/photo-1629135652513-5f99fb31c2fc",
      alt: 'Botol serum vitamin C 30ml dengan pipet dropper untuk perawatan wajah',
      description: 'Serum wajah dengan vitamin C 20% untuk mencerahkan kulit',
      minStock: 8,
      isActive: true,
      createdAt: new Date('2023-12-25'),
      updatedAt: new Date('2024-01-06')
    },
    {
      id: 'prod-010',
      name: 'Moisturizer Hyaluronic Acid',
      sku: 'MHA-50ML-HYD',
      sellingPrice: 225000,
      buyingPrice: 165000,
      currentStock: 7,
      category: 'health',
      barcode: '0123456789012',
      image: "https://images.unsplash.com/photo-1629380108660-bd39c778a721",
      alt: 'Jar moisturizer hyaluronic acid 50ml dengan tekstur gel untuk hidrasi kulit',
      description: 'Pelembab wajah dengan hyaluronic acid untuk hidrasi optimal',
      minStock: 10,
      isActive: true,
      createdAt: new Date('2023-12-22'),
      updatedAt: new Date('2024-01-04')
    }];


    setCategories(mockCategories);
    setProducts(mockProducts);
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Stock level filter
      if (filters.stockLevel === 'low' && product.currentStock > (product.minStock || 10)) {
        return false;
      }
      if (filters.stockLevel === 'out' && product.currentStock > 0) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.sku.toLowerCase().includes(searchTerm) ||
          product.barcode?.toLowerCase().includes(searchTerm));

      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' ?
        aValue.localeCompare(bValue) :
        bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ?
        aValue - bValue :
        bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [products, filters, sortConfig]);

  const handleSort = (key: keyof Product) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
    prev.includes(productId) ?
    prev.filter((id) => id !== productId) :
    [...prev, productId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedProducts(selected ? filteredAndSortedProducts.map((p) => p.id) : []);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleFormSubmit = (formData: ProductFormData) => {
    setIsLoading(true);

    setTimeout(() => {
      if (editingProduct) {
        // Update existing product
        setProducts((prev) => prev.map((p) =>
        p.id === editingProduct.id ?
        { ...p, ...formData, updatedAt: new Date() } :
        p
        ));
      } else {
        // Add new product
        const newProduct: Product = {
          ...formData,
          id: `prod-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setProducts((prev) => [...prev, newProduct]);
      }

      setIsFormModalOpen(false);
      setEditingProduct(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleBulkAction = (action: string, data?: any) => {
    switch (action) {
      case 'delete':
        setProducts((prev) => prev.filter((p) => !selectedProducts.includes(p.id)));
        setSelectedProducts([]);
        break;
      case 'price-update':
        setProducts((prev) => prev.map((p) => {
          if (selectedProducts.includes(p.id)) {
            const newPrice = data.type === 'percentage' ?
            p.sellingPrice * (1 + data.value / 100) :
            p.sellingPrice + data.value;
            return { ...p, sellingPrice: Math.max(0, newPrice), updatedAt: new Date() };
          }
          return p;
        }));
        setSelectedProducts([]);
        break;
      case 'category-change':
        setProducts((prev) => prev.map((p) => {
          if (selectedProducts.includes(p.id)) {
            return { ...p, category: data.categoryId, updatedAt: new Date() };
          }
          return p;
        }));
        setSelectedProducts([]);
        break;
      case 'stock-adjustment':
        setProducts((prev) => prev.map((p) => {
          if (selectedProducts.includes(p.id)) {
            let newStock = p.currentStock;
            switch (data.type) {
              case 'add':
                newStock += data.value;
                break;
              case 'subtract':
                newStock = Math.max(0, newStock - data.value);
                break;
              case 'set':
                newStock = Math.max(0, data.value);
                break;
            }
            return { ...p, currentStock: newStock, updatedAt: new Date() };
          }
          return p;
        }));
        setSelectedProducts([]);
        break;
    }
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      stockLevel: 'all',
      search: ''
    });
  };

  const quickActions = [
  {
    label: 'Tambah Produk',
    icon: 'Plus',
    onClick: handleAddProduct,
    variant: 'default' as const,
    shortcut: 'Ctrl+N'
  },
  {
    label: 'Import Data',
    icon: 'Upload',
    onClick: () => console.log('Import data'),
    variant: 'outline' as const,
    shortcut: 'Ctrl+I'
  },
  {
    label: 'Export Data',
    icon: 'Download',
    onClick: () => console.log('Export data'),
    variant: 'secondary' as const,
    shortcut: 'Ctrl+E'
  }];


  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Manajemen Produk - SmartPOS Pro</title>
        <meta name="description" content="Kelola inventori dan produk dengan sistem manajemen produk yang komprehensif" />
      </Helmet>

      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />


      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <main className="p-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <NavigationBreadcrumbs />
              <h1 className="text-2xl font-bold text-foreground mt-2">Manajemen Produk</h1>
              <p className="text-muted-foreground">
                Kelola inventori dan produk dengan sistem CRUD yang komprehensif
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <QuickActionToolbar customActions={quickActions} />
            </div>
          </div>

          {/* Product Statistics */}
          <ProductStats products={products} />

          {/* Bulk Actions */}
          <BulkActionsToolbar
            selectedCount={selectedProducts.length}
            onBulkAction={handleBulkAction}
            categories={categories}
            onClearSelection={() => setSelectedProducts([])} />


          {/* Filters */}
          <ProductFilters
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
            totalProducts={products.length}
            filteredCount={filteredAndSortedProducts.length}
            onClearFilters={handleClearFilters} />


          {/* Product Table */}
          <ProductTable
            products={filteredAndSortedProducts}
            selectedProducts={selectedProducts}
            onSelectProduct={handleSelectProduct}
            onSelectAll={handleSelectAll}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            sortConfig={sortConfig}
            onSort={handleSort} />

        </main>

        <StatusIndicatorBar />
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        categories={categories}
        isLoading={isLoading} />

    </div>);

};

export default ProductManagement;