import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientProviders } from '@/components/providers/ClientProviders'
import { WorkflowStatus } from '@/components/shared/WorkflowStatus'

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
        <ClientProviders>
          <div className="min-h-screen bg-background">
            {children}
            <WorkflowStatus />
          </div>
        </ClientProviders>
      </body>
    </html>
  )
} 