import { Suspense } from 'react'
import { MagicLinkHandler } from '@/hooks/useMagicLink'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface MagicLinkPageProps {
  params: {
    token: string
  }
}

export default function MagicLinkPage({ params }: MagicLinkPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Authenticating...</CardTitle>
          <CardDescription>
            Please wait while we verify your magic link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <MagicLinkHandler token={params.token} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
} 