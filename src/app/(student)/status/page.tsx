import { Header } from '@/components/layout/Header'
import { CompletionBanner } from '@/features/documents/CompletionBanner'
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
            Track your visa application progress and next steps.
          </p>
        </div>

        {/* Application Status Cards */}
        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Application Progress</CardTitle>
                <Badge variant="outline">In Progress</Badge>
              </div>
              <CardDescription>
                Your application is being processed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                  <div>
                    <h3 className="font-semibold">Personal Information Completed</h3>
                    <p className="text-sm text-gray-600">All required personal details provided</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                  <div>
                    <h3 className="font-semibold">Documents Uploaded</h3>
                    <p className="text-sm text-gray-600">Required documents have been submitted</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">!</div>
                  <div>
                    <h3 className="font-semibold">Expert Review Pending</h3>
                    <p className="text-sm text-gray-600">Complete your application for expert validation</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-500">IRCC Submission</h3>
                    <p className="text-sm text-gray-500">Submit to Immigration Canada</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>
                What you need to do to complete your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <div className="text-yellow-600 text-xl">⚠️</div>
                  <div>
                    <h3 className="font-semibold text-yellow-800">Complete Application Review</h3>
                    <p className="text-sm text-yellow-700">
                      Get expert validation to ensure 100% IRCC compliance before submission
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="text-blue-600 text-xl">💡</div>
                  <div>
                    <h3 className="font-semibold text-blue-800">Document Verification</h3>
                    <p className="text-sm text-blue-700">
                      AI analysis will check for missing documents and formatting issues
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Completion Banner */}
        <CompletionBanner
          showWhenEmpty={true}
          title="Ready to Complete Your Application?"
          subtitle="Get expert review and validation to ensure your application meets all IRCC requirements."
          buttonText="Complete Application Review - $149 CAD"
        />
      </div>
    </div>
  )
} 