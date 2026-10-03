import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Project / Wrap — Vehicle Graphics Studio',
  description: 'Professional vehicle wraps and precision sticker work for people who refuse to blend in.',
  generator: 'v0.app',
  metadataBase: new URL('https://example.com'),
  alternates: { canonical: '/' },
  openGraph: { title: 'Project / Wrap', description: 'Vehicle graphics, reimagined.', type: 'website', url: 'https://example.com' },
  twitter: { card: 'summary_large_image', title: 'Project / Wrap', description: 'Vehicle graphics, reimagined.' },
  icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f1eee8', userScalable: true }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
