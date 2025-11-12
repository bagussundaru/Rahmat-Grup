import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

interface NavigationBreadcrumbsProps {
  customBreadcrumbs?: BreadcrumbItem[];
  className?: string;
}

const NavigationBreadcrumbs = ({ customBreadcrumbs, className = '' }: NavigationBreadcrumbsProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeLabels: Record<string, string> = {
    '/pos-cashier-interface': 'POS Kasir',
    '/product-management': 'Manajemen Produk',
    '/sales-dashboard': 'Dashboard Penjualan',
    '/inventory-reports': 'Laporan Inventori',
    '/transaction-history': 'Riwayat Transaksi'
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', path: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isActive: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleBreadcrumbClick = (path: string, isActive?: boolean) => {
    if (!isActive) {
      navigate(path);
    }
  };

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <Icon name="Home" size={16} className="text-muted-foreground" />
      
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
          )}
          
          <button
            onClick={() => handleBreadcrumbClick(breadcrumb.path, breadcrumb.isActive)}
            className={`
              transition-colors duration-150 hover:text-primary
              ${breadcrumb.isActive 
                ? 'text-foreground font-medium cursor-default' 
                : 'text-muted-foreground hover:text-primary cursor-pointer'
              }
            `}
            disabled={breadcrumb.isActive}
          >
            {breadcrumb.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default NavigationBreadcrumbs;