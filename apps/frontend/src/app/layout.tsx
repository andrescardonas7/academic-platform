import { Providers } from '@/components/providers'
import '@/styles/globals.css'
import { cn } from '@/utils/cn'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Academic Platform',
    template: '%s | Academic Platform'
  },
  description: 'Discover and compare academic institutions and careers. Find the perfect educational path for your future.',
  keywords: ['education', 'university', 'college', 'careers', 'academic', 'institutions'],
  authors: [{ name: 'Academic Platform Team' }],
  creator: 'Academic Platform Team',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: 'Academic Platform',
    description: 'Discover and compare academic institutions and careers.',
    siteName: 'Academic Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Academic Platform',
    description: 'Discover and compare academic institutions and careers.',
    creator: '@academicplatform',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        inter.className,
        'min-h-screen bg-background font-sans antialiased'
      )}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
