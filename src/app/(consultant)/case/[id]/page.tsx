'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  School, 
  Target, 
  FileText, 
  MessageSquare, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Edit,
  Save,
  X,
  Plus,
  Video,
  Download
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import { Case, Student, CaseActivity } from '@/features/consultant/crm-api'
import { formatDateSafe } from '@/utils/date'

// Mock data - replace with API calls
const mockCaseData = {
  case: {
    id: 1,
    student_id: 1,
    consultant_id: 1,
    title: "Study Permit Application - University of Toronto",
    description: "Master's in Computer Science application for Fall 2024 intake. Student has strong academic background with 7.5 IELTS score and relevant work experience in software development.",
    status: "in_progress",
    priority: "high",
    target_intake: "Fall 2024",
    application_deadline: "2024-03-15T23:59:59Z",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-02-15T10:00:00Z",
    next_action: "Submit SOP draft for review",
    next_action_date: "2024-02-20T10:00:00Z",
    progress_percentage: 65,
    estimated_completion: "2024-03-10T10:00:00Z"
  },
  student: {
    id: 1,
    name: "Arjun Sharma",
    email: "arjun.sharma@gmail.com",
    phone: "+91 9876543210",
    country: "India",
    preferred_language: "Hindi",
    education_level: "Bachelor's in Engineering",
    target_program: "Master's in Computer Science",
    target_institution: "University of Toronto",
    ielts_score: 7.5,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-02-15T10:00:00Z",
    status: "active"
  },
  activities: [
    {
      id: 1,
      case_id: 1,
      activity_type: "consultation",
      title: "Initial Consultation Completed",
      description: "Discussed program requirements, application timeline, and document checklist. Student is well-prepared and motivated.",
      created_at: "2024-01-15T10:00:00Z",
      created_by: "Apple Abroads",
      metadata: { duration: "60 minutes", meeting_type: "video" }
    },
    {
      id: 2,
      case_id: 1,
      activity_type: "document_upload",
      title: "Academic Transcripts Uploaded",
      description: "Student uploaded official transcripts from previous institution. All documents are verified and approved.",
      created_at: "2024-01-18T14:30:00Z",
      created_by: "Arjun Sharma",
      metadata: { file_count: 3, file_types: ["PDF"], total_size: "2.5MB" }
    },
    {
      id: 3,
      case_id: 1,
      activity_type: "status_update",
      title: "Case Status Updated to In Progress",
      description: "All initial documents received and verified. Moving to application preparation phase.",
      created_at: "2024-01-20T09:15:00Z",
      created_by: "Apple Abroads",
      metadata: { previous_status: "new", new_status: "in_progress" }
    },
    {
      id: 4,
      case_id: 1,
      activity_type: "message",
      title: "SOP Guidelines Shared",
      description: "Sent detailed SOP writing guidelines and sample statements to student for reference.",
      created_at: "2024-02-01T11:30:00Z",
      created_by: "Apple Abroads",
      metadata: { message_type: "guidelines", attachments: 2 }
    },
    {
      id: 5,
      case_id: 1,
      activity_type: "document_upload",
      title: "SOP First Draft Received",
      description: "Student submitted first draft of Statement of Purpose. Review in progress.",
      created_at: "2024-02-10T16:45:00Z",
      created_by: "Arjun Sharma",
      metadata: { file_count: 1, file_types: ["DOCX"], version: "v1" }
    }
  ]
}

