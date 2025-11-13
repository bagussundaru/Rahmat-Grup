import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings, testPrintSample } from '../../utils/settings';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import StatusIndicatorBar from '../../components/ui/StatusIndicatorBar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from 'components/ui/AppIcon';

const SettingsPage: React.FC = () => {
  const [receiptTitle, setReceiptTitle] = useState('');
  const [receiptFooter, setReceiptFooter] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [paperWidth, setPaperWidth] = useState<58 | 80>(58);
  const [printerDevice, setPrinterDevice] = useState('');
  const [barcodeDevice, setBarcodeDevice] = useState('');
  const [manualScanDefault, setManualScanDefault] = useState(false);
  const [taxRate, setTaxRate] = useState<number>(0.11);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  useEffect(() => {
    const s = getSettings();
    setReceiptTitle(s.receipt.title || s.receipt.storeName);
    setReceiptFooter(s.receipt.footer || '');
    setStoreName(s.receipt.storeName);
    setStoreAddress(s.receipt.storeAddress);
    setStorePhone(s.receipt.storePhone);
    setPaperWidth(s.receipt.paperWidthMM);
    setPrinterDevice(s.printer.deviceName);
    setBarcodeDevice(s.scanner.deviceName);
    setManualScanDefault(s.scanner.manualModeDefault);
    setTaxRate(s.taxRate ?? 0.11);
    setDiscountPercent(s.discountPercent ?? 0);
  }, []);

  const handleSave = () => {
    saveSettings({
      receipt: {
        title: receiptTitle,
        footer: receiptFooter,
        storeName,
        storeAddress,
        storePhone,
        paperWidthMM: paperWidth,
      },
      printer: { deviceName: printerDevice },
      scanner: { deviceName: barcodeDevice, manualModeDefault: manualScanDefault },
      taxRate,
      discountPercent,
    });
    alert('Pengaturan disimpan');
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar />
      <div className="transition-all duration-300 ml-60">
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <NavigationBreadcrumbs customBreadcrumbs={[{ label: 'Beranda', path: '/' }, { label: 'Pengaturan', path: '/settings', isActive: true }]} />
              <h1 className="text-2xl font-bold text-foreground mt-2">Pengaturan</h1>
              <p className="text-muted-foreground">Edit tampilan nota, printer, dan alat barcode</p>
            </div>
          </div>
        </header>

        <main className="p-4 space-y-6">
          <section className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Receipt" size={18} className="text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Pengaturan Nota</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Judul Nota" value={receiptTitle} onChange={(e) => setReceiptTitle(e.target.value)} />
              <Input label="Footer Nota" value={receiptFooter} onChange={(e) => setReceiptFooter(e.target.value)} />
              <Input label="Nama Toko" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
              <Input label="Alamat Toko" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} />
              <Input label="Telepon Toko" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} />
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Lebar Kertas</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={paperWidth} onChange={(e) => setPaperWidth(Number(e.target.value) as 58 | 80)}>
                  <option value={58}>58mm</option>
                  <option value={80}>80mm</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Printer" size={18} className="text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Pengaturan Printer</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Perangkat Printer" value={printerDevice} onChange={(e) => setPrinterDevice(e.target.value)} />
              <Button variant="outline" iconName="Printer" onClick={() => testPrintSample()}>Tes Cetak</Button>
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Scan" size={18} className="text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Pengaturan Alat Barcode</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Perangkat Scanner" value={barcodeDevice} onChange={(e) => setBarcodeDevice(e.target.value)} />
              <Button variant="outline" iconName="Scan" onClick={() => alert('Tes scan dijalankan (simulasi)')}>Tes Scan</Button>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="manual-scan" checked={manualScanDefault} onChange={(e) => setManualScanDefault(e.target.checked)} />
                <label htmlFor="manual-scan" className="text-sm text-foreground">Default ke mode manual scan</label>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Percent" size={18} className="text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Pengaturan Pajak & Diskon</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Pajak (%)" type="number" value={String(taxRate * 100)} onChange={(e) => setTaxRate((parseFloat(e.target.value) || 0)/100)} />
              <Input label="Diskon (%)" type="number" value={String(discountPercent)} onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)} />
            </div>
          </section>

          <div className="flex justify-end">
            <Button variant="default" iconName="Save" onClick={handleSave}>Simpan Pengaturan</Button>
          </div>
        </main>

        <StatusIndicatorBar />
      </div>
    </div>
  );
};

export default SettingsPage;
