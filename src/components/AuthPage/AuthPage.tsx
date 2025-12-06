'use client';

import './AuthPage.css';
import { useState, type FormEvent } from 'react';
import { useFormik } from 'formik';
import Input from '../Input/Input';
import EyeSvg from '../svg/EyeSvg/EyeSvg';
import MailSvg from '../svg/MailSvg/MailSvg';
import Button from '../Button/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { showNotification } from '@/utils/ShowNotification';
import { useTranslation } from 'react-i18next';

type mode = 'signin' | 'signup';

interface AuthPagePropsInterface {
  mode: mode;
}

interface FormValues {
  email: string;
  password: string;
}

function AuthPage({ mode }: AuthPagePropsInterface) {
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
    onSubmit: (values) => {
      if (mode === 'signin') {
        logIn(values.email, values.password)
          .unwrap()
          .then((result) => {
            if (result) {
              showNotification(t('signInSuccess'), 5000);
              router.push('/');
            } else {
              setLogInResult(true);
            }
          });
      } else {
        logUp(values.email, values.password)
          .unwrap()
          .then((result) => {
            if (result) {
              showNotification(t('signUpSuccess'), 5000);
              router.push('/');
            }
          });
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
    <main className="auth-page" data-testid="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} data-testid="auth-form">
        <div className="form-title">
          {mode == 'signin' ? (
            <>
              <h2 data-testid="page-title">{t('signIn')}</h2>
              <p data-testid="page-description">
                {t('enterEmailPassword') + ' ' + t('toSignIn') + ' ' + t('thisApp')}
              </p>
            </>
          ) : (
            <>
              <h2 data-testid="page-title">{t('createAccount')}</h2>
              <p data-testid="page-description">
                {t('enterEmailPassword') + ' ' + t('toSignUp') + ' ' + t('thisApp')}
              </p>
            </>
          )}
        </div>

        <div className="input-wrapper">
          <Input
            wrapperClassName="email-input-wrapper"
            inputClassName="email-input"
            placeholder={t('emailPlaceholder')}
            value={formik.values.email}
            onChange={handleEmailInputChange}
            onBlur={() => handleBlur('email')}
            svgIconComponent={<MailSvg />}
            title={t('email')}
            dataTestId="email-input"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="auth-error-message" data-testid="email-error">
              {formik.errors.email}
            </div>
          )}
        </div>

        <div className="input-wrapper">
          <Input
            wrapperClassName="password-input-wrapper"
            inputClassName="password-input"
            placeholder={t('passwordPlaceholder')}
            value={formik.values.password}
            onChange={handlePasswordInputChange}
            onBlur={() => handleBlur('password')}
            svgIconComponent={<EyeSvg />}
            title={t('password')}
            dataTestId="password-input"
          />
          {formik.touched.password && formik.errors.password && (
            <div className="auth-error-message" data-testid="password-error">
              {formik.errors.password}
            </div>
          )}
        </div>

        {logInResult ? (
          <div className="auth-error-message user-error" data-testid="credentials-error">
            {t('invalidCredentials')}
          </div>
        ) : null}

        <Button
          text={mode == 'signin' ? t('signIn') : t('signUp')}
          className="submit-auth-button"
          type="submit"
          data-testid="submit-button"
        />

        {mode == 'signin' ? (
          <>
            <p data-testid="switch-to-signup-text">
              {t('dontHaveAccount')}{' '}
              <Link
                href="/signup"
                className="nav-link"
                onClick={resetForm}
                data-testid="switch-to-signup-link"
              >
                {t('signUpLink')}
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className="agreement-text" data-testid="agreement-text">
              {t('termsAgreement')}{' '}
              <span className="links">
                {t('termsOfService')}
                <br />
              </span>{' '}
              {t('and')} <span className="links">{t('privacyPolicy')}</span>
            </p>

            <p data-testid="switch-to-signin-text">
              {t('alreadyHaveAccount')}{' '}
              <Link
                href="/signin"
                className="nav-link"
                onClick={resetForm}
                data-testid="switch-to-signin-link"
              >
                {t('signInLink')}
              </Link>
            </p>
          </>
        )}
      </form>
    </main>
  );
}

export default AuthPage;
