'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'

export function Header() {
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
              href="/wizard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Wizard
            </Link>
            <Link
              href="/documents"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Documents
            </Link>
            <Link
              href="/status"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Status
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search component would go here */}
          </div>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm">
              Get Started
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
} 