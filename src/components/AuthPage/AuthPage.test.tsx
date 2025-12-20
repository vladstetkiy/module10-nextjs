import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

/* ===== МОКИ (ОБЯЗАТЕЛЬНО В САМОМ ВЕРХУ) ===== */

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

jest.mock('@/app/i18next', () => ({}));

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

/* ===== ИМПОРТ ПОСЛЕ МОКОВ ===== */

import AuthForm from './AuthForm';

/* ===== ТЕСТЫ ===== */

describe('AuthForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders signin form', () => {
    render(<AuthForm mode="signin" />);

    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
  });

  test('successful signin', async () => {
    mockLogIn.mockReturnValue({
      unwrap: () => Promise.resolve(true),
    });

    render(<AuthForm mode="signin" />);

    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@test.com' },
    });

    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockLogIn).toHaveBeenCalled();
      expect(mockShowNotification).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  test('renders signup form', () => {
    render(<AuthForm mode="signup" />);

    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });
});
