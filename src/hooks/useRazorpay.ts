'use client'

import { useState, useCallback } from 'react'
import { RazorpayOptions, RazorpayResponse, PaymentData } from '@/types/razorpay'

// Razorpay Test Mode Configuration
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_vquo4p6T3BJXM8' // Your actual test key
const COMPANY_NAME = 'VisaMate'

export function useRazorpay() {
  const [isLoading, setIsLoading] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  // Load Razorpay script dynamically
  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (isScriptLoaded || window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        setIsScriptLoaded(true)
        resolve(true)
      }
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }, [isScriptLoaded])

  // Initialize payment
  const initiatePayment = useCallback(async (paymentData: PaymentData) => {
    setIsLoading(true)

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script')
      }

      // Convert amount to paise (Razorpay expects amount in smallest currency unit)
      const amountInPaise = Math.round(paymentData.amount * 100)

      const options: RazorpayOptions = {
        key: RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency: paymentData.currency,
        name: COMPANY_NAME,
        description: paymentData.description,
        handler: (response: RazorpayResponse) => {
          handlePaymentSuccess(response, paymentData)
        },
        prefill: {
          name: 'Applicant Name',
          email: 'applicant@example.com',
          contact: '+1234567890'
        },
        theme: {
          color: '#3B82F6' // Blue theme
        },
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user')
            setIsLoading(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      console.error('Payment initiation failed:', error)
      setIsLoading(false)
      alert('Failed to initiate payment. Please try again.')
    }
  }, [loadRazorpayScript])

  // Handle successful payment
  const handlePaymentSuccess = useCallback((response: RazorpayResponse, paymentData: PaymentData) => {
    console.log('Payment successful:', response)
    
    // Here you would typically:
    // 1. Send payment details to your backend
    // 2. Verify the payment
    // 3. Update the application status
    
    alert(`Payment Successful! 
Payment ID: ${response.razorpay_payment_id}
Amount: ${paymentData.currency} ${paymentData.amount}
For: ${paymentData.applicationFee}`)
    
    setIsLoading(false)
  }, [])

  return {
    initiatePayment,
    isLoading,
    isScriptLoaded
  }
} 