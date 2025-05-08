import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Download, Upload, AlertTriangle, CheckCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [exportSuccess, setExportSuccess] = useState<boolean | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean | null>(null);
  
  const exportData = () => {
    try {
      // Get all transaction data from localStorage
      const data = localStorage.getItem('transactions-storage');
      
      if (!data) {
        setExportSuccess(false);
        return;
      }
      
      // Create a Blob and download link
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `finance-tracker-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportSuccess(false);
      setTimeout(() => setExportSuccess(null), 3000);
    }
  };
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          // Validate JSON format
          JSON.parse(content);
          // Store in localStorage
          localStorage.setItem('transactions-storage', content);
          setImportSuccess(true);
          setTimeout(() => {
            setImportSuccess(null);
            // Reload the page to refresh data
            window.location.reload();
          }, 3000);
        } catch (error) {
          console.error('Import parsing failed:', error);
          setImportSuccess(false);
          setTimeout(() => setImportSuccess(null), 3000);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Import failed:', error);
      setImportSuccess(false);
      setTimeout(() => setImportSuccess(null), 3000);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      {/* Theme Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dark Mode</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Toggle between light and dark themes</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <div className="w-11 h-6 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 dark:peer-focus:ring-primary-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
          </label>
        </div>
      </div>
      
      {/* Data Management */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Data Management</h3>
        
        {/* Export Data */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Download all your transactions as a JSON file
              </p>
            </div>
            <button
              className="btn btn-outline"
              onClick={exportData}
            >
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
          
          {exportSuccess !== null && (
            <div className={`p-3 rounded-md ${
              exportSuccess 
                ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                : 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
            } animate-fade-in`}>
              <div className="flex items-center gap-2">
                {exportSuccess 
                  ? <CheckCircle size={18} /> 
                  : <AlertTriangle size={18} />}
                <span>
                  {exportSuccess 
                    ? 'Data exported successfully!' 
                    : 'Failed to export data. Please try again.'}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Import Data */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium">Import Data</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Restore your transactions from a backup file
              </p>
            </div>
            <label className="btn btn-outline">
              <Upload size={18} />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
            </label>
          </div>
          
          {importSuccess !== null && (
            <div className={`p-3 rounded-md ${
              importSuccess 
                ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                : 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
            } animate-fade-in`}>
              <div className="flex items-center gap-2">
                {importSuccess 
                  ? <CheckCircle size={18} /> 
                  : <AlertTriangle size={18} />}
                <span>
                  {importSuccess 
                    ? 'Data imported successfully! Refreshing...' 
                    : 'Failed to import data. Please check your file and try again.'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* About */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-3">About</h3>
        <p className="text-neutral-600 dark:text-neutral-300 mb-2">
          Finance<span className="text-primary-500">AI</span> - Smart Finance Tracker with AI
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
};

export default Settings;