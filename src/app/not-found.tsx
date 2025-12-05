'use client';

import Error404Svg from '@/components/svg/Error404Svg/Error404Svg';
import styles from './not-found.module.css';
import { useTranslation } from 'react-i18next';
export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className={styles.error404Page}>
      <Error404Svg className={styles.error404Svg} />
      <p>{t('notFound')}</p>
    </div>
  );
}
