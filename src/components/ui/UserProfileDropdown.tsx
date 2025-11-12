import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Image from '../AppImage';

interface User {
  name: string;
  role: string;
  avatar?: string;
}

interface UserProfileDropdownProps {
  user: User;
  isCollapsed?: boolean;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

const UserProfileDropdown = ({ 
  user, 
  isCollapsed = false,
  onProfileClick,
  onSettingsClick,
  onLogout
}: UserProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    onProfileClick?.();
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    onSettingsClick?.();
    setIsOpen(false);
  };

  const handleLogout = () => {
    onLogout?.();
    setIsOpen(false);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'administrator': case'admin':
        return 'text-primary';
      case 'manager':
        return 'text-accent';
      case 'cashier': case'kasir':
        return 'text-secondary';
      default:
        return 'text-muted-foreground';
    }
  };

  if (isCollapsed) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 transition-colors duration-150 flex items-center justify-center mx-auto"
        >
          {user.avatar ? (
            <Image 
              src={user.avatar} 
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <Icon name="User" size={16} className="text-muted-foreground" />
          )}
        </button>

        {isOpen && (
          <div className="absolute left-full ml-2 top-0 w-48 bg-popover border border-border rounded-lg shadow-elevation-2 py-2 z-200 animate-fade-in">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium text-popover-foreground">{user.name}</p>
              <p className={`text-xs ${getRoleColor(user.role)}`}>{user.role}</p>
            </div>
            
            <div className="py-1">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
              >
                <Icon name="User" size={16} />
                <span>Profil</span>
              </button>
              
              <button
                onClick={handleSettingsClick}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
              >
                <Icon name="Settings" size={16} />
                <span>Pengaturan</span>
              </button>
              
              <hr className="my-1 border-border" />
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-150"
              >
                <Icon name="LogOut" size={16} />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors duration-150 group"
      >
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          {user.avatar ? (
            <Image 
              src={user.avatar} 
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <Icon name="User" size={16} className="text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-foreground">{user.name}</p>
          <p className={`text-xs ${getRoleColor(user.role)}`}>{user.role}</p>
        </div>
        
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-muted-foreground transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-popover border border-border rounded-lg shadow-elevation-2 py-2 z-200 animate-fade-in">
          <button
            onClick={handleProfileClick}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
          >
            <Icon name="User" size={16} />
            <span>Profil Saya</span>
          </button>
          
          <button
            onClick={handleSettingsClick}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
          >
            <Icon name="Settings" size={16} />
            <span>Pengaturan</span>
          </button>
          
          <hr className="my-1 border-border" />
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-150"
          >
            <Icon name="LogOut" size={16} />
            <span>Keluar</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;