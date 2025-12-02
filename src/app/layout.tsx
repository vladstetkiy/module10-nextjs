import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import './globals.css';
import './variables.css';
import Providers from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
          <div id="push-notification"></div>
        </Providers>
      </body>
    </html>
  );
}
