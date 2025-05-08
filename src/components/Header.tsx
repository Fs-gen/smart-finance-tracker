import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Search, Bell, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const Header: React.FC = () => {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Get page title based on current route
  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'Beranda';
      case '/transactions':
        return 'Transaksi';
      case '/analytics':
        return 'Analisis';
      case '/add':
        return 'Tambah Transaksi';
      case '/settings':
        return 'Pengaturan';
      default:
        return 'Keuangan Pintar';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-neutral-800 shadow-sm backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <div className="container-app">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - Mobile menu button and title */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="md:hidden btn btn-outline p-2"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            >
              <Menu size={20} />
              <span className="sr-only">Buka menu</span>
            </button>
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center gap-2">
            {/* Search button/form */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="absolute right-0 top-0 flex items-center animate-fade-in">
                  <input
                    type="text"
                    placeholder="Cari transaksi..."
                    className="input-field w-64"
                    autoFocus
                  />
                  <button
                    className="absolute right-2 btn p-1"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-outline p-2"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search size={20} />
                  <span className="sr-only">Cari</span>
                </button>
              )}
            </div>

            {/* Theme toggle */}
            <button
              className="btn btn-outline p-2"
              onClick={toggleTheme}
              aria-label={`Beralih ke mode ${theme === 'light' ? 'gelap' : 'terang'}`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Notifications */}
            <button className="btn btn-outline p-2 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent-500"></span>
              <span className="sr-only">Notifikasi</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;