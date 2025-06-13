import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import { authenticateUser, getCurrentUser, setCurrentUser } from '../../utils/auth';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if user is already logged in
    const user = getCurrentUser();
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const user = authenticateUser(username, password);
      if (user) {
        setCurrentUser(user);
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid username or password');
      }
      setIsLoading(false);
    }, 500); // Small delay for better UX
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-soft animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
            <Shield className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Agent Performance Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to access your dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-3 
                           bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 
                           dark:text-white"
                placeholder="Enter your username"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-3 
                          bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 
                          dark:text-white"
                placeholder="Enter your password"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm 
                        font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none 
                        focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors
                        disabled:bg-primary-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-sm text-center mt-4">
            <p className="text-gray-500 dark:text-gray-400">
              Default credentials: admin / admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;