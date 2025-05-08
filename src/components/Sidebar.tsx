import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PieChart, Receipt, PlusCircle, Settings, LogOut, Wallet } from 'lucide-react';
import classNames from 'classnames';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navLinks = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Beranda' },
    { to: '/transactions', icon: <Receipt size={20} />, label: 'Transaksi' },
    { to: '/analytics', icon: <PieChart size={20} />, label: 'Analisis' },
    { to: '/add', icon: <PlusCircle size={20} />, label: 'Tambah Baru' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Pengaturan' },
  ];

  return (
    <aside
      className={classNames(
        'bg-white dark:bg-neutral-800 shadow-md z-40 h-full transition-all duration-300 flex flex-col',
        {
          'w-64': !isCollapsed,
          'w-16': isCollapsed,
        }
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <Wallet size={18} className="text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg transition-opacity duration-200">
              Keuangan<span className="text-primary-500">AI</span>
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-4">
        <ul className="space-y-1 px-2">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  classNames(
                    'flex items-center px-3 py-2 rounded-md transition-colors duration-200',
                    {
                      'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400': isActive,
                      'hover:bg-neutral-100 dark:hover:bg-neutral-700/50': !isActive,
                      'justify-center': isCollapsed,
                    }
                  )
                }
              >
                <span className="flex-shrink-0">{link.icon}</span>
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-medium">{link.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Toggle button */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        <button
          className="w-full flex items-center justify-center p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isCollapsed ? 'M13 5l7 7-7 7' : 'M11 19l-7-7 7-7'}
            />
          </svg>
          {!isCollapsed && <span className="ml-2 text-sm">Ciutkan</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;