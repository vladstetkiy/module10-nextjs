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
  const router = useRouter();

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors: Partial<FormValues> = {};

      if (!values.email.trim()) {
        errors.email = 'Email is required';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(values.email)) {
          errors.email = 'Please enter a valid email address';
        }
      }

      if (!values.password.trim()) {
        errors.password = 'Password is required';
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
      }

      return errors;
    },
    onSubmit: (values) => {
      if (mode === 'signin') {
        logIn(values.email, values.password)
          .unwrap()
          .then((result) => {
            if (result) {
              showNotification('User has been signed in successfully', 5000);
              router.push('/');
            } else {
              setLogInResult(true);
            }
          });
      } else {
        logUp(values.email, values.password)
          .unwrap()
          .then((result) => {
            if (result === 'ok') {
              showNotification('User has been signed up successfully', 5000);
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
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-title">
          {mode == 'signin' ? (
            <>
              <h2>Sign in into an account</h2>{' '}
              <p>Enter your email and password to sign in into this app</p>
            </>
          ) : (
            <>
              <h2>Create an account</h2>
              <p>Enter your email and password to sign up for this app</p>
            </>
          )}
        </div>

        <div className="input-wrapper">
          <Input
            wrapperClassName="email-input-wrapper"
            inputClassName="email-input"
            placeholder="Enter email"
            value={formik.values.email}
            onChange={handleEmailInputChange}
            onBlur={() => handleBlur('email')}
            svgIconComponent={<MailSvg />}
            title="Email"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="auth-error-message">{formik.errors.email}</div>
          )}
        </div>

        <div className="input-wrapper">
          <Input
            wrapperClassName="password-input-wrapper"
            inputClassName="password-input"
            placeholder="Enter password"
            value={formik.values.password}
            onChange={handlePasswordInputChange}
            onBlur={() => handleBlur('password')}
            svgIconComponent={<EyeSvg />}
            title="Password"
          />
          {formik.touched.password && formik.errors.password && (
            <div className="auth-error-message">{formik.errors.password}</div>
          )}
        </div>
        {logInResult ? (
          <div className="auth-error-message user-error">User does not exist</div>
        ) : null}
        <Button
          text={mode == 'signin' ? 'sign in' : 'sign up'}
          className="submit-auth-button"
          type="submit"
        />

        {mode == 'signin' ? (
          <>
            <p>
              Forgot to create an account?{' '}
              <Link href="/signup" className="nav-link" onClick={resetForm}>
                Sign up
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className="agreement-text">
              By clicking continue, you agree to our{' '}
              <span className="links">
                Terms of Service
                <br />
              </span>{' '}
              and <span className="links">Privacy Policy</span>
            </p>

            <p>
              Already have an account?{' '}
              <Link href="/signin" className="nav-link" onClick={resetForm}>
                Sign in
              </Link>{' '}
            </p>
          </>
        )}
      </form>
    </main>
  );
}

export default AuthPage;
