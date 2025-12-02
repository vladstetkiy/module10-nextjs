'use client';

import './Header.css';
import Avatar from '@/components/Avatar/Avatar';
import LogoSvg from '@/components/svg/LogoSvg/LogoSvg';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function Header() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const allowedPathsForNav = ['/', '/profile-info-and-statistic'];

  const isAuth = localStorage.getItem('isAuth') == 'true';

  const avatarExample = '/assets/AvatarExample.png';

  useEffect(() => {
    function handleMobileClick(event: MouseEvent) {
      const isDrawerClick = (event.target as Element)?.closest('.header-drawer');

      if (!isDrawerClick) {
        setIsDrawerOpen(false);
      }
    }

    document.addEventListener('click', handleMobileClick);
    return () => {
      document.removeEventListener('click', handleMobileClick);
    };
  }, []);

  function handleBurgerClick() {
    setIsDrawerOpen((prev) => !prev);
  }

  return (
    <>
      {' '}
      <header className={isDrawerOpen ? ' header-drawer' : 'header'}>
        <div className={isDrawerOpen ? 'header-drawer-top' : ''}>
          <Link href="/" className="home-page-link" onClick={() => setIsDrawerOpen(false)}>
            <LogoSvg className={isDrawerOpen ? 'header-logo-drawer' : 'header-logo'} />
          </Link>
          {isDrawerOpen && isAuth ? (
            <Avatar avatarSrc={avatarExample} className="header-avatar" />
          ) : null}
        </div>

        {allowedPathsForNav.includes(pathname) ? (
          <>
            <nav className={isDrawerOpen ? 'drawer-nav' : 'header-menu'}>
              {isAuth ? (
                <>
                  {!isDrawerOpen ? (
                    <Link href="/profile-info-and-statistic" className="profile-info-link">
                      <Avatar avatarSrc={avatarExample} className="header-avatar" />
                      <p>Name Surname</p>
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/profile-info-and-statistic"
                        className="nav-link-drawer"
                        onClick={() => {
                          localStorage.setItem('isProfileInfo', 'true');
                          return setIsDrawerOpen(false);
                        }}
                      >
                        Profile info
                      </Link>
                      <Link
                        href="/profile-info-and-statistic"
                        className="nav-link-drawer"
                        onClick={() => {
                          localStorage.setItem('isProfileInfo', 'false');
                          return setIsDrawerOpen(false);
                        }}
                      >
                        Statistic
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className={!isDrawerOpen ? 'nav-link-header' : 'nav-link-drawer'}
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className={!isDrawerOpen ? 'nav-link-header' : 'nav-link-drawer'}
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </nav>

            <button
              className={isDrawerOpen ? 'header-menu-mobile visible ' : 'header-menu-mobile'}
              onClick={handleBurgerClick}
            >
              <div className="burger-line"></div>
              <div className="burger-line"></div>
              <div className="burger-line"></div>
            </button>
          </>
        ) : null}
      </header>
      {isDrawerOpen ? <div className="overlay"></div> : null}
    </>
  );
}

export default Header;
