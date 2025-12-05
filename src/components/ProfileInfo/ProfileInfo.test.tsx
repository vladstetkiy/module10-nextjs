import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileInfo from './ProfileInfo';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../PersonShortInfo/PersonShortInfo', () => () => (
  <div data-testid="person-short-info" />
));

jest.mock('../Input/Input', () => {
  return function MockInput({ title, placeholder, value, onChange, svgIconComponent }: any) {
    return (
      <div data-testid="input">
        <label>{title}</label>
        <input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          data-testid={`input-${title?.toLowerCase() || 'field'}`}
        />
        {svgIconComponent}
      </div>
    );
  };
});

jest.mock('../Button/Button', () => {
  return function MockButton({ text, onClick, type, className }: any) {
    return (
      <button data-testid={`button-${className || 'default'}`} onClick={onClick} type={type}>
        {text}
      </button>
    );
  };
});

jest.mock('../Toggle/Toggle', () => {
  return function MockToggle({ visualMode, onToggle, isOn, secondOption }: any) {
    return (
      <div data-testid="toggle">
        <button onClick={onToggle} data-ison={isOn}>
          {secondOption}
        </button>
      </div>
    );
  };
});

jest.mock('next/link', () => {
  return function MockLink({ children, href, className }: any) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

jest.mock('../svg/MailSvg/MailSvg', () => () => <svg data-testid="mail-svg" />);
jest.mock('../svg/UserSvg/UserSvg', () => () => <svg data-testid="user-svg" />);
jest.mock('../svg/PenSvg/PenSvg', () => () => <svg data-testid="pen-svg" />);

jest.mock('./ProfileInfo.css', () => ({}));

jest.mock('../../utils/ShowNotification', () => ({
  showNotification: jest.fn(),
}));

global.fetch = jest.fn();

describe('ProfileInfo Component', () => {
  const mockThemeToggle = jest.fn();
  const mockLogOut = jest.fn();
  const mockChangeLanguage = jest.fn();
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      editProfile: 'Edit Profile',
      username: 'Username',
      email: 'Email',
      description: 'Description',
      saveProfile: 'Save Profile',
      preferencies: 'Preferences',
      darkTheme: 'Dark Theme',
      actions: 'Actions',
      logout: 'Logout',
      inputUsername: 'Invalid username',
      inputEmail: 'Email required',
      inputValidEmail: 'Invalid email',
      descSize: 'Description too long',
      descriptionPlaceholder: 'Enter description',
      maxDescLength: 'Max 200 characters',
      updatedProfile: 'Profile updated',
    };
    return translations[key] || key;
  });

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      themeToggle: mockThemeToggle,
    });

    (useAuth as jest.Mock).mockReturnValue({
      logOut: mockLogOut,
    });

    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
      i18n: {
        language: 'en',
        changeLanguage: mockChangeLanguage,
      },
    });

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
      },
      writable: true,
    });

    jest.clearAllMocks();
  });

  it('renders profile form', () => {
    render(<ProfileInfo />);

    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Save Profile')).toBeInTheDocument();
  });

  it('validates form inputs', async () => {
    render(<ProfileInfo />);

    const usernameInput = screen.getByTestId('input-username');
    const emailInput = screen.getByTestId('input-email');

    fireEvent.change(usernameInput, { target: { value: 'ab' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = screen.getByTestId('button-save-changes-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockT).toHaveBeenCalledWith('inputUsername');
      expect(mockT).toHaveBeenCalledWith('inputValidEmail');
    });
  });

  it('submits form with valid data', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<ProfileInfo />);

    const usernameInput = screen.getByTestId('input-username');
    const emailInput = screen.getByTestId('input-email');
    const descriptionInput = screen.getByTestId('input-description');

    fireEvent.change(usernameInput, { target: { value: 'validuser123' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(descriptionInput, { target: { value: 'Valid description' } });

    const submitButton = screen.getByTestId('button-save-changes-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('toggles theme and language', () => {
    render(<ProfileInfo />);

    const toggleButtons = screen.getAllByTestId('toggle');

    fireEvent.click(toggleButtons[0].querySelector('button')!);
    expect(mockThemeToggle).toHaveBeenCalled();

    fireEvent.click(toggleButtons[1].querySelector('button')!);
    expect(mockChangeLanguage).toHaveBeenCalledWith('ru');
  });

  it('handles logout', () => {
    render(<ProfileInfo />);

    const logoutButton = screen.getByTestId('button-logout-button');
    fireEvent.click(logoutButton);

    expect(mockLogOut).toHaveBeenCalled();
  });
});
