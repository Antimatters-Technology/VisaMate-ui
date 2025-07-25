'use client'

import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

export default function StatusPage() {
  const handleWhatsAppNotifications = () => {
    // Open WhatsApp with pre-filled message for notification setup
    const phoneNumber = "+1234567890" // Replace with actual support number
    const message = "Hi! I'd like to set up WhatsApp notifications for my visa application status updates."
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Application Status
              </h1>
              <p className="text-gray-600">
                Track your visa application progress and next steps.
              </p>
            </div>
            <Button
              onClick={handleWhatsAppNotifications}
              className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
              size="lg"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Notifications
            </Button>
          </div>
        </div>

        {/* Application Status Cards */}
        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Application Progress</CardTitle>
                <Badge variant="outline">In Progress</Badge>
              </div>
              <CardDescription>
                Your application is being processed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                  <div>
                    <h3 className="font-semibold">Personal Information Completed</h3>
                    <p className="text-sm text-gray-600">All required personal details provided</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                  <div>
                    <h3 className="font-semibold">Documents Uploaded</h3>
                    <p className="text-sm text-gray-600">Required documents have been submitted</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">!</div>
                  <div>
                    <h3 className="font-semibold">Expert Review Pending</h3>
                    <p className="text-sm text-gray-600">Complete your application for expert validation</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-500">IRCC Submission</h3>
                    <p className="text-sm text-gray-500">Submit to Immigration Canada</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>
                What you need to do to complete your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <div className="text-yellow-600 text-xl">⚠️</div>
                  <div>
                    <h3 className="font-semibold text-yellow-800">Complete Application Review</h3>
                    <p className="text-sm text-yellow-700">
                      Get expert validation to ensure 100% IRCC compliance before submission
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="text-blue-600 text-xl">💡</div>
                  <div>
                    <h3 className="font-semibold text-blue-800">Document Verification</h3>
                    <p className="text-sm text-blue-700">
                      AI analysis will check for missing documents and formatting issues
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Notifications Info */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                WhatsApp Notifications
              </CardTitle>
              <CardDescription className="text-green-700">
                Stay updated with real-time application status notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Instant notifications when your application status changes
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Document approval/rejection alerts
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Important deadline reminders
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  IRCC submission confirmations
                </div>
                <Button
                  onClick={handleWhatsAppNotifications}
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Enable WhatsApp Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 