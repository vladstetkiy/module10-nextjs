import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthPage from './AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { showNotification } from '@/utils/ShowNotification';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/utils/ShowNotification', () => ({
  showNotification: jest.fn(),
}));

jest.mock('../Input/Input', () => ({ title, placeholder, value, onChange, onBlur }: any) => (
  <div>
    <label>{title}</label>
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      data-testid={`input-${title}`}
    />
  </div>
));

jest.mock('../Button/Button', () => ({ text, type }: any) => (
  <button type={type} data-testid="submit-button">
    {text}
  </button>
));

jest.mock('./AuthPage.css', () => ({}));

describe('AuthPage Component', () => {
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      createAccount: 'Create Account',
      email: 'Email',
      password: 'Password',
      emailPlaceholder: 'Enter email',
      passwordPlaceholder: 'Enter password',
      inputEmail: 'Email is required',
      invalidEmail: 'Invalid email',
      inputPassword: 'Password is required',
      passwordTooShort: 'Password too short',
      invalidCredentials: 'Invalid credentials',
      signInSuccess: 'Signed in successfully',
      signUpSuccess: 'Account created successfully',
      enterEmailPassword: 'Enter your email and password',
      toSignIn: 'to sign in',
      toSignUp: 'to create an account',
      thisApp: 'to this app',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      signInLink: 'Sign In',
      signUpLink: 'Sign Up',
      termsAgreement: 'By creating an account, you agree to our',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      and: 'and',
    };
    return translations[key] || key;
  });

  const mockPush = jest.fn();
  const mockLogIn = jest.fn();
  const mockLogUp = jest.fn();

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useAuth as jest.Mock).mockReturnValue({
      logIn: mockLogIn,
      logUp: mockLogUp,
    });

    mockLogIn.mockReturnValue({
      unwrap: jest.fn(),
    });

    mockLogUp.mockReturnValue({
      unwrap: jest.fn(),
    });

    jest.clearAllMocks();
  });

  it('renders sign in form', () => {
    render(<AuthPage mode="signin" />);

    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Sign In');
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it('renders sign up form', () => {
    render(<AuthPage mode="signup" />);

    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Sign Up');
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('validates email field', async () => {
    render(<AuthPage mode="signin" />);

    const emailInput = screen.getByTestId('input-Email');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  it('validates password field', async () => {
    render(<AuthPage mode="signin" />);

    const passwordInput = screen.getByTestId('input-Password');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password too short')).toBeInTheDocument();
    });
  });

  it('submits sign in form with valid data', async () => {
    const mockUnwrap = jest.fn().mockResolvedValue(true);
    mockLogIn.mockReturnValue({
      unwrap: mockUnwrap,
    });

    render(<AuthPage mode="signin" />);

    const emailInput = screen.getByTestId('input-Email');
    const passwordInput = screen.getByTestId('input-Password');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(showNotification).toHaveBeenCalledWith('Signed in successfully', 5000);
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('submits sign up form with valid data', async () => {
    const mockUnwrap = jest.fn().mockResolvedValue('ok');
    mockLogUp.mockReturnValue({
      unwrap: mockUnwrap,
    });

    render(<AuthPage mode="signup" />);

    const emailInput = screen.getByTestId('input-Email');
    const passwordInput = screen.getByTestId('input-Password');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogUp).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(showNotification).toHaveBeenCalledWith('Account created successfully', 5000);
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
