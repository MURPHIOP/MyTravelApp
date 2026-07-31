import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeProvider';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'MyTravelApp — Ancient Maharashtra Tour',
  description:
    'A premium family travel companion for the 11-day Ancient Maharashtra tour. Live itinerary, expense splitting, train tickets, hotel bookings and more.',
  keywords: ['travel', 'maharashtra', 'itinerary', 'family tour', 'jyotirlinga', 'mitra', 'ghosh'],
  authors: [{ name: 'Mitra & Ghosh Families' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'MyTravelApp — Ancient Maharashtra Tour',
    description: 'Live itinerary, expenses and travel documents for our family trip.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F0F4FF' },
    { media: '(prefers-color-scheme: dark)', color: '#070B14' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('travel-theme') || 'dark';
                document.documentElement.setAttribute('data-theme', t);
              } catch(e) {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            `,
          }}
        />
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
