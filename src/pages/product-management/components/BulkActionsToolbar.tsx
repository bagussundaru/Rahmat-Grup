import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { BulkAction, ProductCategory } from '../types';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onBulkAction: (action: string, data?: any) => void;
  categories: ProductCategory[];
  onClearSelection: () => void;
}

const BulkActionsToolbar = ({
  selectedCount,
  onBulkAction,
  categories,
  onClearSelection
}: BulkActionsToolbarProps) => {
  const [showPriceUpdate, setShowPriceUpdate] = useState(false);
  const [showCategoryChange, setShowCategoryChange] = useState(false);
  const [showStockAdjustment, setShowStockAdjustment] = useState(false);
  const [priceData, setPriceData] = useState({ type: 'percentage', value: 0 });
  const [newCategory, setNewCategory] = useState('');
  const [stockData, setStockData] = useState({ type: 'add', value: 0 });

  const bulkActions: BulkAction[] = [
    { type: 'price-update', label: 'Update Harga', icon: 'DollarSign' },
    { type: 'category-change', label: 'Ubah Kategori', icon: 'Tag' },
    { type: 'stock-adjustment', label: 'Sesuaikan Stok', icon: 'Package' },
    { type: 'delete', label: 'Hapus Produk', icon: 'Trash2' }
  ];

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name
  }));

  const priceUpdateOptions = [
    { value: 'percentage', label: 'Persentase (%)' },
    { value: 'fixed', label: 'Nilai Tetap (Rp)' }
  ];

  const stockAdjustmentOptions = [
    { value: 'add', label: 'Tambah Stok' },
    { value: 'subtract', label: 'Kurangi Stok' },
    { value: 'set', label: 'Set Stok' }
  ];

  const handleBulkActionClick = (action: BulkAction) => {
    switch (action.type) {
      case 'price-update':
        setShowPriceUpdate(true);
        break;
      case 'category-change':
        setShowCategoryChange(true);
        break;
      case 'stock-adjustment':
        setShowStockAdjustment(true);
        break;
      case 'delete':
        if (confirm(`Apakah Anda yakin ingin menghapus ${selectedCount} produk yang dipilih?`)) {
          onBulkAction('delete');
        }
        break;
    }
  };

  const handlePriceUpdate = () => {
    onBulkAction('price-update', priceData);
    setShowPriceUpdate(false);
    setPriceData({ type: 'percentage', value: 0 });
  };

  const handleCategoryChange = () => {
    if (newCategory) {
      onBulkAction('category-change', { categoryId: newCategory });
      setShowCategoryChange(false);
      setNewCategory('');
    }
  };

  const handleStockAdjustment = () => {
    onBulkAction('stock-adjustment', stockData);
    setShowStockAdjustment(false);
    setStockData({ type: 'add', value: 0 });
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="CheckSquare" size={20} className="text-primary" />
              <span className="font-medium text-primary">
                {selectedCount} produk dipilih
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {bulkActions.map((action) => (
                <Button
                  key={action.type}
                  variant={action.type === 'delete' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => handleBulkActionClick(action)}
                  iconName={action.icon}
                  iconPosition="left"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
          >
            Batal Pilihan
          </Button>
        </div>
      </div>

      {/* Price Update Modal */}
      {showPriceUpdate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Update Harga</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPriceUpdate(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              <Select
                label="Jenis Update"
                options={priceUpdateOptions}
                value={priceData.type}
                onChange={(value) => setPriceData(prev => ({ ...prev, type: value as string }))}
              />

              <Input
                label={priceData.type === 'percentage' ? 'Persentase (%)' : 'Nilai (Rp)'}
                type="number"
                value={priceData.value}
                onChange={(e) => setPriceData(prev => ({ ...prev, value: Number(e.target.value) }))}
                placeholder="0"
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowPriceUpdate(false)}
                >
                  Batal
                </Button>
                <Button onClick={handlePriceUpdate}>
                  Update Harga
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Change Modal */}
      {showCategoryChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Ubah Kategori</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCategoryChange(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              <Select
                label="Kategori Baru"
                options={categoryOptions}
                value={newCategory}
                onChange={(value) => setNewCategory(value as string)}
                placeholder="Pilih kategori"
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCategoryChange(false)}
                >
                  Batal
                </Button>
                <Button onClick={handleCategoryChange} disabled={!newCategory}>
                  Ubah Kategori
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showStockAdjustment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Sesuaikan Stok</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowStockAdjustment(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              <Select
                label="Jenis Penyesuaian"
                options={stockAdjustmentOptions}
                value={stockData.type}
                onChange={(value) => setStockData(prev => ({ ...prev, type: value as string }))}
              />

              <Input
                label="Jumlah"
                type="number"
                value={stockData.value}
                onChange={(e) => setStockData(prev => ({ ...prev, value: Number(e.target.value) }))}
                placeholder="0"
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowStockAdjustment(false)}
                >
                  Batal
                </Button>
                <Button onClick={handleStockAdjustment}>
                  Sesuaikan Stok
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsToolbar;