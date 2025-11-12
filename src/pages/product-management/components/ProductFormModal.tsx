import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { Product, ProductFormData, ProductCategory, BarcodeInput } from '../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  product?: Product | null;
  categories: ProductCategory[];
  isLoading?: boolean;
}

const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
  isLoading = false
}: ProductFormModalProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    sellingPrice: 0,
    buyingPrice: 0,
    currentStock: 0,
    category: '',
    barcode: '',
    image: '',
    alt: '',
    description: '',
    minStock: 10,
    isActive: true
  });

  const [errors, setErrors] = useState<Partial<ProductFormData>>({});
  const [barcodeInput, setBarcodeInput] = useState<BarcodeInput>({ value: '', timestamp: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const barcodeTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        sellingPrice: product.sellingPrice,
        buyingPrice: product.buyingPrice,
        currentStock: product.currentStock,
        category: product.category,
        barcode: product.barcode || '',
        image: product.image || '',
        alt: product.alt || '',
        description: product.description || '',
        minStock: product.minStock || 10,
        isActive: product.isActive
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        sellingPrice: 0,
        buyingPrice: 0,
        currentStock: 0,
        category: '',
        barcode: '',
        image: '',
        alt: '',
        description: '',
        minStock: 10,
        isActive: true
      });
    }
    setErrors({});
  }, [product, isOpen]);

  // Barcode scanner integration
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement && e.target.type !== 'text') return;
      
      const now = Date.now();
      const char = e.key;
      
      if (char === 'Enter' && barcodeInput.value.length > 8) {
        setFormData(prev => ({
          ...prev,
          barcode: barcodeInput.value,
          sku: barcodeInput.value
        }));
        setBarcodeInput({ value: '', timestamp: 0 });
        setIsScanning(false);
        return;
      }
      
      if (char.length === 1 && /[0-9]/.test(char)) {
        if (now - barcodeInput.timestamp > 100) {
          setBarcodeInput({ value: char, timestamp: now });
          setIsScanning(true);
        } else {
          setBarcodeInput(prev => ({ value: prev.value + char, timestamp: now }));
        }
        
        clearTimeout(barcodeTimeoutRef.current);
        barcodeTimeoutRef.current = setTimeout(() => {
          setIsScanning(false);
        }, 1000);
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      clearTimeout(barcodeTimeoutRef.current);
    };
  }, [isOpen, barcodeInput]);

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name
  }));

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Nama produk wajib diisi';
    if (!formData.sku.trim()) newErrors.sku = 'SKU wajib diisi';
    if (formData.sellingPrice <= 0) newErrors.sellingPrice = 'Harga jual harus lebih dari 0';
    if (formData.buyingPrice <= 0) newErrors.buyingPrice = 'Harga beli harus lebih dari 0';
    if (formData.currentStock < 0) newErrors.currentStock = 'Stok tidak boleh negatif';
    if (!formData.category) newErrors.category = 'Kategori wajib dipilih';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          image: imageUrl,
          alt: `Gambar produk ${formData.name || 'baru'}`
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {product ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Barcode Scanner Status */}
          {isScanning && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center space-x-2">
              <Icon name="Scan" size={16} className="text-primary animate-pulse" />
              <span className="text-sm text-primary">
                Scanning barcode: {barcodeInput.value}
              </span>
            </div>
          )}

          {/* Product Image */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Gambar Produk</label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-lg border border-border overflow-hidden bg-muted">
                {formData.image ? (
                  <Image
                    src={formData.image}
                    alt={formData.alt || `Gambar produk ${formData.name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon name="Image" size={24} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span className="cursor-pointer">
                      <Icon name="Upload" size={16} className="mr-2" />
                      Upload Gambar
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nama Produk"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              required
              placeholder="Masukkan nama produk"
            />

            <Input
              label="SKU"
              type="text"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              error={errors.sku}
              required
              placeholder="Masukkan SKU produk"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Barcode"
              type="text"
              value={formData.barcode}
              onChange={(e) => handleInputChange('barcode', e.target.value)}
              placeholder="Scan atau masukkan barcode"
              description="Gunakan scanner barcode atau ketik manual"
            />

            <Select
              label="Kategori"
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => handleInputChange('category', value)}
              error={errors.category}
              required
              placeholder="Pilih kategori"
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Harga Beli"
              type="number"
              value={formData.buyingPrice}
              onChange={(e) => handleInputChange('buyingPrice', Number(e.target.value))}
              error={errors.buyingPrice}
              required
              placeholder="0"
              description="Harga pembelian dari supplier"
            />

            <Input
              label="Harga Jual"
              type="number"
              value={formData.sellingPrice}
              onChange={(e) => handleInputChange('sellingPrice', Number(e.target.value))}
              error={errors.sellingPrice}
              required
              placeholder="0"
              description="Harga jual ke pelanggan"
            />
          </div>

          {/* Stock Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Stok Saat Ini"
              type="number"
              value={formData.currentStock}
              onChange={(e) => handleInputChange('currentStock', Number(e.target.value))}
              error={errors.currentStock}
              required
              placeholder="0"
              description="Jumlah stok yang tersedia"
            />

            <Input
              label="Minimum Stok"
              type="number"
              value={formData.minStock}
              onChange={(e) => handleInputChange('minStock', Number(e.target.value))}
              placeholder="10"
              description="Batas minimum untuk peringatan stok"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Deskripsi Produk
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Masukkan deskripsi produk (opsional)"
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <Checkbox
              label="Produk Aktif"
              description="Produk akan ditampilkan di sistem POS"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" loading={isLoading}>
              {product ? 'Update Produk' : 'Tambah Produk'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;