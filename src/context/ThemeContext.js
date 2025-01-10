import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext();

const lightTheme = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#000000',
  textSecondary: '#666666',
  accent: '#FF2D55',
  accentLight: 'rgba(255, 45, 85, 0.1)',
  border: '#F0F0F0',
  cardBackground: '#FFFFFF',
  modalBackground: 'rgba(0, 0, 0, 0.5)',
  headerBackground: '#F8F9FA',
};

const darkTheme = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  accent: '#FF375F',
  accentLight: 'rgba(255, 55, 95, 0.15)',
  border: '#2C2C2C',
  cardBackground: '#242424',
  modalBackground: 'rgba(0, 0, 0, 0.7)',
  headerBackground: '#1A1A1A',
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [theme, setTheme] = useState(isDark ? darkTheme : lightTheme);

  const toggleTheme = () => {
    setIsDark(!isDark);
    setTheme(!isDark ? darkTheme : lightTheme);
  };

  useEffect(() => {
    setTheme(isDark ? darkTheme : lightTheme);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 