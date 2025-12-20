'use client';

import { MockProvider } from '@/contexts/MockProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect } from 'react';
import i18n from '@/app/i18next';
import { useThemeStore } from '@/contexts/ThemeContext';
import { NotificationProvider } from '@/contexts/NotificationContext/NotificationContext';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  useEffect(() => {
    const updateHtmlLang = () => {
      document.documentElement.lang = i18n.language;
    };
    updateHtmlLang();
    i18n.on('languageChanged', updateHtmlLang);

    return () => {
      i18n.off('languageChanged', updateHtmlLang);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.querySelector('.theme-wrapper')?.classList.remove('light-theme');
    } else {
      document.querySelector('.theme-wrapper')?.classList.add('light-theme');
    }
  }, [isDarkMode]);

  return (
    <div className="theme-wrapper">
      <QueryClientProvider client={queryClient}>
        <MockProvider>
          <NotificationProvider>
            <Provider store={store}>{children}</Provider>
          </NotificationProvider>
        </MockProvider>
      </QueryClientProvider>
    </div>
  );
}
