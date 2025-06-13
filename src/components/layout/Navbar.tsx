import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Moon, Sun, Bell } from 'lucide-react';
import { toast } from 'react-toastify';
import { logout } from '../../utils/auth';
import { getSettings, toggleDarkMode } from '../../utils/settingsUtils';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(getSettings().darkMode);
  
  const handleLogout = () => {
    logout();
    toast.info('You have been logged out');
    navigate('/login');
  };
  
  const handleToggleDarkMode = () => {
    const settings = toggleDarkMode();
    setDarkMode(settings.darkMode);
  };
  
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Agent Performance Tracker</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button 
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            title="Notifications"
          >
            <Bell size={20} />
          </button>
          
          {/* Dark Mode Toggle */}
          <button 
            onClick={handleToggleDarkMode}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;