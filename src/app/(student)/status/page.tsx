import { Header } from '@/components/layout/Header'
import { EligibilityCard } from '@/features/eligibility/EligibilityCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Application Status
          </h1>
          <p className="text-gray-600">
            Track your visa application progress and eligibility.
          </p>
        </div>
        
        <div className="space-y-6">
          <EligibilityCard />
          
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
              <CardDescription>
                Current status and next steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge variant="default">Completed</Badge>
                  <span>Initial Assessment</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="default">Completed</Badge>
                  <span>Document Collection</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">In Progress</Badge>
                  <span>Application Review</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">Pending</Badge>
                  <span>Submission</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 