'use client'

import { CheckCircle2, Clock, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useStudentProfile } from '@/stores/student-profile'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export function WorkflowStatus() {
  const { profile } = useStudentProfile()
  const pathname = usePathname()
  const [showSuccessCard, setShowSuccessCard] = useState(false)
  const [isSuccessCardVisible, setIsSuccessCardVisible] = useState(false)

  // Only show regular workflow card on consultants page
  const shouldShow = pathname.includes('/consultants')
  
  // Track when profile is created and show success card only on consultants page
  useEffect(() => {
    if (profile.applicationStatus === 'profile_created' && pathname.includes('/consultants')) {
      setShowSuccessCard(true)
      setIsSuccessCardVisible(true)
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setIsSuccessCardVisible(false)
        // Wait for fade out animation before hiding completely
        setTimeout(() => {
          setShowSuccessCard(false)
        }, 300) // Match the transition duration
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [profile.applicationStatus, pathname])

  // Manual dismiss function
  const handleDismiss = () => {
    setIsSuccessCardVisible(false)
    setTimeout(() => {
      setShowSuccessCard(false)
    }, 300)
  }

  if (!shouldShow) {
    return null
  }

  if (!profile.documents.length && !profile.selectedConsultant) {
    return null
  }

  // Show success card only when consultant is selected and on consultants page
  if (showSuccessCard && profile.selectedConsultant) {
    return (
      <Card className={`fixed bottom-4 right-4 w-80 z-50 bg-green-50 shadow-lg border-green-200 transition-all duration-300 ${
        isSuccessCardVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
      }`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-sm text-green-800">Application Progress</h3>
              <button 
                onClick={handleDismiss}
                className="text-green-600 hover:text-green-800 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              {/* Documents uploaded */}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">
                  Documents uploaded ({profile.documents.length})
                </span>
              </div>

              {/* Consultant selection */}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">
                  Selected: {profile.selectedConsultant.name}
                </span>
              </div>

              {/* Success message */}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  ✅ Profile added to consultant dashboard!
                </span>
              </div>
            </div>

            {/* Contact message */}
            <p className="text-xs text-green-600 text-center bg-green-100 rounded p-2">
              {profile.selectedConsultant.name} will contact you within 24 hours
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Regular workflow status card
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
          </div>

          {/* Next action */}
          {!profile.selectedConsultant ? (
            <Link href="/consultants">
              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                <ArrowRight className="w-4 h-4 mr-2" />
                Choose Consultant
              </Button>
            </Link>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
} 