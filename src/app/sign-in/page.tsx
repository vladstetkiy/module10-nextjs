'use client';

import AuthForm from '@/components/AuthPage/AuthForm';
import { useTranslation } from 'react-i18next';
import styles from './page.module.css';

export default function SignIn() {
  const { t } = useTranslation();

  return (
    <>
      <main className={styles.authPage} data-testid="auth-page">
        <div className={styles.formTitle}>
          <h2 className={styles.h2} data-testid="page-title">
            {t('signIn')}
          </h2>
          <p data-testid="page-description">
            {t('enterEmailPassword') + ' ' + t('toSignIn') + ' ' + t('thisApp')}
          </p>
        </div>

        <AuthForm mode={'signin'} />
      </main>
    </>
  );
}
