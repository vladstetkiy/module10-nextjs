import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

jest.mock('./Header.module.css', () => ({
  header: 'header',
  headerDrawer: 'headerDrawer',
  headerMenu: 'headerMenu',
  drawerNav: 'drawerNav',
  headerMenuMobile: 'headerMenuMobile',
  visible: 'visible',
  overlay: 'overlay',
  burgerLine: 'burgerLine',
  homePageLink: 'homePageLink',
  navLinkHeader: 'navLinkHeader',
  navLinkDrawer: 'navLinkDrawer',
  profileInfoLink: 'profileInfoLink',
  headerAvatar: 'headerAvatar',
  headerLogo: 'headerLogo',
  headerLogoDrawer: 'headerLogoDrawer',
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/components/Avatar/Avatar', () => ({
  __esModule: true,
  default: () => <div data-testid="avatar" />,
}));

jest.mock('@/components/svg/LogoSvg/LogoSvg', () => ({
  __esModule: true,
  default: () => <div data-testid="logo" />,
}));

import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  test('renders sign in and sign up links when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuth: false,
      personInfo: null,
    });

    render(<Header />);

    expect(screen.getByText('signInLink')).toBeInTheDocument();
    expect(screen.getByText('signUpLink')).toBeInTheDocument();
  });

  test('renders user name when authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuth: true,
      personInfo: {
        firstName: 'John',
        secondName: 'Doe',
        profileImage: '',
      },
    });

    render(<Header />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
