// Date formatting and manipulation utilities

import { format, parseISO, isValid, addDays, differenceInDays } from 'date-fns'

export function formatDate(date: string | Date, pattern: string = 'MMM dd, yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return 'Invalid date'
    return format(dateObj, pattern)
  } catch {
    return 'Invalid date'
  }
}

export function formatRelativeDate(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return 'Invalid date'
    
    const now = new Date()
    const days = differenceInDays(now, dateObj)
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    if (days < 365) return `${Math.floor(days / 30)} months ago`
    return `${Math.floor(days / 365)} years ago`
  } catch {
    return 'Invalid date'
  }
}

export function addBusinessDays(date: Date, days: number): Date {
  let result = new Date(date)
  let daysToAdd = days
  
  while (daysToAdd > 0) {
    result = addDays(result, 1)
    if (result.getDay() !== 0 && result.getDay() !== 6) { // Not weekend
      daysToAdd--
    }
  }
  
  return result
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function getAge(birthDate: string | Date): number {
  try {
    const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate
    if (!isValid(birth)) return 0
    
    const today = new Date()
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1
    }
    
    return age
  } catch {
    return 0
  }
} 