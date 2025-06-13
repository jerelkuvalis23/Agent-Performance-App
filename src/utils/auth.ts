import { User } from '../types';

// Initial admin user
const DEFAULT_ADMIN: User = {
  id: 'admin-default',
  username: 'admin',
  password: 'admin123', // In a real app, this would be hashed
  role: 'admin',
};

// Get users from localStorage
export const getUsers = (): User[] => {
  const usersJSON = localStorage.getItem('users');
  if (!usersJSON) {
    // First time setup - create default admin
    localStorage.setItem('users', JSON.stringify([DEFAULT_ADMIN]));
    return [DEFAULT_ADMIN];
  }
  return JSON.parse(usersJSON);
};

// Save users to localStorage
export const saveUsers = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

// Check if user exists and password is correct
export const authenticateUser = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
  return user || null;
};

// Add a new user (admin only)
export const addUser = (newUser: Omit<User, 'id'>): User => {
  const users = getUsers();
  
  // Check if username already exists (case insensitive)
  if (users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
    throw new Error('Username already exists');
  }
  
  const id = `user-${Date.now()}`;
  const user: User = { ...newUser, id };
  
  users.push(user);
  saveUsers(users);
  return user;
};

// Remove a user (admin only)
export const removeUser = (userId: string): void => {
  let users = getUsers();
  users = users.filter(user => user.id !== userId);
  saveUsers(users);
};

// Change password (admin can change any, users can change their own)
export const changePassword = (userId: string, newPassword: string): void => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex >= 0) {
    users[userIndex].password = newPassword;
    saveUsers(users);
  }
};

// Store current user in sessionStorage
export const setCurrentUser = (user: User): void => {
  // Store minimal user info for session
  const sessionUser = {
    id: user.id,
    username: user.username,
    role: user.role
  };
  sessionStorage.setItem('currentUser', JSON.stringify(sessionUser));
};

// Get current user from sessionStorage
export const getCurrentUser = (): User | null => {
  const userJSON = sessionStorage.getItem('currentUser');
  if (!userJSON) return null;

  // Get full user data from localStorage
  const sessionUser = JSON.parse(userJSON);
  const users = getUsers();
  return users.find(u => u.id === sessionUser.id) || null;
};

// Clear current user from sessionStorage
export const logout = (): void => {
  sessionStorage.removeItem('currentUser');
};

// Check if current user is admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};