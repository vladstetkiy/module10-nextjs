'use client';

import './ProfileInfoAndStatisticPage.css';
import Toggle from '../Toggle/Toggle';
import { useState } from 'react';
import Statistic from '../Statistic/Statistic';
import ProfileInfo from '../ProfileInfo/ProfileInfo';
import { useTranslation } from 'react-i18next';

function ProfileInfoAndStatisticPage() {
  const { t } = useTranslation();
  const [isProfileInfo, setIsProfileInfo] = useState(() => {
    const storedPage = localStorage.getItem('isProfileInfo');
    return storedPage ? JSON.parse(storedPage) : true;
  });

  return (
    <div className="profile-info-and-statistic">
      <Toggle
        visualMode="segment-control"
        className="segment-control"
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
