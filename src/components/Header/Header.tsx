'use client';

import styles from './Header.module.css';
import Avatar from '@/components/Avatar/Avatar';
import LogoSvg from '@/components/svg/LogoSvg/LogoSvg';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const allowedPathsForNav = ['/', '/profile-info-and-statistic'];
  const { personInfo, isAuth } = useAuth();

  useEffect(() => {
    function handleMobileClick(event: MouseEvent) {
      const isDrawerClick = (event.target as Element)?.closest(`.${styles.headerDrawer}`);

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
      <header className={isDrawerOpen ? styles.headerDrawer : styles.header}>
        <div className={isDrawerOpen ? styles.headerDrawerTop : ''}>
          <Link href="/" className={styles.homePageLink} onClick={() => setIsDrawerOpen(false)}>
            <LogoSvg className={isDrawerOpen ? styles.headerLogoDrawer : styles.headerLogo} />
          </Link>
          {isDrawerOpen && isAuth ? (
            <Avatar avatarSrc={personInfo.profileImage} className={styles.headerAvatar} />
          ) : null}
        </div>

        {allowedPathsForNav.includes(pathname) ? (
          <>
            <nav className={isDrawerOpen ? styles.drawerNav : styles.headerMenu}>
              {isAuth ? (
                <>
                  {!isDrawerOpen ? (
                    <Link href="/profile-info-and-statistic" className={styles.profileInfoLink}>
                      <Avatar avatarSrc={personInfo.profileImage} className={styles.headerAvatar} />
                      <p>{personInfo.firstName + ' ' + personInfo.secondName}</p>
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/profile-info-and-statistic"
                        className={styles.navLinkDrawer}
                        onClick={() => {
                          localStorage.setItem('isProfileInfo', 'true');
                          return setIsDrawerOpen(false);
                        }}
                      >
                        {t('profileLink')}
                      </Link>
                      <Link
                        href="/profile-info-and-statistic"
                        className={styles.navLinkDrawer}
                        onClick={() => {
                          localStorage.setItem('isProfileInfo', 'false');
                          return setIsDrawerOpen(false);
                        }}
                      >
                        {t('statsLink')}
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className={!isDrawerOpen ? styles.navLinkHeader : styles.navLinkDrawer}
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    {t('signInLink')}
                  </Link>
                  <Link
                    href="/signup"
                    className={!isDrawerOpen ? styles.navLinkHeader : styles.navLinkDrawer}
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    {t('signUpLink')}
                  </Link>
                </>
              )}
            </nav>

            <button
              className={
                isDrawerOpen
                  ? `${styles.headerMenuMobile} ${styles.visible}`
                  : styles.headerMenuMobile
              }
              onClick={handleBurgerClick}
            >
              <div className={styles.burgerLine}></div>
              <div className={styles.burgerLine}></div>
              <div className={styles.burgerLine}></div>
            </button>
          </>
        ) : null}
      </header>
      {isDrawerOpen ? <div className={styles.overlay}></div> : null}
    </>
  );
}

export default Header;
