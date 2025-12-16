'use client';

import AuthForm from '@/components/AuthPage/AuthForm';
import { useTranslation } from 'react-i18next';
import styles from './page.module.css';

export default function SignUp() {
  const { t } = useTranslation();
  return (
    <>
      <main className={styles.authPage} data-testid="auth-page">
        <div className={styles.formTitle}>
          <h2 data-testid="page-title">{t('createAccount')}</h2>
          <p data-testid="page-description">
            {t('enterEmailPassword') + ' ' + t('toSignUp') + ' ' + t('thisApp')}
          </p>
        </div>
        <AuthForm mode={'signup'} />
      </main>
    </>
  );
}
