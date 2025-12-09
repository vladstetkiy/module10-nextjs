'use client';

import styles from './page.module.css';
import Toggle from '@/components/Toggle/Toggle';
import { useState } from 'react';
import Statistic from '@/components/Statistic/Statistic';
import ProfileInfo from '@/components/ProfileInfo/ProfileInfo';
import { useTranslation } from 'react-i18next';

function ProfileInfoAndStatisticPage() {
  const { t } = useTranslation();
  const [isProfileInfo, setIsProfileInfo] = useState(() => {
    const storedPage = localStorage.getItem('isProfileInfo');
    return storedPage ? JSON.parse(storedPage) : true;
  });

  return (
    <div className={styles.profileInfoAndStatistic}>
      <Toggle
        visualMode="segment-control"
        className={styles.segmentControl}
        onToggle={() =>
          setIsProfileInfo((prev: boolean) => {
            localStorage.setItem('isProfileInfo', JSON.stringify(!prev));
            return !prev;
          })
        }
        isOn={isProfileInfo}
        firstOption={t('profileLink')}
        secondOption={t('statsLink')}
      />
      {isProfileInfo ? <ProfileInfo /> : <Statistic />}
    </div>
  );
}

export default ProfileInfoAndStatisticPage;
