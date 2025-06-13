import React, { useState, useEffect } from 'react';
import { Moon, Sun, Save, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { getSettings, updateSettings, toggleDarkMode } from '../../utils/settingsUtils';
import { AppSettings } from '../../types';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [updateInterval, setUpdateInterval] = useState<number>(settings.updateInterval);
  
  useEffect(() => {
    // Initialize state with current settings
    const currentSettings = getSettings();
    setSettings(currentSettings);
    setUpdateInterval(currentSettings.updateInterval);
  }, []);
  
  const handleToggleDarkMode = () => {
    const newSettings = toggleDarkMode();
    setSettings(newSettings);
  };
  
  const handleSaveSettings = () => {
    const newSettings = updateSettings({
      updateInterval,
    });
    
    setSettings(newSettings);
    toast.success('Settings saved successfully');
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Customize your application preferences</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Appearance */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Toggle between light and dark theme
                  </p>
                </div>
                <button
                  onClick={handleToggleDarkMode}
                  className="p-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none transition-colors"
                >
                  {settings.darkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Performance */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Data Update Interval</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Set how frequently the real-time tracker should update (in seconds)
                </p>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="15"
                    value={updateInterval}
                    onChange={(e) => setUpdateInterval(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[60px]">
                    {updateInterval} sec
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
          
          {/* Data Management */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Management</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Local Storage</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  All data is stored locally in your browser. You can reset the application data if needed.
                </p>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 text-sm">
                  <p className="font-medium">Warning</p>
                  <p>Clearing data will remove all agents, reports, and settings. This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all application data? This cannot be undone.')) {
                      localStorage.clear();
                      toast.success('All data has been reset. The page will reload.');
                      setTimeout(() => window.location.reload(), 1500);
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Application Data
                </button>
              </div>
            </div>
          </div>
          
          {/* About */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Agent Performance Tracker</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Version 1.0.0
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  A comprehensive tool for tracking and managing agent performance metrics in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;