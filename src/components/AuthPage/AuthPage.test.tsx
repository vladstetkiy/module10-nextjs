import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthForm from './AuthForm';

const mockLogIn = jest.fn();
const mockLogUp = jest.fn();
const mockShowNotification = jest.fn();
const mockPush = jest.fn();

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    logIn: mockLogIn,
    logUp: mockLogUp,
  }),
}));

jest.mock('@/contexts/NotificationContext/NotificationContext', () => ({
  useNotification: () => ({
    showNotification: mockShowNotification,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const setupSignin = () => render(<AuthForm mode="signin" />);
const setupSignup = () => render(<AuthForm mode="signup" />);

const fillForm = (email: string, password: string) => {
  fireEvent.change(screen.getByTestId('email-input'), {
    target: { value: email },
  });

  fireEvent.change(screen.getByTestId('password-input'), {
    target: { value: password },
  });
};

describe('AuthForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders signin form', () => {
    setupSignin();

    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('signIn');
  });

  test('shows validation errors on empty submit', async () => {
    setupSignin();

    fireEvent.click(screen.getByTestId('submit-button'));

    expect(await screen.findByTestId('email-error')).toBeInTheDocument();
    expect(await screen.findByTestId('password-error')).toBeInTheDocument();
  });

  test('shows invalid email error', async () => {
    setupSignin();

    fillForm('invalid-email', '123456');
    fireEvent.click(screen.getByTestId('submit-button'));

    expect(await screen.findByTestId('email-error')).toHaveTextContent('invalidEmail');
  });

  test('successful signin redirects to home', async () => {
    mockLogIn.mockReturnValue({
      unwrap: () => Promise.resolve(true),
    });

    setupSignin();

    fillForm('test@test.com', '123456');
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockLogIn).toHaveBeenCalledWith('test@test.com', '123456');
      expect(mockShowNotification).toHaveBeenCalledWith('signInSuccess', 5000);
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  test('shows credentials error on failed signin', async () => {
    mockLogIn.mockReturnValue({
      unwrap: () => Promise.resolve(false),
    });

    setupSignin();

    fillForm('test@test.com', '123456');
    fireEvent.click(screen.getByTestId('submit-button'));

    expect(await screen.findByTestId('credentials-error')).toBeInTheDocument();
  });

  test('renders signup mode correctly', () => {
    setupSignup();

    expect(screen.getByTestId('agreement-text')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('signUp');
  });

  test('successful signup redirects to home', async () => {
    mockLogUp.mockReturnValue({
      unwrap: () => Promise.resolve(true),
    });

    setupSignup();

    fillForm('test@test.com', '123456');
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockLogUp).toHaveBeenCalled();
      expect(mockShowNotification).toHaveBeenCalledWith('signUpSuccess', 5000);
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
