import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { NavBar } from '@/components/navbar';
import { Providers } from '@/components/providers';
import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';

export const metadata: Metadata = {
  title: 'Docmate',
  description: 'Your AI-powered PDF assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={`${GeistSans.variable}`}>
      <Providers>
        <body className='min-h-screen font-sans antialiased grainy'>
          <NavBar />
          {children}
        </body>
      </Providers>
    </html>
  );
}
