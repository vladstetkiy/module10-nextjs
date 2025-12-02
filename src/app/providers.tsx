'use client';

import { MockProvider } from '@/contexts/MockProvider';
import { Provider } from 'react-redux';
import { store } from '@/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MockProvider>
      <Provider store={store}>{children}</Provider>
    </MockProvider>
  );
}
