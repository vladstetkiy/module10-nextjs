'use client';

import styles from './layout.module.css';
import Toggle from '@/components/Toggle/Toggle';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const isOn = pathname == '/profile/edit';

  const handleToggleClick = () => {
    if (pathname == '/profile/edit') {
      router.push('/profile/statistic');
    } else {
      router.push('/profile/edit');
    }
  };

  return (
    <div className={styles.profileInfoAndStatistic}>
      <Toggle
        visualMode="segment-control"
        className={styles.segmentControl}
        onToggle={handleToggleClick}
        isOnSegment={isOn}
        firstOption={t('profileLink')}
        secondOption={t('statsLink')}
      />
      {children}
    </div>
  );
}
