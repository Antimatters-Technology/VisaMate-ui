'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import { useDocuments } from '@/stores/documents'
import Link from 'next/link'

interface CompletionBannerProps {
  showWhenEmpty?: boolean
  title?: string
  subtitle?: string
  buttonText?: string
  buttonHref?: string
  className?: string
}

export function CompletionBanner({
  showWhenEmpty = false,
  title = "Ready to Submit Your Application?",
  subtitle = "Get expert review to ensure zero mistakes and 100% IRCC compliance.",
  buttonText = "Complete Application - ₹1,000",
  buttonHref = "/payment",
  className = ""
}: CompletionBannerProps) {
  const { documents } = useDocuments()
  
  const hasDocuments = documents.length > 0
  const completedDocuments = documents.filter(doc => doc.status === 'completed').length
  
  // Show banner logic
  const shouldShow = showWhenEmpty ? true : hasDocuments

  if (!shouldShow) return null

  return (
    <Card className={`border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50 shadow-lg ${className}`}>
      <CardContent className="p-6 md:p-8">
        <div className="text-center">
          {hasDocuments && (
            <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
              🎉 {completedDocuments} DOCUMENT{completedDocuments !== 1 ? 'S' : ''} UPLOADED
            </Badge>
          )}
          
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          
          <p className="text-sm md:text-base text-gray-600 mb-4">
            {hasDocuments && (
              <>You've uploaded <strong>{completedDocuments} document{completedDocuments !== 1 ? 's' : ''}</strong>. </>
            )}
            {subtitle}
          </p>

          <Link href={buttonHref}>
            <Button size="default" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              🚀 {buttonText}
            </Button>
          </Link>

          <p className="text-xs text-gray-500 mt-3">
            ⚠️ <strong>73% of rejections</strong> due to missing documents
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 