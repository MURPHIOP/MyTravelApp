import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import TopNavbar from '@/components/layout/TopNavbar';
import Footer from '@/components/layout/Footer';
import Preloader from '@/components/layout/Preloader';
import LoginModal from '@/components/auth/LoginModal';
import { TripDataProvider } from '@/context/TripDataContext';

export const metadata: Metadata = {
  title: 'Ancient Maharashtra Tour',
  description: 'A premium family travel companion for the 11-day Ancient Maharashtra tour.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <Preloader />
          <LoginModal />
          <ThemeProvider>
            <div className="relative min-h-screen flex flex-col">
            <TopNavbar />
            <main className="flex-grow">
              <TripDataProvider>
                {children}
              </TripDataProvider>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
