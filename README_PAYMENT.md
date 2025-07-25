# 💳 Razorpay Payment Integration

## Overview
Simple, modular Razorpay integration for IRCC application fee payments in test mode.

## Features
- ✅ **Razorpay Test Mode** - Safe testing environment
- ✅ **Modular Design** - Use payment components anywhere
- ✅ **IRCC Fee Structure** - Pre-configured Canadian immigration fees
- ✅ **Responsive UI** - Works on all devices
- ✅ **TypeScript Support** - Fully typed components

## Quick Start

### 1. Payment Page
Visit: `http://localhost:3000/payment`

### 2. Navbar Button
Click "💳 Payment" in the navigation bar

## Usage Examples

### Basic Payment Button
```tsx
import { PaymentButton } from '@/components/shared/PaymentButton'

function MyComponent() {
  return (
    <PaymentButton
      amount={150}
      currency="CAD"
      description="Study Permit Application Fee"
      applicationFee="Study Permit"
    />
  )
}
```

### Custom Payment Button
```tsx
<PaymentButton
  amount={1325}
  currency="CAD"
  description="Permanent Residence Fee"
  applicationFee="PR Application"
  buttonText="Pay PR Fee Now"
  variant="destructive"
  size="lg"
  onSuccess={(paymentId) => console.log('Payment successful:', paymentId)}
  onError={(error) => console.error('Payment failed:', error)}
/>
```

### Using Payment Hook Directly
```tsx
import { useRazorpay } from '@/hooks/useRazorpay'

function CustomPayment() {
  const { initiatePayment, isLoading } = useRazorpay()
  
  const handlePay = () => {
    initiatePayment({
      amount: 100,
      currency: 'CAD',
      description: 'Visitor Visa Fee',
      applicationFee: 'Visitor Visa'
    })
  }
  
  return <button onClick={handlePay}>Pay Now</button>
}
```

## Configuration

### Razorpay Test Credentials
Update in `src/hooks/useRazorpay.ts`:
```typescript
const RAZORPAY_KEY_ID = 'your_test_key_here'
```

### IRCC Fee Structure
Modify fees in `src/features/payment/PaymentPage.tsx`:
```typescript
const IRCC_FEES = [
  {
    id: 'study_permit',
    name: 'Study Permit',
    amount: 150,
    currency: 'CAD',
    description: 'IRCC Study Permit Application Fee'
  },
  // Add more fees...
]
```

## Test Cards (Razorpay Test Mode)
- **Card Number:** 4111 1111 1111 1111
- **CVV:** Any 3 digits  
- **Expiry:** Any future date
- **Name:** Any name

## File Structure
```
src/
├── components/shared/
│   └── PaymentButton.tsx        # Reusable payment button
├── features/payment/
│   └── PaymentPage.tsx          # Full payment page
├── hooks/
│   └── useRazorpay.ts          # Payment logic hook
├── types/
│   └── razorpay.ts             # TypeScript definitions
└── app/(student)/payment/
    └── page.tsx                # Payment route
```

## Moving Components

### To Different Routes
```tsx
// Move to any page
import { PaymentPage } from '@/features/payment/PaymentPage'

export default function AnyPage() {
  return <PaymentPage />
}
```

### To Different Sections
```tsx
// Add payment anywhere
import { PaymentButton } from '@/components/shared/PaymentButton'

function Sidebar() {
  return (
    <div>
      <h3>Quick Payment</h3>
      <PaymentButton
        amount={150}
        description="Study Permit Fee"
        applicationFee="Study Permit"
        size="sm"
      />
    </div>
  )
}
```

## Going Live
1. Replace test key with production key
2. Update webhook URLs  
3. Remove test mode warnings
4. Add proper error handling
5. Implement payment verification

## Support
- Razorpay Docs: https://razorpay.com/docs/
- Test Dashboard: https://dashboard.razorpay.com/ 