function getStatusColor(status: string) {
  switch (status) {
    case 'new': return 'bg-blue-100 text-blue-800'
    case 'in_progress': return 'bg-yellow-100 text-yellow-800'
    case 'documents_pending': return 'bg-orange-100 text-orange-800'
    case 'submitted': return 'bg-purple-100 text-purple-800'
    case 'approved': return 'bg-green-100 text-green-800'
    case 'rejected': return 'bg-red-100 text-red-800'
    case 'completed': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function CaseHeader({ caseData, student }: { caseData: any, student: any }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex gap-3">
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message Student
            </Button>
            <Button variant="outline">
              <Video className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Case
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{caseData.title}</h1>
                <p className="text-gray-600 text-lg">{caseData.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={getStatusColor(caseData.status)}>
                  {caseData.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge className={getPriorityColor(caseData.priority)}>
                  {caseData.priority.toUpperCase()} PRIORITY
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <span className="text-gray-500">Target Intake:</span>
                <div className="font-medium">{caseData.target_intake}</div>
              </div>
              <div>
                <span className="text-gray-500">Application Deadline:</span>
                <div className="font-medium">
                  {formatDateSafe(caseData.application_deadline)}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Progress:</span>
                <div className="font-medium">{caseData.progress_percentage}%</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Case Progress</span>
                <span>{caseData.progress_percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${caseData.progress_percentage}%` }}
                />
              </div>
            </div>

            {/* Next Action */}
            {caseData.next_action && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-900">Next Action Required</h3>
                    <p className="text-blue-700">{caseData.next_action}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-600">Due Date</div>
                    <div className="font-medium text-blue-900">
                      {formatDateSafe(caseData.next_action_date)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Student Info Card */}
          <div>
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Student Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-medium text-blue-600">
                      {student.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                      {student.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{student.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>{student.country} • {student.preferred_language}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4 text-gray-400" />
                    <span>{student.education_level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span>{student.target_program}</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="text-sm">
                    <span className="text-gray-500">IELTS Score:</span>
                    <span className="font-medium ml-2">{student.ielts_score}/9.0</span>
                  </div>
                  <div className="text-sm mt-1">
                    <span className="text-gray-500">Target Institution:</span>
                    <div className="font-medium">{student.target_institution}</div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  View Full Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActivityTimeline({ activities }: { activities: any[] }) {
  const [newActivity, setNewActivity] = useState('')
  const [showAddActivity, setShowAddActivity] = useState(false)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <Video className="w-4 h-4 text-blue-600" />
      case 'document_upload': return <Upload className="w-4 h-4 text-green-600" />
      case 'status_update': return <CheckCircle2 className="w-4 h-4 text-purple-600" />
      case 'message': return <MessageSquare className="w-4 h-4 text-orange-600" />
      case 'payment': return <FileText className="w-4 h-4 text-emerald-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Case Timeline</h3>
          <Button 
            size="sm" 
            onClick={() => setShowAddActivity(!showAddActivity)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Add Activity Form */}
        {showAddActivity && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Activity title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Activity description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save Activity
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddActivity(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {getActivityIcon(activity.activity_type)}
                </div>
                {index < activities.length - 1 && (
                  <div className="w-px h-12 bg-gray-200 mt-2" />
                )}
              </div>
              
              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{activity.title}</h4>
                  <span className="text-sm text-gray-500">
                                          {formatDateSafe(activity.created_at)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>By {activity.created_by}</span>
                  {activity.metadata && (
                    <>
                      {activity.metadata.duration && <span>Duration: {activity.metadata.duration}</span>}
                      {activity.metadata.file_count && <span>Files: {activity.metadata.file_count}</span>}
                      {activity.metadata.meeting_type && <span>Type: {activity.metadata.meeting_type}</span>}
                    </>
                  )}
                </div>
                {activity.metadata?.attachments && (
                  <div className="mt-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3 mr-1" />
                      Download Attachments
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DocumentsSection() {
  const documents = [
    { name: "Academic Transcripts", status: "approved", uploadedAt: "2024-01-18", type: "PDF" },
    { name: "IELTS Score Report", status: "approved", uploadedAt: "2024-01-20", type: "PDF" },
    { name: "Statement of Purpose", status: "review", uploadedAt: "2024-02-10", type: "DOCX" },
    { name: "Financial Documents", status: "pending", uploadedAt: null, type: null },
    { name: "Passport Copy", status: "approved", uploadedAt: "2024-01-15", type: "PDF" }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Documents</h3>
          <Button size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium">{doc.name}</h4>
                  {doc.uploadedAt && (
                    <div className="text-sm text-gray-500">
                      Uploaded on {formatDateSafe(doc.uploadedAt)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {doc.type && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{doc.type}</span>
                )}
                <Badge className={getStatusColor(doc.status)}>
                  {doc.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function CaseDetailPage() {
  const params = useParams()
  const [caseData, setCaseData] = useState(mockCaseData)
  const [loading, setLoading] = useState(false)

  // In real app, fetch case data based on params.id
  useEffect(() => {
    // fetchCaseData(params.id)
  }, [params.id])

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CaseHeader caseData={caseData.case} student={caseData.student} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <ActivityTimeline activities={caseData.activities} />
          </div>
          <div className="space-y-8">
            <DocumentsSection />
          </div>
        </div>
      </div>
    </div>
  )
} 