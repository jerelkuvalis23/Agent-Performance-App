import { AppSettings } from '../types';

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  updateInterval: 60, // 60 seconds = 1 minute
  theme: {
    primary: '#2563EB', // Blue
    secondary: '#0D9488', // Teal
  },
};

// Get settings from localStorage
export const getSettings = (): AppSettings => {
  const settingsJSON = localStorage.getItem('appSettings');
  return settingsJSON ? JSON.parse(settingsJSON) : DEFAULT_SETTINGS;
};

// Save settings to localStorage
export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem('appSettings', JSON.stringify(settings));
};

// Toggle dark mode
export const toggleDarkMode = (): AppSettings => {
  const settings = getSettings();
  settings.darkMode = !settings.darkMode;
  
  // Apply dark mode to document
  if (settings.darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  saveSettings(settings);
  return settings;
};

// Update settings
export const updateSettings = (newSettings: Partial<AppSettings>): AppSettings => {
  const settings = getSettings();
  const updatedSettings = { ...settings, ...newSettings };
  saveSettings(updatedSettings);
  return updatedSettings;
};

// Initialize settings on app load
export const initializeSettings = (): void => {
  const settings = getSettings();
  
  // Apply dark mode if enabled
  if (settings.darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};