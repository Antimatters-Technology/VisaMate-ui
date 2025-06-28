import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WSProvider } from '@/libs/ws'
import { Toaster } from '@/components/ui/toaster'
import { I18nProvider } from '@/libs/i18n'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VisaMate - Your Visa Journey Simplified',
  description: 'Professional visa consultation and document management platform',
  keywords: 'visa, immigration, consultation, documents, canada, australia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          <WSProvider>
            <div className="min-h-screen bg-background">
              {children}
            </div>
            <Toaster />
          </WSProvider>
        </I18nProvider>
      </body>
    </html>
  )
} 