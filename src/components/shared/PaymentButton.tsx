'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useRazorpay } from '@/hooks/useRazorpay'
import { PaymentData } from '@/types/razorpay'

interface PaymentButtonProps {
  amount: number
  currency?: string
  description: string
  applicationFee: string
  buttonText?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  disabled?: boolean
  onSuccess?: (paymentId: string) => void
  onError?: (error: string) => void
}

export function PaymentButton({
  amount,
  currency = 'CAD',
  description,
  applicationFee,
  buttonText,
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false,
  onSuccess,
  onError
}: PaymentButtonProps) {
  const { initiatePayment, isLoading } = useRazorpay()

  const handleClick = async () => {
    try {
      const paymentData: PaymentData = {
        amount,
        currency,
        description,
        applicationFee
      }

      // Override success handler if provided
      if (onSuccess || onError) {
        // Custom payment flow - you'd need to modify useRazorpay to accept callbacks
        await initiatePayment(paymentData)
      } else {
        // Default payment flow
        await initiatePayment(paymentData)
      }
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error.message : 'Payment failed')
      }
    }
  }

  const displayText = buttonText || `Pay $${amount} ${currency}`

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Processing...
        </div>
      ) : (
        displayText
      )}
    </Button>
  )
} 