'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

export function Header() {
  const { isAuthenticated, user, signIn, signUp, signOut, isLoading, error } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)

  const handleSignIn = () => {
    setIsSigningIn(true)
    try {
      signIn()
      // The page will redirect, so we don't need to reset the loading state
    } catch (err) {
      console.error('Sign in failed:', err)
      setIsSigningIn(false)
    }
  }

  const handleSignUp = () => {
    setIsSigningUp(true)
    try {
      signUp()
      // The page will redirect, so we don't need to reset the loading state
    } catch (err) {
      console.error('Sign up failed:', err)
      setIsSigningUp(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">VisaMate</span>
            <Badge variant="secondary" className="text-xs">Beta</Badge>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/documents"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Documents & Application
            </Link>
            <Link
              href="/consultants"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Consultants
            </Link>
            <Link
              href="/status"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Status
            </Link>
            <Link
              href="/payment"
              className="transition-colors hover:bg-blue-700 flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium"
            >
              🚀 Complete Application
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search component would go here */}
          </div>
          <nav className="flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.email}
                </span>
                <Button 
                  variant="outline" 
                  className="h-8 px-3 text-sm"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="default" 
                  className="h-8 px-3 text-sm"
                  onClick={handleSignIn}
                  disabled={isSigningIn || isLoading}
                >
                  {isSigningIn ? 'Signing In...' : 'Sign In'}
                </Button>
                <Button 
                  variant="outline" 
                  className="h-8 px-3 text-sm"
                  onClick={handleSignUp}
                  disabled={isSigningUp || isLoading}
                >
                  {isSigningUp ? 'Signing Up...' : 'Sign Up'}
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </header>
  )
} 