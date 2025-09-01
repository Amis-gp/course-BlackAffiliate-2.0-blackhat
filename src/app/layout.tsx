import type { Metadata } from 'next'
import './globals.css'
import { ClientAuthProvider } from '@/components/ClientAuthProvider'

const geologica = {
  className: 'font-geologica'
}

export const metadata: Metadata = {
  title: 'BlackAffiliate 2.0 Course',
  description: 'Master the art of affiliate marketing with our comprehensive course',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/img/favicon.webp" type="image/webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geologica.className} bg-background text-foreground`}>
        <ClientAuthProvider>
        {children}
      </ClientAuthProvider>
      </body>
    </html>
  )
}