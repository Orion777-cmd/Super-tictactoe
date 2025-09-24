import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types/theme.type';
import { themes, defaultTheme } from '../data/themes.data';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('game-theme');
    if (savedThemeId && themes[savedThemeId]) {
      setCurrentTheme(themes[savedThemeId]);
    }
  }, []);

  // Apply theme to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    const theme = currentTheme;
    
    // Apply all theme colors as CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Set theme class for additional styling
    root.setAttribute('data-theme', theme.id);
    
    // Determine if theme is dark mode
    const isDark = ['mystic-forest', 'cyberpunk-city', 'ocean-depths', 'night-sky'].includes(theme.id);
    setIsDarkMode(isDark);
    root.setAttribute('data-dark-mode', isDark.toString());
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    if (themes[themeId]) {
      setCurrentTheme(themes[themeId]);
      localStorage.setItem('game-theme', themeId);
    }
  };

  const availableThemes = Object.values(themes);

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    availableThemes,
    isDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
