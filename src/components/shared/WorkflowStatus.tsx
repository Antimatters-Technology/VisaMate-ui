'use client'

import { CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useStudentProfile } from '@/stores/student-profile'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function WorkflowStatus() {
  const { profile } = useStudentProfile()
  const pathname = usePathname()

  // Only show on specific student workflow pages
  const allowedPages = ['/documents', '/consultants', '/wizard', '/payment', '/status']
  const shouldShow = allowedPages.some(page => pathname.includes(page))
  
  if (!shouldShow) {
    return null
  }

  if (!profile.documents.length && !profile.selectedConsultant) {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-white shadow-lg border-green-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-green-800">Application Progress</h3>
          
          <div className="space-y-2">
            {/* Documents uploaded */}
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">
                Documents uploaded ({profile.documents.length})
              </span>
            </div>

            {/* Consultant selection */}
            {profile.selectedConsultant ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">
                  Selected: {profile.selectedConsultant.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-gray-700">
                  Choose consultant next
                </span>
              </div>
            )}

            {/* Application status */}
            {profile.applicationStatus === 'profile_created' && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  ✅ Profile added to consultant dashboard!
                </span>
              </div>
            )}
          </div>

          {/* Next action */}
          {!profile.selectedConsultant ? (
            <Link href="/consultants">
              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                <ArrowRight className="w-4 h-4 mr-2" />
                Choose Consultant
              </Button>
            </Link>
          ) : profile.applicationStatus === 'profile_created' ? (
            <p className="text-xs text-green-600 text-center">
              {profile.selectedConsultant.name} will contact you within 24 hours
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
} 