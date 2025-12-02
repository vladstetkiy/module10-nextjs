'use client';

import { create } from 'zustand';

import { persist } from 'zustand/middleware';

import { useEffect } from 'react';

interface ThemeStore {
  isDarkMode: boolean;
  themeToggle: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDarkMode: true,
      themeToggle: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'theme-storage',
    },
  ),
);

export const useTheme = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const themeToggle = useThemeStore((state) => state.themeToggle);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [isDarkMode]);

  return { isDarkMode, themeToggle };
};
