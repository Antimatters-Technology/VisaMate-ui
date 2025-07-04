'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Eye,
  MessageSquare,
  Users,
  X,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import { formatDateSafe } from '@/utils/date'
import { useStudentProfile } from '@/stores/student-profile'

// Types for the Kanban board
interface ApplicationCard {
  id: number
  student_name: string
  student_email: string
  phone: string
  program: string
  institution: string
  target_intake: string
  priority: 'high' | 'medium' | 'low'
  created_at: string
  updated_at: string
  ielts_score?: number
  consultant_notes?: string
  next_action?: string
  next_action_date?: string
  progress_percentage: number
}

interface KanbanColumn {
  id: string
  title: string
  count: number
  color: string
  applications: ApplicationCard[]
}

// Mock data representing real applications from student bookings
const mockKanbanData: KanbanColumn[] = [
  {
    id: 'created',
    title: 'Created',
    count: 3,
    color: 'bg-blue-50 border-blue-200',
    applications: [
      {
        id: 1,
        student_name: 'Arjun Sharma',
        student_email: 'arjun.sharma@gmail.com',
        phone: '+91 9876543210',
        program: 'Master\'s in Computer Science',
        institution: 'University of Toronto',
        target_intake: 'Fall 2024',
        priority: 'high',
        created_at: '2024-02-15T10:00:00Z',
        updated_at: '2024-02-15T10:00:00Z',
        ielts_score: 7.5,
        consultant_notes: 'Strong candidate with excellent academic background',
        next_action: 'Document checklist review',
        next_action_date: '2024-02-20T10:00:00Z',
        progress_percentage: 5
      },
      {
        id: 2,
        student_name: 'Priyanka Gupta',
        student_email: 'priyanka.gupta@gmail.com',
        phone: '+91 9876543211',
        program: 'MBA',
        institution: 'Seneca College',
        target_intake: 'Winter 2025',
        priority: 'medium',
        created_at: '2024-02-14T14:30:00Z',
        updated_at: '2024-02-14T14:30:00Z',
        ielts_score: 6.5,
        progress_percentage: 10
      },
      {
        id: 3,
        student_name: 'Vikram Singh',
        student_email: 'vikram.singh@gmail.com',
        phone: '+91 9876543212',
        program: 'Post-Graduate Certificate',
        institution: 'Conestoga College',
        target_intake: 'Fall 2024',
        priority: 'low',
        created_at: '2024-02-13T09:15:00Z',
        updated_at: '2024-02-13T09:15:00Z',
        ielts_score: 6.0,
        progress_percentage: 8
      }
    ]
  },
  {
    id: 'onboarding',
    title: 'On-boarding Completed',
    count: 2,
    color: 'bg-yellow-50 border-yellow-200',
    applications: [
      {
        id: 4,
        student_name: 'Rajesh Patel',
        student_email: 'rajesh.patel@gmail.com',
        phone: '+91 9876543213',
        program: 'Diploma in Engineering',
        institution: 'Centennial College',
        target_intake: 'Fall 2024',
        priority: 'high',
        created_at: '2024-02-10T11:00:00Z',
        updated_at: '2024-02-16T15:30:00Z',
        ielts_score: 6.5,
        consultant_notes: 'All documents collected, ready for application preparation',
        next_action: 'SOP writing guidance',
        next_action_date: '2024-02-18T10:00:00Z',
        progress_percentage: 35
      },
      {
        id: 5,
        student_name: 'Sonia Sharma',
        student_email: 'sonia.sharma@gmail.com',
        phone: '+91 9876543214',
        program: 'Bachelor of Commerce',
        institution: 'York University',
        target_intake: 'Fall 2024',
        priority: 'medium',
        created_at: '2024-02-08T16:45:00Z',
        updated_at: '2024-02-15T12:20:00Z',
        ielts_score: 7.0,
        progress_percentage: 40
      }
    ]
  },
  {
    id: 'documents_ready',
    title: 'Documents Ready',
    count: 1,
    color: 'bg-purple-50 border-purple-200',
    applications: [
      {
        id: 6,
        student_name: 'Amit Kumar',
        student_email: 'amit.kumar@gmail.com',
        phone: '+91 9876543215',
        program: 'Master\'s in Business Analytics',
        institution: 'University of Waterloo',
        target_intake: 'Fall 2024',
        priority: 'high',
        created_at: '2024-02-05T08:30:00Z',
        updated_at: '2024-02-17T14:15:00Z',
        ielts_score: 8.0,
        consultant_notes: 'All documents verified and compiled. Ready for submission.',
        next_action: 'Submit to IRCC',
        next_action_date: '2024-02-19T09:00:00Z',
        progress_percentage: 85
      }
    ]
  },
  {
    id: 'submitted',
    title: 'Submitted to IRCC',
    count: 0,
    color: 'bg-green-50 border-green-200',
    applications: []
  }
]

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function ApplicationCard({ application }: { application: ApplicationCard }) {
  const [showESignModal, setShowESignModal] = useState(false)
  return (
    <div className="relative">
      <Card className="mb-3 cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-gray-500" />
                <h4 className="font-semibold text-sm">{application.student_name}</h4>
              </div>
              <p className="text-xs text-gray-600 mb-2">{application.program}</p>
              <p className="text-xs text-gray-500">{application.institution}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge className={getPriorityColor(application.priority)}>
                {application.priority.toUpperCase()}
              </Badge>
              {application.ielts_score && (
                <span className="text-xs text-blue-600 font-medium">
                  IELTS: {application.ielts_score}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Intake: {application.target_intake}</span>
              <span className="text-gray-500">{formatDateSafe(application.created_at)}</span>
            </div>

            {application.progress_percentage > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-600">{application.progress_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${application.progress_percentage}%` }}
                  />
                </div>
              </div>
            )}

            {application.next_action && (
              <div className="bg-blue-50 p-2 rounded text-xs">
                <div className="flex items-center gap-1 text-blue-700 font-medium mb-1">
                  <Clock className="w-3 h-3" />
                  Next Action
                </div>
                <p className="text-blue-600">{application.next_action}</p>
                {application.next_action_date && (
                  <p className="text-blue-500 mt-1">
                    Due: {formatDateSafe(application.next_action_date)}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-1 pt-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 h-7 text-xs"
                onClick={() => window.open('https://onlineservices-servicesenligne.cic.gc.ca/eapp/eapp', '_blank')}
              >
                <Eye className="w-3 h-3 mr-1" />
                IRCC Submit
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 h-7 text-xs"
                onClick={() => setShowESignModal(true)}
              >
                <FileText className="w-3 h-3 mr-1" />
                E-sign Documents
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* E-Sign Documents Modal */}
      {showESignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">E-Sign Documents</h3>
                  <p className="text-blue-100 text-sm mt-1">Student: {application.student_name}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowESignModal(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              {/* Document Status Overview */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-xs text-green-700">Ready to Sign</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">2</div>
                  <div className="text-xs text-blue-700">Reviewed</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-gray-600">1</div>
                  <div className="text-xs text-gray-700">Pending</div>
                </div>
              </div>

              {/* Documents List */}
              <div className="space-y-3 mb-6">
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">IMM 1294E – Study Permit</h4>
                        <p className="text-sm text-gray-600">Application for Study Permit</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Ready</Badge>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Sign Now
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">IMM 5257E – Temporary Resident Visa</h4>
                        <p className="text-sm text-gray-600">Application for Temporary Resident Visa</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">Reviewed</Badge>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">IMM 5645E – Family Information</h4>
                        <p className="text-sm text-gray-600">Additional Family Information</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
                      <Button size="sm" variant="outline" disabled>
                        Waiting
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Digital Signature</h4>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">RCIC Consultant</p>
                      <p className="text-sm text-gray-600">Licensed Immigration Consultant</p>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-gray-500 text-sm">Click to add your digital signature</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowESignModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    // Simulate signing process
                    setTimeout(() => setShowESignModal(false), 1000);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sign All Documents
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function KanbanColumn({ column }: { column: KanbanColumn }) {
  return (
    <div className="flex-1 min-w-80">
      <div className={`p-4 rounded-lg border-2 h-full ${column.color}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800">{column.title}</h3>
            <Badge variant="secondary" className="bg-white">
              {column.count}
            </Badge>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {column.applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ApplicationsBoard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [showRequests, setShowRequests] = useState(false)
  const [acceptedRequests, setAcceptedRequests] = useState<number[]>([])
  const [showNewApplicationModal, setShowNewApplicationModal] = useState(false)
  const { profile } = useStudentProfile()

  // Real-time applications from student selections
  const realApplications = profile.selectedConsultant ? [
    {
      id: parseInt(profile.id || '999'),
      student_name: profile.name || 'New Student Application',
      student_email: profile.email || 'student@email.com',
      phone: profile.phone || '+91 9876543210',
      program: 'Canada Study Permit Application',
      institution: 'To be determined',
      target_intake: 'Fall 2024',
      priority: 'high' as const,
      created_at: profile.createdAt || new Date().toISOString(),
      updated_at: profile.createdAt || new Date().toISOString(),
      ielts_score: undefined,
      consultant_notes: `New application from student selection. Documents uploaded: ${profile.documents.length}`,
      next_action: 'Initial consultation - Contact student',
      next_action_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      progress_percentage: 5
    }
  ] : []

  // Filter out accepted requests from pending requests
  const pendingRequests = realApplications.filter(app => !acceptedRequests.includes(app.id))

  // Move accepted requests to onboarding column
  const acceptedApplications = realApplications.filter(app => acceptedRequests.includes(app.id)).map(app => ({
    ...app,
    progress_percentage: 35,
    consultant_notes: 'Request accepted. On-boarding process started.',
    next_action: 'Document verification and SOP guidance',
    next_action_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    updated_at: new Date().toISOString()
  }))

  const handleAcceptRequest = (applicationId: number) => {
    setAcceptedRequests(prev => [...prev, applicationId])
    setShowRequests(false) // Switch back to main board to see the accepted application
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
                      <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Apple Abroads - Applications Board</h1>
                <p className="text-gray-600">RCIC Licensed Immigration Consultancy | Manage student applications from booking to IRCC submission</p>
              </div>
              <div className="flex gap-2">
                                  <Button 
                    variant="outline" 
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    onClick={() => setShowRequests(!showRequests)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Requests ({pendingRequests.length})
                  </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowNewApplicationModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Application
                </Button>
              </div>
            </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All</option>
              <option value="High Priority">High Priority</option>
              <option value="Due Today">Due Today</option>
              <option value="Fall 2024">Fall 2024</option>
              <option value="Winter 2025">Winter 2025</option>
            </select>

            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <input
                type="date"
                defaultValue="2024-02-01"
                className="border border-gray-300 rounded px-2 py-1"
              />
              <span>-</span>
              <input
                type="date"
                defaultValue="2024-03-31"
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>

            <Button className="bg-green-600 hover:bg-green-700">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {showRequests ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Student Requests</h2>
                  <p className="text-gray-600">New applications from students who selected your consultancy</p>
                </div>
                <div className="p-6">
                  {pendingRequests.length > 0 ? (
                    <div className="space-y-4">
                      {pendingRequests.map((application) => (
                        <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{application.student_name}</h3>
                                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                                  New Request
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  {application.student_email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  {application.phone}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  Applied: {formatDateSafe(application.created_at)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  Program: {application.program}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleAcceptRequest(application.id)}
                              >
                                Accept Request
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No New Requests</h3>
                      <p className="text-gray-600">When students select your consultancy, their requests will appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-6">
              {mockKanbanData.filter(column => column.id !== 'created').map((column) => {
                // Add accepted applications to the onboarding column
                if (column.id === 'onboarding') {
                  const updatedColumn = {
                    ...column,
                    applications: [...acceptedApplications, ...column.applications],
                    count: acceptedApplications.length + column.applications.length
                  }
                  return <KanbanColumn key={column.id} column={updatedColumn} />
                }
                return <KanbanColumn key={column.id} column={column} />
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Application Modal */}
      {showNewApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Application Link</h3>
              <p className="text-gray-600 mb-6">
                Share this link with your student to start their application process:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <a 
                  href="http://localhost:3000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium text-lg"
                >
                  visamate.com
                </a>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewApplicationModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText('http://localhost:3000');
                    setShowNewApplicationModal(false);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 