import React, { useState, useEffect, useRef } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from "components/ui/AppIcon";
import Image from "components/ui/AppImage";
import { Product } from '../types';

interface ProductSearchProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onBarcodeScanned: (barcode: string) => void;
}

const ProductSearch = ({ products, onAddToCart, onBarcodeScanned }: ProductSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isManualScanMode, setIsManualScanMode] = useState(false);
  const [scanBuffer, setScanBuffer] = useState('');
  const [lastScanResult, setLastScanResult] = useState<{barcode: string, success: boolean, timestamp: number} | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Real-time barcode detection (enhanced from global detection in main component)
  useEffect(() => {
    let scanTimeout: NodeJS.Timeout;
    let keyBuffer: string[] = [];
    let keyTimestamps: number[] = [];

    const handleLocalKeyPress = (event: KeyboardEvent) => {
      // Only handle if we're in manual scan mode and focused on search input
      if (!isManualScanMode || document.activeElement !== inputRef.current) return;

      const now = Date.now();
      
      if (event.key === 'Enter') {
        event.preventDefault();
        if (scanBuffer.length > 0) {
          onBarcodeScanned(scanBuffer);
          setLastScanResult({
            barcode: scanBuffer,
            success: true,
            timestamp: now
          });
          setScanBuffer('');
          setSearchTerm('');
        }
      } else if (event.key.length === 1) {
        // Detect if this is likely a barcode scanner (rapid input)
        keyTimestamps.push(now);
        keyBuffer.push(event.key);
        
        // Keep only recent keystrokes (last 500ms)
        const recentThreshold = now - 500;
        keyTimestamps = keyTimestamps.filter(timestamp => timestamp > recentThreshold);
        keyBuffer = keyBuffer.slice(-keyTimestamps.length);
        
        // If we have rapid keystrokes, it's likely a scanner
        const isRapidInput = keyTimestamps.length >= 3 && 
          (now - keyTimestamps[keyTimestamps.length - 3]) < 200;
          
        if (isRapidInput) {
          // Prevent normal input and build scan buffer
          event.preventDefault();
          setScanBuffer(prev => prev + event.key);
          setSearchTerm(prev => prev + event.key);
        } else {
          // Normal manual typing
          setScanBuffer(prev => prev + event.key);
        }
        
        // Clear buffer after timeout
        clearTimeout(scanTimeout);
        scanTimeout = setTimeout(() => {
          setScanBuffer('');
          keyBuffer = [];
          keyTimestamps = [];
        }, 300);
      }
    };

    if (isManualScanMode) {
      document.addEventListener('keydown', handleLocalKeyPress);
    }
    
    return () => {
      document.removeEventListener('keydown', handleLocalKeyPress);
      clearTimeout(scanTimeout);
    };
  }, [isManualScanMode, scanBuffer, onBarcodeScanned]);

  // Filter products based on search term with enhanced matching
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts([]);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = products.filter(product => {
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.barcode?.includes(searchTerm) ||
          product.category.toLowerCase().includes(searchLower)
        );
      });
      setFilteredProducts(filtered.slice(0, 12)); // Show more results
    }
  }, [searchTerm, products]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleManualBarcodeScan = () => {
    const barcode = searchTerm.trim();
    if (barcode) {
      onBarcodeScanned(barcode);
      setLastScanResult({
        barcode,
        success: true,
        timestamp: Date.now()
      });
      setSearchTerm('');
    }
  };

  const handleQuickAdd = (product: Product) => {
    onAddToCart(product);
    // Brief visual feedback
    const button = document.activeElement as HTMLButtonElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = '✓';
      button.classList.add('bg-success', 'text-success-foreground');
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('bg-success', 'text-success-foreground');
      }, 600);
    }
  };

  const toggleScanMode = () => {
    setIsManualScanMode(!isManualScanMode);
    if (!isManualScanMode) {
      // Focus input when entering manual scan mode
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full flex flex-col">
      {/* Enhanced Header with Scanner Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-foreground">Cari Produk</h2>
          {isManualScanMode && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              <Icon name="Scan" size={12} className="animate-pulse" />
              <span>Manual Scan</span>
            </div>
          )}
        </div>
        
        {lastScanResult && (
          <div className="flex items-center space-x-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${lastScanResult.success ? 'bg-success' : 'bg-destructive'} animate-pulse`} />
            <span className="text-muted-foreground">
              Last: {lastScanResult.barcode.substring(0, 8)}...
            </span>
          </div>
        )}
      </div>

      {/* Enhanced Search Input */}
      <div className="space-y-3 mb-4">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder={isManualScanMode ? "Fokus untuk scan barcode atau ketik manual..." : "Cari nama produk, SKU, kategori..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pr-10 ${isManualScanMode ? 'border-primary bg-primary/5' : ''}`}
            />
            {scanBuffer && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Icon name="Loader2" size={16} className="text-primary animate-spin" />
              </div>
            )}
          </div>
          
          <Button
            variant={isManualScanMode ? "default" : "outline"}
            iconName="Scan"
            onClick={toggleScanMode}
            className={isManualScanMode ? 'bg-primary text-primary-foreground' : ''}
          >
            {isManualScanMode ? 'Scan ON' : 'Scan'}
          </Button>
          
          <Button
            variant="outline"
            iconName="Search"
            onClick={handleManualBarcodeScan}
            disabled={!searchTerm.trim()}
          >
            Cari
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center space-x-4">
            <span>• Scanner fisik: Otomatis terdeteksi</span>
            <span>• Manual: Aktifkan mode scan</span>
          </div>
          <div className="flex items-center justify-between">
            <span>• Tekan Enter setelah input barcode</span>
            {filteredProducts.length > 0 && (
              <span className="text-primary font-medium">
                {filteredProducts.length} produk ditemukan
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Search Results */}
      <div className="flex-1 overflow-y-auto">
        {searchTerm && filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Icon name="Search" size={32} className="text-muted-foreground mb-2" />
            <p className="text-muted-foreground font-medium">Produk tidak ditemukan</p>
            <p className="text-xs text-muted-foreground mt-1">
              Coba kata kunci lain atau scan barcode
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-xs"
              onClick={() => setSearchTerm('')}
            >
              Reset pencarian
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-all duration-150 group"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.alt || `Gambar produk ${product.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon name="Package" size={20} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>SKU: {product.sku}</span>
                    <span>•</span>
                    <span>{product.category}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-semibold text-primary">
                      {formatCurrency(product.price)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.stock > 10 
                        ? 'bg-success/10 text-success' 
                        : product.stock > 0 
                        ? 'bg-warning/10 text-warning' :'bg-destructive/10 text-destructive'
                    }`}>
                      Stok: {product.stock}
                    </span>
                  </div>
                  {product.barcode && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Barcode: {product.barcode}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Plus"
                    onClick={() => handleQuickAdd(product)}
                    disabled={product.stock === 0}
                    className="hover:bg-success hover:text-success-foreground hover:border-success transition-colors"
                  >
                    Tambah
                  </Button>
                  <div className="text-center">
                    <kbd className="text-xs px-1 py-0.5 bg-muted rounded text-muted-foreground">
                      {index + 1}
                    </kbd>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Quick Actions */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={isManualScanMode ? "default" : "outline"}
            size="sm"
            iconName="Scan"
            onClick={toggleScanMode}
          >
            {isManualScanMode ? 'Stop' : 'Scan'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Search"
            onClick={() => {
              setSearchTerm('');
              setScanBuffer('');
              setLastScanResult(null);
            }}
          >
            Reset
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="BarChart3"
            onClick={() => {
              // Show popular products (first 5 with highest stock)
              const popular = [...products]
                .sort((a, b) => b.stock - a.stock)
                .slice(0, 5);
              setFilteredProducts(popular);
              setSearchTerm('populer');
            }}
          >
            Populer
          </Button>
        </div>
        
        {/* Keyboard shortcuts info */}
        <div className="text-xs text-muted-foreground mt-2 text-center">
          <span>Gunakan angka 1-9 untuk tambah produk cepat</span>
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;