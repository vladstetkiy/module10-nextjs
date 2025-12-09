'use client';

import styles from './AuthForm.module.css';
import { useState, type FormEvent } from 'react';
import { useFormik } from 'formik';
import Input from '../Input/Input';
import EyeSvg from '../svg/EyeSvg/EyeSvg';
import MailSvg from '../svg/MailSvg/MailSvg';
import Button from '../Button/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/contexts/NotificationContext/NotificationContext';
import { useTranslation } from 'react-i18next';

type mode = 'signin' | 'signup';

interface AuthPagePropsInterface {
  mode: mode;
}

interface FormValues {
  email: string;
  password: string;
}

function AuthForm({ mode }: AuthPagePropsInterface) {
  const { showNotification } = useNotification();
  const { logIn, logUp } = useAuth();
  const [logInResult, setLogInResult] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors: Partial<FormValues> = {};

      if (!values.email.trim()) {
        errors.email = t('inputEmail');
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(values.email)) {
          errors.email = t('invalidEmail');
        }
      }

      if (!values.password.trim()) {
        errors.password = t('inputPassword');
      } else if (values.password.length < 6) {
        errors.password = t('passwordTooShort');
      }

      return errors;
    },
    onSubmit: async (values) => {
      if (mode === 'signin') {
        const result = await logIn(values.email, values.password).unwrap();
        if (result) {
          showNotification(t('signInSuccess'), 5000);
          router.push('/');
        } else {
          setLogInResult(true);
        }
      } else {
        const result = await logUp(values.email, values.password).unwrap();
        if (result) {
          showNotification(t('signUpSuccess'), 5000);
          router.push('/');
        }
      }
    },
  });

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('email', e.target.value);
    if (formik.errors.email) {
      formik.setFieldError('email', '');
    }
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('password', e.target.value);
    if (formik.errors.password) {
      formik.setFieldError('password', '');
    }
  };

  const handleBlur = (field: keyof FormValues) => {
    formik.setFieldTouched(field, true);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formik.setTouched({
      email: true,
      password: true,
    });
    formik.handleSubmit();
  };

  const resetForm = () => {
    formik.resetForm();
    setLogInResult(false);
  };

  return (
    <form className={styles.authForm} onSubmit={handleSubmit} data-testid="auth-form">
      <div className={styles.inputWrapper}>
        <Input
          wrapperClassName={styles.emailInputWrapper}
          inputClassName={styles.emailInput}
          placeholder={t('emailPlaceholder')}
          value={formik.values.email}
          onChange={handleEmailInputChange}
          onBlur={() => handleBlur('email')}
          svgIconComponent={<MailSvg />}
          title={t('email')}
          dataTestId="email-input"
        />
        {formik.touched.email && formik.errors.email && (
          <div className={styles.authErrorMessage} data-testid="email-error">
            {formik.errors.email}
          </div>
        )}
      </div>

      <div className={styles.inputWrapper}>
        <Input
          wrapperClassName={styles.passwordInputWrapper}
          inputClassName={styles.passwordInput}
          placeholder={t('passwordPlaceholder')}
          value={formik.values.password}
          onChange={handlePasswordInputChange}
          onBlur={() => handleBlur('password')}
          svgIconComponent={<EyeSvg />}
          title={t('password')}
          dataTestId="password-input"
        />
        {formik.touched.password && formik.errors.password && (
          <div className={styles.authErrorMessage} data-testid="password-error">
            {formik.errors.password}
          </div>
        )}
      </div>

      {logInResult ? (
        <div
          className={`${styles.authErrorMessage} ${styles.userError}`}
          data-testid="credentials-error"
        >
          {t('invalidCredentials')}
        </div>
      ) : null}

      <Button
        text={mode == 'signin' ? t('signIn') : t('signUp')}
        className={styles.submitAuthButton}
        type="submit"
        data-testid="submit-button"
      />

      {mode == 'signin' ? (
        <>
          <p data-testid="switch-to-signup-text">
            {t('dontHaveAccount')}{' '}
            <Link
              href="/signup"
              className={styles.navLink}
              onClick={resetForm}
              data-testid="switch-to-signup-link"
            >
              {t('signUpLink')}
            </Link>
          </p>
        </>
      ) : (
        <>
          <p className={styles.agreementText} data-testid="agreement-text">
            {t('termsAgreement')}{' '}
            <span className={styles.links}>
              {t('termsOfService')}
              <br />
            </span>{' '}
            {t('and')} <span className={styles.links}>{t('privacyPolicy')}</span>
          </p>

          <p data-testid="switch-to-signin-text">
            {t('alreadyHaveAccount')}{' '}
            <Link
              href="/signin"
              className={styles.navLink}
              onClick={resetForm}
              data-testid="switch-to-signin-link"
            >
              {t('signInLink')}
            </Link>
          </p>
        </>
      )}
    </form>
  );
}

export default AuthForm;
