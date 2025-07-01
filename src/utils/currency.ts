// Currency formatting utilities

export function formatCurrency(
  amount: number, 
  currency: string = 'CAD', 
  locale: string = 'en-CA'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function parseCurrency(value: string): number {
  // Remove currency symbols and parse to number
  const cleaned = value.replace(/[^0-9.-]+/g, '')
  return parseFloat(cleaned) || 0
}

export const CURRENCIES = {
  CAD: { symbol: '$', name: 'Canadian Dollar' },
  USD: { symbol: '$', name: 'US Dollar' },
  AUD: { symbol: '$', name: 'Australian Dollar' },
  GBP: { symbol: '£', name: 'British Pound' },
  EUR: { symbol: '€', name: 'Euro' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
} as const

export type SupportedCurrency = keyof typeof CURRENCIES 