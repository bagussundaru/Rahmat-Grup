import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ui/ScrollToTop";
import ErrorBoundary from "components/ui/ErrorBoundary";
import NotFound from "pages/NotFound";
import InventoryReports from './pages/inventory-reports';
import TransactionHistoryPage from './pages/transaction-history';
import ProductManagement from './pages/product-management';
import SalesDashboard from './pages/sales-dashboard';
import POSCashierInterface from './pages/pos-cashier-interface';
import SettingsPage from './pages/settings';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your routes here */}
        <Route path="/" element={<POSCashierInterface />} />
        <Route path="/inventory-reports" element={<InventoryReports />} />
        <Route path="/transaction-history" element={<TransactionHistoryPage />} />
        <Route path="/product-management" element={<ProductManagement />} />
        <Route path="/sales-dashboard" element={<SalesDashboard />} />
        <Route path="/pos-cashier-interface" element={<POSCashierInterface />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
