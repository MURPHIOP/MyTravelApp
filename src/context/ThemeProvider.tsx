'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTrip } from '@/context/TripContext';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  accentColor: string;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  isDark: true,
  accentColor: '#2563EB',
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const { activeTrip } = useTrip();

  const accentColor = activeTrip?.accent_color || '#2563EB';

  useEffect(() => {
    const saved = localStorage.getItem('travel-theme') as Theme | null;
    const initial: Theme = saved ?? 'dark';
    setTimeout(() => setTheme(initial), 0);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  // Dynamically inject active trip theme CSS variables
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--accent', accentColor);
      root.style.setProperty('--accent-light', `${accentColor}1A`);
      root.style.setProperty('--accent-glow', `${accentColor}4D`);
    }
  }, [accentColor]);

  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('travel-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark', accentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
