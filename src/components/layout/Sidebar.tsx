import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileBarChart, 
  Settings, 
  UserCog,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';
import { getCurrentUser, isAdmin } from '../../utils/auth';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const admin = isAdmin();
  const user = getCurrentUser();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <div 
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } bg-white dark:bg-gray-800 h-screen border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col shadow-sm z-20`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          {!collapsed && (
            <h1 className="ml-2 text-lg font-bold text-gray-800 dark:text-white">APTracker</h1>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`
              }
            >
              <LayoutDashboard className={`${collapsed ? 'mx-auto' : 'mr-3'}`} size={20} />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/agents"
              className={({ isActive }) =>
                `flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`
              }
            >
              <Users className={`${collapsed ? 'mx-auto' : 'mr-3'}`} size={20} />
              {!collapsed && <span>Agents</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`
              }
            >
              <FileBarChart className={`${collapsed ? 'mx-auto' : 'mr-3'}`} size={20} />
              {!collapsed && <span>Reports</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`
              }
            >
              <Settings className={`${collapsed ? 'mx-auto' : 'mr-3'}`} size={20} />
              {!collapsed && <span>Settings</span>}
            </NavLink>
          </li>
          
          {/* Admin only */}
          {admin && (
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`
                }
              >
                <UserCog className={`${collapsed ? 'mx-auto' : 'mr-3'}`} size={20} />
                {!collapsed && <span>User Management</span>}
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      
      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;