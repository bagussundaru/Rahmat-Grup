import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RahmatLogo from '../RahmatLogo';
import Icon from './AppIcon';
import UserProfileDropdown from './UserProfileDropdown';

interface NavigationSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  currentUser?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  role?: string[];
  tooltip?: string;
}

const NavigationSidebar = ({ 
  isCollapsed = false, 
  onToggleCollapse,
  currentUser = { name: 'Admin User', role: 'Administrator' }
}: NavigationSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      label: 'POS Kasir',
      path: '/pos-cashier-interface',
      icon: 'CreditCard',
      tooltip: 'Interface kasir untuk transaksi'
    },
    {
      label: 'Manajemen Produk',
      path: '/product-management',
      icon: 'Package',
      tooltip: 'Kelola produk dan inventori'
    },
    {
      label: 'Dashboard Penjualan',
      path: '/sales-dashboard',
      icon: 'BarChart3',
      tooltip: 'Analisis penjualan dan performa'
    },
    {
      label: 'Laporan Inventori',
      path: '/inventory-reports',
      icon: 'FileText',
      tooltip: 'Laporan stok dan inventori'
    },
    {
      label: 'Riwayat Transaksi',
      path: '/transaction-history',
      icon: 'History',
      tooltip: 'Riwayat semua transaksi'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`
      fixed left-0 top-0 h-full bg-card border-r border-border z-100 transition-all duration-300 ease-out
      ${isCollapsed ? 'w-16' : 'w-60'}
    `}>
      <div className="flex flex-col h-full">
        {/* Header with Logo and Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Store" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">SmartPOS</h1>
                <p className="text-xs text-muted-foreground">Pro</p>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <Icon name="Store" size={20} color="white" />
            </div>
          )}
          
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-md hover:bg-muted transition-colors duration-150"
            >
              <Icon 
                name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                size={16} 
                className="text-muted-foreground"
              />
            </button>
          )}
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-border">
          <UserProfileDropdown 
            user={currentUser} 
            isCollapsed={isCollapsed}
            onProfileClick={() => navigate('/profile')}
            onSettingsClick={() => navigate('/settings')}
            onLogout={() => {
              // Handle logout logic here
              console.log('Logout clicked');
            }}
          />
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-4">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left
                    transition-all duration-150 ease-out group relative
                    ${isActiveRoute(item.path)
                      ? 'bg-primary text-primary-foreground shadow-elevation-1'
                      : 'text-foreground hover:bg-muted hover:shadow-elevation-1'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    className={`
                      ${isActiveRoute(item.path) ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                      transition-colors duration-150
                    `}
                  />
                  
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && hoveredItem === item.path && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-elevation-2 whitespace-nowrap z-200">
                      {item.tooltip || item.label}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className={`text-xs text-muted-foreground ${isCollapsed ? 'text-center' : ''}`}>
            {!isCollapsed ? (
              <div>
                <p>SmartPOS Pro v1.0</p>
                <p>© 2024 Retail Solutions</p>
              </div>
            ) : (
              <div className="w-2 h-2 bg-success rounded-full mx-auto" title="System Online" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationSidebar;