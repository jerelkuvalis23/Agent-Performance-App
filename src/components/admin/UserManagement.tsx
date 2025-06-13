import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Shield, 
  Eye 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  getUsers, 
  addUser, 
  removeUser, 
  changePassword 
} from '../../utils/auth';
import { User } from '../../types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // New user form state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'viewer'>('viewer');
  
  // Change password form state
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = () => {
    const allUsers = getUsers();
    setUsers(allUsers);
  };
  
  const handleAddUser = () => {
    if (!newUsername || !newPassword) {
      toast.error('Username and password are required');
      return;
    }
    
    // Check if username already exists
    if (users.some(user => user.username === newUsername)) {
      toast.error('Username already exists');
      return;
    }
    
    addUser({
      username: newUsername,
      password: newPassword,
      role: newRole,
    });
    
    toast.success('User added successfully');
    setShowAddModal(false);
    setNewUsername('');
    setNewPassword('');
    setNewRole('viewer');
    loadUsers();
  };
  
  const handleRemoveUser = (id: string) => {
    // Prevent removing the last admin
    const admins = users.filter(user => user.role === 'admin');
    const userToDelete = users.find(user => user.id === id);
    
    if (admins.length === 1 && userToDelete?.role === 'admin') {
      toast.error('Cannot delete the last admin user');
      return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
      removeUser(id);
      toast.success('User deleted successfully');
      loadUsers();
    }
  };
  
  const handleChangePassword = () => {
    if (!editingUser) return;
    
    if (!newPasswordValue || !confirmPasswordValue) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (newPasswordValue !== confirmPasswordValue) {
      toast.error('Passwords do not match');
      return;
    }
    
    changePassword(editingUser.id, newPasswordValue);
    toast.success('Password changed successfully');
    setShowPasswordModal(false);
    setNewPasswordValue('');
    setConfirmPasswordValue('');
    setEditingUser(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">User Management</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage users and their access permissions</p>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent 
                      rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {user.role === 'admin' ? (
                        <><Shield className="w-3 h-3 mr-1" /> Admin</>
                      ) : (
                        <><Eye className="w-3 h-3 mr-1" /> Viewer</>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setShowPasswordModal(true);
                      }}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs 
                                font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700
                                dark:text-gray-300 dark:hover:bg-gray-600 focus:outline-none"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Change Password
                    </button>
                    
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs 
                                font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/30
                                dark:text-red-400 dark:hover:bg-red-900/50 focus:outline-none"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">No users found</p>
                    <p className="text-sm">Add users to manage access to the application</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New User</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter username"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter password"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'admin' | 'viewer')}
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Admins can manage users and perform all actions. Viewers have read-only access.
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm 
                          font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 
                          dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddUser}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                          bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                          focus:ring-primary-500"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Change Password Modal */}
      {showPasswordModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setEditingUser(null);
                }}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-400">
                Changing password for <span className="font-semibold">{editingUser.username}</span>
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter new password"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPasswordValue}
                  onChange={(e) => setConfirmPasswordValue(e.target.value)}
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm 
                          font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 
                          dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleChangePassword}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                          bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                          focus:ring-primary-500"
              >
                <Save className="h-4 w-4 mr-2 inline" />
                Save Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;