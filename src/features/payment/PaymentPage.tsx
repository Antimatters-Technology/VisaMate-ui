'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRazorpay } from '@/hooks/useRazorpay'
import { PaymentData } from '@/types/razorpay'

// IRCC Application Fee Structure
const IRCC_FEES = [
  {
    id: 'study_permit',
    name: 'Study Permit',
    amount: 150,
    currency: 'CAD',
    description: 'IRCC Study Permit Application Fee'
  },
  {
    id: 'work_permit',
    name: 'Work Permit',
    amount: 155,
    currency: 'CAD',
    description: 'IRCC Work Permit Application Fee'
  },
  {
    id: 'visitor_visa',
    name: 'Visitor Visa',
    amount: 100,
    currency: 'CAD',
    description: 'IRCC Visitor Visa Application Fee'
  },
  {
    id: 'permanent_residence',
    name: 'Permanent Residence',
    amount: 1325,
    currency: 'CAD',
    description: 'IRCC Permanent Residence Application Fee'
  }
]

export function PaymentPage() {
  const { initiatePayment, isLoading } = useRazorpay()

  const handlePayment = (fee: typeof IRCC_FEES[0]) => {
    const paymentData: PaymentData = {
      amount: fee.amount,
      currency: fee.currency,
      description: fee.description,
      applicationFee: fee.name
    }

    initiatePayment(paymentData)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            IRCC Application Fee Payment
          </h1>
          <p className="text-gray-600">
            Pay your Immigration, Refugees and Citizenship Canada (IRCC) application fees securely
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {IRCC_FEES.map((fee) => (
            <Card key={fee.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{fee.name}</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${fee.amount} {fee.currency}
                  </span>
                </CardTitle>
                <CardDescription>{fee.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Application Fee:</span>
                      <span>${fee.amount} {fee.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee:</span>
                      <span>Included</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                      <span>Total Amount:</span>
                      <span>${fee.amount} {fee.currency}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handlePayment(fee)}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    {isLoading ? 'Processing...' : `Pay $${fee.amount} ${fee.currency}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            🔒 Test Mode Active
          </h3>
          <p className="text-yellow-700 text-sm">
            This is running in Razorpay test mode. No real payments will be processed. 
            Use test card numbers for testing:
          </p>
          <div className="mt-2 text-sm text-yellow-700">
            <div><strong>Test Card:</strong> 4111 1111 1111 1111</div>
            <div><strong>CVV:</strong> Any 3 digits</div>
            <div><strong>Expiry:</strong> Any future date</div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Payments are processed securely through Razorpay</p>
          <p>All transactions are encrypted and secure</p>
        </div>
      </div>
    </div>
  )
} 