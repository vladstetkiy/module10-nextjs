'use client';

import style from './error.module.css';
import CrossSvg from '@/components/svg/CrossSvg/CrossSvg';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export default function ErrorPage() {
  return (
    <>
      <Header />
      <div id={style.errorPage}>
        <CrossSvg className={style.crossSvg} />
        <p className={style.pText}>
          Oops...
          <br />
          Something bad has just happened
        </p>
      </div>
      <Footer />
    </>
  );
}
