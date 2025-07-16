import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '../components/providers';
import '../styles/globals.css';
import { cn } from '../utils/cn';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Diseña tu futuro - Encuéntralo en Cartago',
    template: '%s | Cartago Académico',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  description:
    'La plataforma que unifica la oferta académica de Cartago, Valle del Cauca. Busca, compara y decide tu futuro académico.',
  keywords: [
    'educación',
    'universidad',
    'cartago',
    'valle del cauca',
    'carreras',
    'programas académicos',
    'instituciones',
    'pregrado',
    'posgrado',
    'colombia',
  ],
  authors: [{ name: 'Plataforma Académica Cartago' }],
  creator: 'Plataforma Académica Cartago',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: 'Diseña tu futuro - Encuéntralo en Cartago',
    description:
      'La plataforma que unifica la oferta académica de Cartago, Valle del Cauca. Busca, compara y decide.',
    siteName: 'Cartago Académico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diseña tu futuro - Encuéntralo en Cartago',
    description:
      'La plataforma que unifica la oferta académica de Cartago, Valle del Cauca.',
    creator: '@cartagoacademico',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='es' suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          'min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans antialiased'
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
