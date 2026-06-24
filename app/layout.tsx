import type { Metadata } from 'next'
import { Archivo, Host_Grotesk } from 'next/font/google'
import { JsonLd } from '@/components/seo/json-ld'
import { ConsentAnalytics } from '@/components/legal/consent-analytics'
import { defaultOgImage } from '@/lib/seo/metadata'
import { getIndexingRobots } from '@/lib/seo/env'
import { organizationSchema } from '@/lib/seo/structured-data'
import { site } from '@/content/site'
import './globals.css'

const hostGrotesk = Host_Grotesk({
  subsets: ['latin'],
  variable: '--font-host-grotesk',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  weight: ['300', '400', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'tenaasesores | Asesoría online para autónomos y pymes',
    template: '%s',
  },
  description: site.description,
  robots: getIndexingRobots(),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: site.name,
    title: 'tenaasesores | Asesoría online para autónomos y pymes',
    description: site.description,
    url: site.url,
    images: [defaultOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'tenaasesores | Asesoría online para autónomos y pymes',
    description: site.description,
    images: [defaultOgImage.url],
  },
  icons: {
    icon: [
      { url: '/brand/favicon.ico', sizes: '48x48' },
      { url: '/brand/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      {
        url: '/brand/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/brand/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${hostGrotesk.variable} ${archivo.variable} bg-background`}
    >
      <head>
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
      </head>
      <body className={`${archivo.className} antialiased`}>
        <JsonLd data={organizationSchema()} />
        {children}
        <ConsentAnalytics />
      </body>
    </html>
  )
}
