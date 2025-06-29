'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import { useRazorpay } from '@/hooks/useRazorpay'
import { PaymentData } from '@/types/razorpay'

const PREMIUM_PACKAGE = {
  id: 'visamate_premium',
  name: 'VisaMate Premium Complete Service',
  originalPrice: 299,
  discountedPrice: 199,
  currency: 'CAD',
  description: 'Complete visa application service with document refinement, expert review, and 100% trust guarantee'
}

const FEATURES = [
  {
    icon: '🎯',
    title: 'Document Perfection',
    description: 'AI-powered document analysis ensures every requirement is met'
  },
  {
    icon: '🔍',
    title: 'Expert Review',
    description: 'Immigration experts review your entire application'
  },
  {
    icon: '✅',
    title: 'Zero Missed Documents',
    description: '100% guarantee that no required documents are overlooked'
  },
  {
    icon: '⚡',
    title: 'Fast Processing',
    description: 'Get your application ready 3x faster than traditional methods'
  },
  {
    icon: '🛡️',
    title: 'Success Guarantee',
    description: 'We guarantee your application meets all IRCC requirements'
  },
  {
    icon: '💬',
    title: 'Priority Support',
    description: '24/7 expert support throughout your application journey'
  }
]

const TESTIMONIALS = [
  {
    name: 'Priya S.',
    country: 'India',
    text: 'VisaMate found 3 documents I missed. Got my study permit approved on first try!',
    rating: 5
  },
  {
    name: 'Ahmed K.',
    country: 'Egypt',
    text: 'Worth every penny. The expert review caught errors that would have caused rejection.',
    rating: 5
  },
  {
    name: 'Maria L.',
    country: 'Brazil',
    text: 'Saved me months of back-and-forth. My PR application was perfect!',
    rating: 5
  }
]

export function PremiumPaymentPage() {
  const { initiatePayment, isLoading } = useRazorpay()
  const [selectedPlan, setSelectedPlan] = useState('premium')

  const handlePremiumPayment = () => {
    const paymentData: PaymentData = {
      amount: PREMIUM_PACKAGE.discountedPrice,
      currency: PREMIUM_PACKAGE.currency,
      description: PREMIUM_PACKAGE.description,
      applicationFee: PREMIUM_PACKAGE.name
    }

    initiatePayment(paymentData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-yellow-400 text-yellow-900">
              🎉 LIMITED TIME: 33% OFF
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Visa Success,
              <span className="block text-yellow-300">Guaranteed.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              You've uploaded your documents. Now let our experts ensure <span className="font-bold text-yellow-300">zero mistakes</span>, 
              <span className="font-bold text-yellow-300"> no missed documents</span>, and <span className="font-bold text-yellow-300">100% IRCC compliance</span>.
            </p>
            <div className="flex items-center justify-center gap-4 text-lg">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <strong>2,847</strong> successful applications
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <strong>98.5%</strong> approval rate
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Problem/Solution Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
              <span className="text-3xl mr-3">❌</span>
              Without VisaMate Premium
            </h3>
            <ul className="space-y-3 text-red-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Risk missing critical documents (70% of rejections)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Months of delays and resubmissions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Stress and uncertainty about application quality</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Lost time, money, and opportunities</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
              <span className="text-3xl mr-3">✅</span>
              With VisaMate Premium
            </h3>
            <ul className="space-y-3 text-green-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Zero missed documents</strong> - AI + Expert review</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>First-time approval</strong> - 98.5% success rate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Peace of mind</strong> - Expert validation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Fast-track to Canada</strong> - No delays</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            What You Get with VisaMate Premium
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4 bg-yellow-400 text-yellow-900 text-lg px-4 py-2">
              ⏰ LIMITED TIME OFFER
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Complete Your Application with Confidence
            </h2>
            <p className="text-xl mb-8 opacity-90">
              After uploading your documents, ensure <strong>100% accuracy</strong> and <strong>zero missed requirements</strong>
            </p>
            
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 max-w-lg mx-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-3xl line-through opacity-60">${PREMIUM_PACKAGE.originalPrice}</span>
                <span className="text-5xl font-bold text-yellow-300">${PREMIUM_PACKAGE.discountedPrice}</span>
                <Badge variant="destructive" className="bg-red-500">
                  Save $100
                </Badge>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{PREMIUM_PACKAGE.name}</h3>
              <p className="mb-6 opacity-90">One-time payment • Lifetime guarantee</p>
              
              <Button
                onClick={handlePremiumPayment}
                disabled={isLoading}
                size="lg"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-xl py-4 rounded-xl shadow-lg transform transition hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-yellow-900 border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    🚀 Secure My Visa Success Now - ${PREMIUM_PACKAGE.discountedPrice} CAD
                  </>
                )}
              </Button>
              
              <p className="text-sm mt-4 opacity-75">
                🔒 Secure payment • 30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Join 2,847+ Successful Visa Applicants
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.country}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-4">
            Don't Risk Your Dream of Coming to Canada
          </h2>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            You've already done the hard work of gathering documents. Now ensure they're <strong>perfect</strong> and get your visa approved on the first try.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-lg">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <strong>No missed documents</strong>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <strong>Expert validation</strong>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <strong>100% trust guarantee</strong>
            </span>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-12 text-center text-gray-500">
          <div className="flex flex-wrap justify-center items-center gap-8 mb-4">
            <span className="flex items-center gap-2">
              <span className="text-green-500">🔒</span>
              256-bit SSL Encryption
            </span>
            <span className="flex items-center gap-2">
              <span className="text-blue-500">✅</span>
              IRCC Compliant
            </span>
            <span className="flex items-center gap-2">
              <span className="text-purple-500">🛡️</span>
              Money-back Guarantee
            </span>
          </div>
          <p className="text-sm">
            Trusted by immigration experts • Processed through secure Razorpay payment gateway
          </p>
        </div>
      </div>
    </div>
  )
} 