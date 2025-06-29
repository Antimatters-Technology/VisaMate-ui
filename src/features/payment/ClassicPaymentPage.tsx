'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import { useRazorpay } from '@/hooks/useRazorpay'
import { PaymentData } from '@/types/razorpay'
import { useDocuments } from '@/stores/documents'

export function ClassicPaymentPage() {
  const { initiatePayment, isLoading } = useRazorpay()
  const { documents } = useDocuments()
  
  const completedDocs = documents.filter(doc => doc.status === 'completed').length

  const handlePayment = () => {
    const paymentData: PaymentData = {
      amount: 1000,
      currency: 'INR',
      description: 'VisaMate Complete Application Review Service',
      applicationFee: 'Application Review'
    }

    initiatePayment(paymentData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Complete Your Application
          </h1>
                     <p className="opacity-90">
             You've completed your document uploads. Now get expert review for 100% IRCC compliance.
           </p>
        </div>

        <CardContent className="p-6">
          {/* What You Get */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="text-gray-700">AI document analysis for missing files</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="text-gray-700">Expert immigration review</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="text-gray-700">100% IRCC compliance guarantee</span>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-amber-600 text-lg">⚠️</span>
              <div>
                <p className="text-amber-800 font-medium text-sm">Don't Risk Rejection</p>
                <p className="text-amber-700 text-xs">73% of rejections happen due to missing documents</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">₹1,000</span>
            </div>
            <p className="text-sm text-gray-600">One-time payment • Money-back guarantee</p>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              '🚀 Complete My Application'
            )}
          </Button>

          {/* Trust Signals */}
          <div className="mt-6 text-center">
            <div className="flex justify-center items-center gap-4 text-xs text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                <span className="text-green-500">🔒</span>
                Secure Payment
              </span>
              <span className="flex items-center gap-1">
                <span className="text-blue-500">✅</span>
                2,800+ Success
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              98.5% Approval Rate
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 