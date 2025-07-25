'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import { useRazorpay } from '@/hooks/useRazorpay'
import { PaymentData } from '@/types/razorpay'

const COMPLETION_SERVICE = {
  id: 'application_completion',
  name: 'Complete Your Application',
  price: 149,
  currency: 'CAD',
  description: 'Expert review and refinement of your visa application with 100% trust guarantee'
}

export function CompletionPaymentPage() {
  const { initiatePayment, isLoading } = useRazorpay()

  const handlePayment = () => {
    const paymentData: PaymentData = {
      amount: COMPLETION_SERVICE.price,
      currency: COMPLETION_SERVICE.currency,
      description: COMPLETION_SERVICE.description,
      applicationFee: COMPLETION_SERVICE.name
    }

    initiatePayment(paymentData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Indicator */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
              <span className="text-sm font-medium">Documents Uploaded</span>
            </div>
            <div className="w-16 h-1 bg-gray-300 rounded"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
              <span className="text-sm font-medium text-blue-600">Complete Application</span>
            </div>
            <div className="w-16 h-1 bg-gray-300 rounded"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-bold">3</div>
              <span className="text-sm text-gray-500">Submit to IRCC</span>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
            <Badge variant="secondary" className="mb-4 bg-yellow-400 text-yellow-900">
              🎯 FINAL STEP
            </Badge>
            <h1 className="text-3xl font-bold mb-2">
              Ready to Submit Your Perfect Application?
            </h1>
            <p className="text-lg opacity-90">
              You've uploaded your documents. Now let our experts ensure <strong>zero mistakes</strong> and <strong>100% IRCC compliance</strong>.
            </p>
          </div>

          <CardContent className="p-8">
            {/* What Happens Next */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-center">What happens when you complete your application:</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold text-blue-800">AI Document Analysis</h3>
                    <p className="text-blue-600 text-sm">Our AI scans for missing documents, formatting issues, and compliance problems</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold text-green-800">Expert Human Review</h3>
                    <p className="text-green-600 text-sm">Immigration experts manually review your entire application package</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-purple-800">Refinement & Optimization</h3>
                    <p className="text-purple-600 text-sm">We refine, format, and optimize every document for maximum approval chances</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                  <div>
                    <h3 className="font-semibold text-yellow-800">100% Trust Guarantee</h3>
                    <p className="text-yellow-600 text-sm">We guarantee your application meets all IRCC requirements or your money back</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Urgency Section */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
              <div className="flex items-center">
                <div className="text-red-400 text-2xl mr-3">⚠️</div>
                <div>
                  <h3 className="font-bold text-red-800">Don't Risk Rejection!</h3>
                  <p className="text-red-700 text-sm">
                    <strong>73% of visa rejections</strong> happen due to missing or incorrect documents. 
                    Complete your application properly the first time.
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl p-6 mb-6">
                <h2 className="text-2xl font-bold mb-2">Complete Your Application</h2>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold">${COMPLETION_SERVICE.price}</span>
                  <span className="text-lg opacity-80">{COMPLETION_SERVICE.currency}</span>
                </div>
                <p className="opacity-90">One-time payment • Lifetime guarantee</p>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isLoading}
                size="lg"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold text-xl py-6 rounded-xl shadow-lg transform transition hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    🚀 Complete My Application with 100% Trust - ${COMPLETION_SERVICE.price} {COMPLETION_SERVICE.currency}
                  </>
                )}
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="text-center space-y-2 text-sm text-gray-600">
              <div className="flex justify-center items-center gap-6">
                <span className="flex items-center gap-1">
                  <span className="text-green-500">🔒</span>
                  Secure Payment
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-blue-500">✅</span>
                  IRCC Compliant
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-purple-500">🛡️</span>
                  Money-back Guarantee
                </span>
              </div>
              <p>Over 2,800+ successful applications • 98.5% approval rate</p>
            </div>
          </CardContent>
        </Card>

        {/* Social Proof */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">⭐</span>
              ))}
              <span className="ml-2 font-bold">4.9/5</span>
            </div>
            <p className="text-sm text-gray-600">
              "VisaMate found 2 missing documents I didn't know I needed. Got approved on first try!" 
              <span className="font-semibold"> - Sarah M., Study Permit</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 