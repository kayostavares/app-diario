import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@diario_app:theme_preference';

export const lightTheme = {
  isDark: false,
  background: '#f8f9fa',
  cardBg: '#ffffff',
  headerBg: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#e2e8f0',
  inputBg: '#f8f9fa',
  primary: '#2f6fed',
  chipBg: '#edf2f7',
  chipText: '#4a5568',
  statusBar: 'dark-content',
  statusBg: '#ffffff',
  dangerBg: '#ffebee',
  dangerText: '#ff5252',
};

export const darkTheme = {
  isDark: true,
  background: '#121212',
  cardBg: '#1e1e1e',
  headerBg: '#1a1a1a',
  text: '#f1f1f1',
  textSecondary: '#a0a0a0',
  border: '#2d2d2d',
  inputBg: '#2a2a2a',
  primary: '#3b82f6',
  chipBg: '#2a2a2a',
  chipText: '#cbd5e0',
  statusBar: 'light-content',
  statusBg: '#1a1a1a',
  dangerBg: '#3b1d1d',
  dangerText: '#ff6b6b',
};

const ThemeContext = createContext({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved !== null) {
        setIsDark(JSON.parse(saved));
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const nextState = !isDark;
    setIsDark(nextState);
    await AsyncStorage.setItem(THEME_KEY, JSON.stringify(nextState));
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);