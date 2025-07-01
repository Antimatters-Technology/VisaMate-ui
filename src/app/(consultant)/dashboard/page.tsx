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
  Users
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
    count: 2,
    color: 'bg-green-50 border-green-200',
    applications: [
      {
        id: 7,
        student_name: 'Neha Agarwal',
        student_email: 'neha.agarwal@gmail.com',
        phone: '+91 9876543216',
        program: 'Master\'s in Data Science',
        institution: 'University of British Columbia',
        target_intake: 'Fall 2024',
        priority: 'high',
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-02-12T11:30:00Z',
        ielts_score: 7.5,
        consultant_notes: 'Application submitted successfully. Tracking number: IMM2024-789456',
        progress_percentage: 100
      },
      {
        id: 8,
        student_name: 'Rohit Verma',
        student_email: 'rohit.verma@gmail.com',
        phone: '+91 9876543217',
        program: 'Diploma in Hospitality',
        institution: 'George Brown College',
        target_intake: 'Summer 2024',
        priority: 'medium',
        created_at: '2024-01-25T12:00:00Z',
        updated_at: '2024-02-10T16:45:00Z',
        ielts_score: 6.0,
        progress_percentage: 100
      }
    ]
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
  return (
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
            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
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
                <Button className="bg-blue-600 hover:bg-blue-700">
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
    </div>
  )
} 