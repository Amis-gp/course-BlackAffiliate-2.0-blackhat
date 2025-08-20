import type { Metadata } from 'next'
import { Geologica } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProgressProvider } from '@/contexts/ProgressContext'
import { UIProvider } from '@/contexts/UIContext'

const geologica = Geologica({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

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
      </head>
      <body className={`${geologica.className} bg-background text-foreground`}>
        <AuthProvider>
          <ProgressProvider>
            <UIProvider>
              {children}
            </UIProvider>
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  )
}