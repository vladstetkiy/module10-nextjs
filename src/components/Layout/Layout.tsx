import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.tsx';
import Footer from '../Footer/Footer.tsx';

const Layout = () => {
  return (
    <>
      {' '}
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
