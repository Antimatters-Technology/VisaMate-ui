import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/button'

interface CaseDrawerProps {
  caseId: string
}

export function CaseDrawer({ caseId }: CaseDrawerProps) {
  // Mock data - in production, this would come from API
  const caseData = {
    id: caseId,
    clientName: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    country: 'Canada',
    program: 'Express Entry',
    status: 'in-progress',
    progress: 65,
    timeline: [
      { date: '2024-01-15', event: 'Application Started', status: 'completed' },
      { date: '2024-01-16', event: 'Documents Uploaded', status: 'completed' },
      { date: '2024-01-18', event: 'Initial Review', status: 'completed' },
      { date: '2024-01-20', event: 'Language Test Scheduled', status: 'in-progress' },
      { date: '2024-01-25', event: 'Final Review', status: 'pending' },
      { date: '2024-01-30', event: 'Submission', status: 'pending' }
    ],
    documents: [
      { name: 'Passport.pdf', status: 'verified', uploadedAt: '2024-01-16' },
      { name: 'Educational_Certificates.pdf', status: 'verified', uploadedAt: '2024-01-16' },
      { name: 'Work_Experience.pdf', status: 'pending', uploadedAt: '2024-01-17' },
      { name: 'Language_Test.pdf', status: 'missing', uploadedAt: null }
    ]
  }

  const getTimelineStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'in-progress':
        return <Badge variant="warning">In Progress</Badge>
      case 'pending':
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getDocumentStatus = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="success">Verified</Badge>
      case 'pending':
        return <Badge variant="warning">Pending Review</Badge>
      case 'missing':
        return <Badge variant="destructive">Missing</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-sm">{caseData.clientName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-sm">{caseData.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-sm">{caseData.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Target Country</label>
              <p className="text-sm">{caseData.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Application Timeline</CardTitle>
          <CardDescription>
            Progress: {caseData.progress}% complete
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {caseData.timeline.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-l-2 border-gray-200 pl-4">
                <div>
                  <p className="font-medium text-sm">{item.event}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                {getTimelineStatus(item.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            Client uploaded documents and verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {caseData.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{doc.name}</p>
                  {doc.uploadedAt && (
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getDocumentStatus(doc.status)}
                  {doc.status === 'verified' && (
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 