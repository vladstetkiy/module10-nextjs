'use client';

import { MockProvider } from '@/contexts/MockProvider';
import { QueryClientProvider, queryClient } from '../utils/libApi';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect } from 'react';
import i18n from '@/app/i18next';
import { useTheme } from '@/contexts/ThemeContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  useTheme();
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

  return (
    <div className="theme-wrapper">
      <QueryClientProvider client={queryClient}>
        <MockProvider>
          <Provider store={store}>{children}</Provider>
        </MockProvider>
      </QueryClientProvider>
    </div>
  );
}
