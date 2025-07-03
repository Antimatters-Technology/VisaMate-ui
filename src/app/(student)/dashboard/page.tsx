'use client'

import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/landing')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to your Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Hello {user?.email}, manage your visa application process from here.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  Upload and manage your visa documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/documents">
                  <Button className="w-full">
                    Manage Documents
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>
                  Check your current application progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/status">
                  <Button variant="outline" className="w-full">
                    View Status
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Consultants</CardTitle>
                <CardDescription>
                  Connect with visa experts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/consultants">
                  <Button variant="outline" className="w-full">
                    Find Consultants
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>
                  Complete your application payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/payment">
                  <Button variant="outline" className="w-full">
                    Make Payment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Authentication Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>User ID:</strong> {user?.sub}</p>
                <p><strong>Token Expires:</strong> {user?.tokenExpiry ? new Date(user.tokenExpiry).toLocaleString() : 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 