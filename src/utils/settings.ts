export interface ReceiptSettings {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  title?: string;
  footer?: string;
  paperWidthMM: 58 | 80;
}

export interface PrinterSettings {
  deviceName: string;
}

export interface ScannerSettings {
  deviceName: string;
  manualModeDefault: boolean;
}

export interface AppSettings {
  receipt: ReceiptSettings;
  printer: PrinterSettings;
  scanner: ScannerSettings;
  taxRate?: number;
  discountPercent?: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  receipt: {
    storeName: 'Kasir Rahmat Grup',
    storeAddress: 'Jl. Raya Bisnis No. 123, Jakarta',
    storePhone: '021-1234-5678',
    title: 'Kasir Rahmat Grup',
    footer: 'Terima kasih atas kunjungan Anda!',
    paperWidthMM: 58,
  },
  printer: {
    deviceName: 'Default Printer',
  },
  scanner: {
    deviceName: 'Generic Scanner',
    manualModeDefault: false,
  },
  taxRate: 0.11,
  discountPercent: 0,
};

const STORAGE_KEY = 'app_settings_v1';

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      receipt: { ...DEFAULT_SETTINGS.receipt, ...(parsed.receipt || {}) },
      printer: { ...DEFAULT_SETTINGS.printer, ...(parsed.printer || {}) },
      scanner: { ...DEFAULT_SETTINGS.scanner, ...(parsed.scanner || {}) },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(delta: Partial<AppSettings>) {
  const current = getSettings();
  const merged: AppSettings = {
    receipt: { ...current.receipt, ...(delta.receipt || {}) },
    printer: { ...current.printer, ...(delta.printer || {}) },
    scanner: { ...current.scanner, ...(delta.scanner || {}) },
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function testPrintSample() {
  const s = getSettings();
  const w = window.open('', '_blank', 'noopener,noreferrer,width=600,height=800');
  if (!w) return;
  const width = `${s.receipt.paperWidthMM}mm`;
  w.document.write(`<!doctype html><html><head><title>Test Print</title>
  <style>@media print { .receipt-print { width: ${width} !important; } }</style>
  </head><body>
  <div class="receipt-print" style="font-family: Arial; font-size: 12px; line-height: 1.4; width: ${width}; margin: 0 auto;">
    <div style="text-align:center; margin-bottom:8px;">
      <div style="font-weight:bold;">${s.receipt.storeName}</div>
      <div>${s.receipt.storeAddress}</div>
      <div>Telp: ${s.receipt.storePhone}</div>
    </div>
    <div style="border-top:1px dashed #000; margin:6px 0;"></div>
    <div>Contoh item</div>
    <div style="display:flex; justify-content:space-between;">
      <span>1 x Produk</span><span>Rp 10.000</span>
    </div>
    <div style="border-top:1px dashed #000; margin:6px 0;"></div>
    <div style="text-align:center; margin-top:6px;">${s.receipt.footer || ''}</div>
  </div>
  <script>window.print(); setTimeout(() => window.close(), 300);</script>
  </body></html>`);
  w.document.close();
}
