import React, { createContext, useContext, useState, useEffect } from 'react'

interface I18nContextType {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string, params?: Record<string, string>) => string
  availableLocales: string[]
}

const I18nContext = createContext<I18nContextType | null>(null)

interface I18nProviderProps {
  children: React.ReactNode
}

const AVAILABLE_LOCALES = ['en', 'pa', 'gu', 'hn']
const DEFAULT_LOCALE = 'en'

// Simple translations store - in production, this would load from files
const translations: Record<string, Record<string, string>> = {
  en: {
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'nav.wizard': 'Wizard',
    'nav.documents': 'Documents',
    'nav.status': 'Status',
    'wizard.title': 'Visa Application Wizard',
    'documents.title': 'Document Management',
    'status.title': 'Application Status'
  },
  pa: {
    'common.loading': 'ਲੋਡ ਕਰ ਰਿਹਾ ਹੈ...',
    'common.error': 'ਗਲਤੀ',
    'common.success': 'ਸਫਲਤਾ',
    'nav.wizard': 'ਵਿਜ਼ਾਰਡ',
    'nav.documents': 'ਦਸਤਾਵੇਜ਼',
    'nav.status': 'ਸਥਿਤੀ',
    'wizard.title': 'ਵੀਜ਼ਾ ਅਪਲੀਕੇਸ਼ਨ ਵਿਜ਼ਾਰਡ',
    'documents.title': 'ਦਸਤਾਵੇਜ਼ ਪ੍ਰਬੰਧਨ',
    'status.title': 'ਅਪਲੀਕੇਸ਼ਨ ਸਥਿਤੀ'
  },
  gu: {
    'common.loading': 'લોડ કરી રહ્યું છે...',
    'common.error': 'ભૂલ',
    'common.success': 'સફળતા',
    'nav.wizard': 'વિઝાર્ડ',
    'nav.documents': 'દસ્તાવેજો',
    'nav.status': 'સ્થિતિ',
    'wizard.title': 'વિઝા એપ્લિકેશન વિઝાર્ડ',
    'documents.title': 'દસ્તાવેજ વ્યવસ્થાપન',
    'status.title': 'એપ્લિકેશન સ્થિતિ'
  },
  hn: {
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'nav.wizard': 'विज़ार्ड',
    'nav.documents': 'दस्तावेज़',
    'nav.status': 'स्थिति',
    'wizard.title': 'वीज़ा आवेदन विज़ार्ड',
    'documents.title': 'दस्तावेज़ प्रबंधन',
    'status.title': 'आवेदन स्थिति'
  }
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE)

  useEffect(() => {
    // Load saved locale from localStorage
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('preferred-locale')
      if (savedLocale && AVAILABLE_LOCALES.includes(savedLocale)) {
        setLocaleState(savedLocale)
      } else {
        // Detect browser locale
        const browserLocale = navigator.language.split('-')[0]
        if (AVAILABLE_LOCALES.includes(browserLocale)) {
          setLocaleState(browserLocale)
        }
      }
    }
  }, [])

  const setLocale = (newLocale: string) => {
    if (AVAILABLE_LOCALES.includes(newLocale)) {
      setLocaleState(newLocale)
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred-locale', newLocale)
      }
    }
  }

  const t = (key: string, params?: Record<string, string>): string => {
    const localeTranslations = translations[locale] || translations[DEFAULT_LOCALE]
    let translation = localeTranslations[key] || key

    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, value)
      })
    }

    return translation
  }

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    availableLocales: AVAILABLE_LOCALES
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
} 