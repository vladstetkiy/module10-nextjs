import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('@/components/Avatar/Avatar', () => ({ avatarSrc, className }: any) => (
  <div data-testid="avatar" className={className}>
    {avatarSrc ? `Avatar: ${avatarSrc}` : 'No Avatar'}
  </div>
));

jest.mock('@/components/svg/LogoSvg/LogoSvg', () => ({ className }: any) => (
  <svg data-testid="logo" className={className} />
));

jest.mock('./Header.css', () => ({}));

jest.mock('next/link', () => {
  return function MockLink({ children, href, className, onClick }: any) {
    return (
      <a href={href} className={className} onClick={onClick} data-testid={`link-${href}`}>
        {children}
      </a>
    );
  };
});

describe('Header Component', () => {
  const mockT = jest.fn((key: string) => {
    const translations: Record<string, string> = {
      profileLink: 'Profile',
      statsLink: 'Statistics',
      signInLink: 'Sign In',
      signUpLink: 'Sign Up',
    };
    return translations[key] || key;
  });

  const mockPersonInfo = {
    firstName: 'John',
    secondName: 'Doe',
    profileImage: 'profile.jpg',
  };

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
    (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
    jest.clearAllMocks();

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  it('renders header with user info for authenticated user', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuth: true,
      personInfo: mockPersonInfo,
    });

    render(<Header />);

    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByTestId('link-/profile-info-and-statistic')).toBeInTheDocument();
  });

  it('renders auth links for non-authenticated user', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuth: false,
      personInfo: null,
    });

    render(<Header />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByTestId('link-/signin')).toBeInTheDocument();
    expect(screen.getByTestId('link-/signup')).toBeInTheDocument();
  });

  it('has burger menu button on allowed paths', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuth: true,
      personInfo: mockPersonInfo,
    });

    render(<Header />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not show burger menu on non-allowed paths', () => {
    (usePathname as jest.Mock).mockReturnValue('/not-allowed');
    (useAuth as jest.Mock).mockReturnValue({
      isAuth: true,
      personInfo: mockPersonInfo,
    });

    render(<Header />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls burger button click handler', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuth: true,
      personInfo: mockPersonInfo,
    });

    render(<Header />);

    const burgerButton = screen.getByRole('button');
    fireEvent.click(burgerButton);

    expect(burgerButton).toBeInTheDocument();
  });
});
