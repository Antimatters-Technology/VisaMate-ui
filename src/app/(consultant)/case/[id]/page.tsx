import { CaseDrawer } from '@/features/consultant/CaseDrawer'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CaseDetailPageProps {
  params: {
    id: string
  }
}

export default function CaseDetailPage({ params }: CaseDetailPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Case #{params.id}
            </h1>
            <p className="text-gray-600">
              Detailed view and management of client case.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              Export Report
            </Button>
            <Button>
              Update Status
            </Button>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Case Details</CardTitle>
                <CardDescription>
                  Client information and application progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CaseDrawer caseId={params.id} />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common case management tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full">
                  Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full">
                  Request Documents
                </Button>
                <Button variant="outline" className="w-full">
                  Generate Invoice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 