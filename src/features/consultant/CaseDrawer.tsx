'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { formatDateSafe } from '@/utils/date'

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
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getDocumentStatus = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'missing':
        return <Badge className="bg-red-100 text-red-800">Missing</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Client Info */}
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>
            Case #{caseData.id} - {caseData.program}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <p className="text-sm">{caseData.clientName}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm">{caseData.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <p className="text-sm">{caseData.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Country</label>
              <p className="text-sm">{caseData.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
          <CardDescription>
            Current application status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm">{caseData.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${caseData.progress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>
            Application milestones and next steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {caseData.timeline.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
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
                      Uploaded: {formatDateSafe(doc.uploadedAt)}
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