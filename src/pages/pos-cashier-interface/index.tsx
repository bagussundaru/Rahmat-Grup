import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import StatusIndicatorBar from '../../components/ui/StatusIndicatorBar';
import ShoppingCart from './components/ShoppingCart';
import ProductSearch from './components/ProductSearch';
import PaymentPanel from './components/PaymentPanel';
import QRISModal from './components/QRISModal';
import ReceiptPrint from './components/ReceiptPrint';
import Button from '../../components/ui/Button';
import Icon from "components/ui/AppIcon";
import { Product, CartItem, Transaction, PaymentState } from './types';

const POSCashierInterface = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [showQRISModal, setShowQRISModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isBarcodeScannerActive, setIsBarcodeScannerActive] = useState(true);
  const [lastScanTime, setLastScanTime] = useState<number>(0);
  const scanBufferRef = useRef<string>('');
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const keySequenceRef = useRef<number[]>([]);

  // Mock products data with enhanced barcode examples
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Indomie Goreng Original",
      sku: "IDM001",
      price: 3500,
      buyingPrice: 2800,
      stock: 150,
      category: "Makanan Instan",
      barcode: "8992388123456",
      image: "https://images.unsplash.com/photo-1630335805962-41109674b07b",
      alt: "Kemasan mie instan Indomie goreng original dengan warna merah dan kuning"
    },
    {
      id: "2",
      name: "Aqua Botol 600ml",
      sku: "AQU001",
      price: 4000,
      buyingPrice: 3200,
      stock: 200,
      category: "Minuman",
      barcode: "8993675123789",
      image: "https://images.unsplash.com/photo-1607000315741-f6be5b2f1c05",
      alt: "Botol air mineral Aqua 600ml dengan label biru dan putih"
    },
    {
      id: "3",
      name: "Teh Botol Sosro 450ml",
      sku: "TBS001",
      price: 5500,
      buyingPrice: 4400,
      stock: 80,
      category: "Minuman",
      barcode: "8992761234567",
      image: "https://images.unsplash.com/photo-1588320051620-2be09d84c8e5",
      alt: "Botol teh Sosro dengan label hijau dan gambar daun teh"
    },
    {
      id: "4",
      name: "Chitato Rasa Sapi Panggang",
      sku: "CHT001",
      price: 8500,
      buyingPrice: 6800,
      stock: 45,
      category: "Snack",
      barcode: "8992388987654",
      image: "https://images.unsplash.com/photo-1717387366887-91dc8b4d3e97",
      alt: "Kemasan keripik Chitato dengan warna merah dan gambar sapi panggang"
    },
    {
      id: "5",
      name: "Beras Premium 5kg",
      sku: "BRS001",
      price: 65000,
      buyingPrice: 52000,
      stock: 25,
      category: "Sembako",
      barcode: "8993456789012",
      image: "https://images.unsplash.com/photo-1591478312602-7b7a1b222ae0",
      alt: "Karung beras premium 5kg dengan label putih dan gambar padi"
    }
  ];

  // Enhanced barcode scanner detection
  useEffect(() => {
    const handleGlobalKeypress = (event: KeyboardEvent) => {
      if (!isBarcodeScannerActive) return;

      const now = Date.now();
      const activeElement = document.activeElement as HTMLElement;
      
      // Skip if user is typing in input fields (unless it's rapid scanning)
      const isInInput = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
      
      // Detect barcode scanner by rapid key sequence (usually < 50ms between chars)
      keySequenceRef.current.push(now);
      if (keySequenceRef.current.length > 10) {
        keySequenceRef.current = keySequenceRef.current.slice(-10);
      }

      const isRapidInput = keySequenceRef.current.length >= 3 && 
        (now - keySequenceRef.current[keySequenceRef.current.length - 3]) < 150;

      if (event.key === 'Enter') {
        // Process barcode if we have accumulated data
        if (scanBufferRef.current.length >= 4) {
          event.preventDefault();
          handleBarcodeScanned(scanBufferRef.current);
          scanBufferRef.current = '';
          keySequenceRef.current = [];
          setLastScanTime(now);
        }
      } else if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
        // Add character to buffer if rapid input or not in input field
        if (isRapidInput || !isInInput) {
          if (isInInput && isRapidInput) {
            event.preventDefault();
            activeElement.blur();
          }
          
          scanBufferRef.current += event.key;
          
          // Clear buffer after timeout
          if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current);
          }
          
          scanTimeoutRef.current = setTimeout(() => {
            scanBufferRef.current = '';
            keySequenceRef.current = [];
          }, 200);
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeypress);
    
    return () => {
      document.removeEventListener('keydown', handleGlobalKeypress);
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, [isBarcodeScannerActive]);

  // Calculate totals with better precision
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const discount = 0; // Can be implemented later
  const tax = Math.round(subtotal * 0.11); // 11% PPN
  const total = subtotal - discount + tax;

  // Show notification helper
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const notification = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-success text-success-foreground' :
                   type === 'error' ? 'bg-destructive text-destructive-foreground' :
                   'bg-primary text-primary-foreground';
    
    notification.className = `fixed top-4 right-4 ${bgClass} px-6 py-3 rounded-lg shadow-elevation-3 z-50 animate-in slide-in-from-right-2`;
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 rounded-full bg-current animate-pulse"></div>
        <span class="font-medium">${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slide-out-to-right-2 0.2s ease-in forwards';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 200);
    }, 3000);
  };

  // Enhanced barcode handling with better feedback
  const handleBarcodeScanned = (barcode: string) => {
    console.log('Barcode scanned:', barcode);
    
    const cleanBarcode = barcode.trim();
    if (cleanBarcode.length === 0) return;
    
    const product = mockProducts.find((p) => 
      p.barcode === cleanBarcode || 
      p.sku.toLowerCase() === cleanBarcode.toLowerCase() ||
      p.barcode?.includes(cleanBarcode)
    );
    
    if (product) {
      if (product.stock === 0) {
        showNotification(`${product.name} - Stok habis!`, 'error');
        return;
      }
      
      handleAddToCart(product);
      showNotification(`✓ ${product.name} ditambahkan`, 'success');
      
      // Play success sound (if available)
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+nwrmcfCv/Q5v/CdCUFIv/Y7/PSlEMJW7Hm6qZTEg1Om+v/pGIfCyfq0v7Ddib/b9er8u1yJQf+8NPw13kjgkF3w+fjrGEfCh3y7fTDedCFUY7j+OGQOCCC8f/zwn7ZsArnnh1QiSiq2vDNeji6vZuXc+diUYAJv8s7MByAAAAA');
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Ignore errors if audio fails
      } catch (e) {
        // Audio not supported, ignore
      }
    } else {
      showNotification(`Produk tidak ditemukan: ${cleanBarcode}`, 'error');
      console.log('Available barcodes:', mockProducts.map(p => p.barcode));
    }
  };

  // Enhanced add to cart with better validation
  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      showNotification(`${product.name} - Stok tidak tersedia!`, 'error');
      return;
    }

    const existingItem = cartItems.find((item) => item.product.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;

    if (currentQuantity >= product.stock) {
      showNotification(`${product.name} - Stok tidak mencukupi (maks: ${product.stock})`, 'error');
      return;
    }

    if (existingItem) {
      setCartItems((items) =>
        items.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.product.price
              }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity: 1,
        subtotal: product.price
      };
      setCartItems((items) => [...items, newItem]);
    }
  };

  // Handle update quantity with validation
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(itemId);
      return;
    }

    const item = cartItems.find(item => item.id === itemId);
    if (item && quantity > item.product.stock) {
      showNotification(`Stok ${item.product.name} tidak mencukupi (maks: ${item.product.stock})`, 'error');
      return;
    }

    setCartItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.product.price
            }
          : item
      )
    );
  };

  // Handle remove item
  const handleRemoveItem = (itemId: string) => {
    setCartItems((items) => items.filter((item) => item.id !== itemId));
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (cartItems.length > 0) {
      setCartItems([]);
      showNotification('Keranjang dikosongkan', 'info');
    }
  };

  // Enhanced payment processing with better validation
  const handleProcessPayment = (paymentData: PaymentState) => {
    if (cartItems.length === 0) {
      showNotification('Keranjang kosong - tambahkan produk terlebih dahulu', 'error');
      return;
    }

    if (!paymentData.method) {
      showNotification('Pilih metode pembayaran terlebih dahulu', 'error');
      return;
    }

    setIsProcessingPayment(true);
    showNotification('Memproses pembayaran...', 'info');

    // Validate payment amount for cash
    if (paymentData.method === 'cash' && paymentData.cashAmount! < total) {
      setIsProcessingPayment(false);
      showNotification('Jumlah uang tunai tidak mencukupi', 'error');
      return;
    }

    // Simulate payment processing with realistic delay
    setTimeout(() => {
      const transaction: Transaction = {
        id: `TXN${Date.now()}`,
        items: cartItems,
        subtotal,
        tax,
        discount,
        total,
        paymentMethod: paymentData.method!,
        cashReceived: paymentData.cashAmount,
        change: paymentData.change,
        timestamp: new Date(),
        cashierName: "Ahmad Rizki" // From login credentials
      };

      setCurrentTransaction(transaction);
      setIsProcessingPayment(false);
      setShowReceipt(true);
      
      // Clear cart after successful payment
      setTimeout(() => {
        setCartItems([]);
      }, 500);
      
      showNotification('✓ Pembayaran berhasil!', 'success');
    }, 2000);
  };

  // Handle QRIS modal
  const handleShowQRIS = () => {
    if (cartItems.length === 0) {
      showNotification('Tambahkan produk ke keranjang terlebih dahulu', 'error');
      return;
    }
    setShowQRISModal(true);
  };

  const handleQRISPaymentConfirmed = () => {
    setShowQRISModal(false);
    const qrisPaymentData: PaymentState = {
      method: 'qris',
      cashAmount: 0,
      change: 0
    };
    handleProcessPayment(qrisPaymentData);
  };

  // Enhanced quick actions
  const quickActions = [
    {
      label: 'Transaksi Baru',
      icon: 'Plus',
      onClick: () => {
        setCartItems([]);
        setCurrentTransaction(null);
        setShowReceipt(false);
        showNotification('Transaksi baru dimulai', 'info');
      },
      variant: 'default' as const,
      shortcut: 'F1'
    },
    {
      label: isBarcodeScannerActive ? 'Scanner: ON' : 'Scanner: OFF',
      icon: 'Scan',
      onClick: () => {
        setIsBarcodeScannerActive(!isBarcodeScannerActive);
        showNotification(
          isBarcodeScannerActive ? 'Scanner barcode dinonaktifkan' : 'Scanner barcode diaktifkan', 
          'info'
        );
      },
      variant: isBarcodeScannerActive ? 'default' : 'outline' as const,
      shortcut: 'F2'
    },
    {
      label: 'Void Transaksi',
      icon: 'X',
      onClick: () => {
        if (cartItems.length > 0) {
          handleClearCart();
        } else {
          showNotification('Keranjang sudah kosong', 'info');
        }
      },
      variant: 'destructive' as const,
      shortcut: 'F9',
      disabled: cartItems.length === 0
    }
  ];


  return (
    <>
      <Helmet>
        <title>POS Kasir - SmartPOS Pro</title>
        <meta name="description" content="Interface kasir untuk memproses transaksi penjualan dengan dukungan scanner barcode dan pembayaran QRIS" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Navigation Sidebar */}
        <NavigationSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />


        {/* Main Content */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
          {/* Header */}
          <header className="bg-card border-b border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <NavigationBreadcrumbs />
                <h1 className="text-2xl font-bold text-foreground mt-2">POS Kasir</h1>
                <p className="text-muted-foreground">Interface kasir untuk transaksi penjualan</p>
              </div>
              <QuickActionToolbar customActions={quickActions} />
            </div>
          </header>

          {/* Main POS Interface */}
          <main className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
              {/* Left Section - Shopping Cart */}
              <div className="lg:col-span-1">
                <ShoppingCart
                  items={cartItems}
                  subtotal={subtotal}
                  tax={tax}
                  discount={discount}
                  total={total}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onClearCart={handleClearCart} />

              </div>

              {/* Middle Section - Product Search */}
              <div className="lg:col-span-1">
                <ProductSearch
                  products={mockProducts}
                  onAddToCart={handleAddToCart}
                  onBarcodeScanned={handleBarcodeScanned} />

              </div>

              {/* Right Section - Payment Panel */}
              <div className="lg:col-span-1">
                <PaymentPanel
                  total={total}
                  onProcessPayment={handleProcessPayment}
                  onShowQRIS={handleShowQRIS}
                  isProcessing={isProcessingPayment}
                  disabled={cartItems.length === 0} />

              </div>
            </div>
          </main>

          {/* Status Bar */}
          <StatusIndicatorBar className="fixed bottom-0 left-0 right-0" />
        </div>

        {/* QRIS Modal */}
        <QRISModal
          isOpen={showQRISModal}
          onClose={() => setShowQRISModal(false)}
          onPaymentConfirmed={handleQRISPaymentConfirmed}
          amount={total}
          transactionId={currentTransaction?.id || `TXN${Date.now()}`} />


        {/* Receipt Modal */}
        {showReceipt && currentTransaction &&
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg shadow-elevation-2 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Struk Pembayaran</h2>
                <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowReceipt(false)}>

                  <Icon name="X" size={20} />
                </Button>
              </div>
              
              <div className="p-4">
                <ReceiptPrint transaction={currentTransaction} />
                
                <div className="flex space-x-3 mt-6">
                  <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowReceipt(false)}>

                    Tutup
                  </Button>
                  <Button
                  variant="default"
                  fullWidth
                  iconName="Plus"
                  onClick={() => {
                    setShowReceipt(false);
                    setCurrentTransaction(null);
                  }}>

                    Transaksi Baru
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </>);

};

export default POSCashierInterface;