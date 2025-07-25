'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import { useToast } from '@/hooks/use-toast'

interface WhatsAppSetupProps {
  sessionId?: string
  phoneNumber?: string
}

export function WhatsAppSetup({ sessionId, phoneNumber }: WhatsAppSetupProps) {
  const [isActivated, setIsActivated] = useState(false)
  const { toast } = useToast()

  const handleActivateWhatsApp = async () => {
    try {
      if (!phoneNumber) {
        toast({
          title: "Phone Number Required",
          description: "Please add your WhatsApp number in the wizard first.",
          variant: "destructive"
        })
        return
      }

      // Send activation message to user
      const response = await fetch('/api/whatsapp/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber, 
          sessionId 
        })
      })

      if (response.ok) {
        setIsActivated(true)
        toast({
          title: "WhatsApp Activated! 🎉",
          description: "Check your WhatsApp for setup instructions.",
        })
      } else {
        throw new Error('Activation failed')
      }
    } catch (error) {
      toast({
        title: "Activation Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      })
    }
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+1 555 0123'

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">📱</span>
          </div>
          <div>
            <CardTitle className="text-lg">WhatsApp Document Upload</CardTitle>
            <p className="text-sm text-gray-600">Upload documents directly via WhatsApp</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isActivated ? (
          <>
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold mb-2">🚀 How it works:</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Send photos/PDFs directly to our WhatsApp</li>
                <li>• Auto-categorization with AI</li>
                <li>• Real-time status updates</li>
                <li>• Multi-language support (Hindi, English, Punjabi, Gujarati)</li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <span className="text-amber-600">💡</span>
                <div className="text-sm">
                  <p className="font-medium text-amber-800">Pro Tip:</p>
                  <p className="text-amber-700">Add document names in captions for auto-categorization!</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleActivateWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              📱 Activate WhatsApp Upload
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
              <div className="text-green-600 text-xl mb-2">✅</div>
              <h3 className="font-semibold text-green-800">WhatsApp Activated!</h3>
              <p className="text-sm text-green-700 mt-1">
                Send documents to: <strong>{whatsappNumber}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3 border">
                <div className="text-blue-600 text-lg mb-1">📤</div>
                <h4 className="font-semibold">Send STATUS</h4>
                <p className="text-gray-600 text-xs">Check progress</p>
              </div>
              <div className="bg-white rounded-lg p-3 border">
                <div className="text-purple-600 text-lg mb-1">📋</div>
                <h4 className="font-semibold">Send LIST</h4>
                <p className="text-gray-600 text-xs">Required docs</p>
              </div>
              <div className="bg-white rounded-lg p-3 border">
                <div className="text-orange-600 text-lg mb-1">🆘</div>
                <h4 className="font-semibold">Send HELP</h4>
                <p className="text-gray-600 text-xs">Get assistance</p>
              </div>
              <div className="bg-white rounded-lg p-3 border">
                <div className="text-green-600 text-lg mb-1">📎</div>
                <h4 className="font-semibold">Send Files</h4>
                <p className="text-gray-600 text-xs">Upload docs</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Badge variant="outline" className="text-green-600 border-green-300">
                ✓ Active
              </Badge>
              <a 
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  💬 Open WhatsApp
                </Button>
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 