'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { IS_STATIC_EXPORT } from '@/utils/config';

export const MockProvider = ({ children }: PropsWithChildren) => {
  const [mockingEnabled, enableMocking] = useState(false);

  useEffect(() => {
    const enableApiMocking = async () => {
      const shouldEnableMocking = typeof window !== 'undefined';

      if (shouldEnableMocking) {
        const { startMockingSocial } = await import('@sidekick-monorepo/internship-backend');
        if (IS_STATIC_EXPORT) {
          await startMockingSocial('/module10-nextjs');
        } else {
          await startMockingSocial();
        }

        enableMocking(true);
      }
    };

    enableApiMocking();
  }, []);

  if (!mockingEnabled) {
    return null;
  }

  return <>{children}</>;
};
