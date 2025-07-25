import { api } from '@/libs/api'

// Types
export interface Student {
  id: number
  name: string
  email: string
  phone: string
  country: string
  preferred_language: string
  education_level: string
  target_program: string
  target_institution: string
  ielts_score?: number
  created_at: string
  updated_at: string
  status: 'active' | 'inactive' | 'pending'
  avatar?: string
  active_cases?: number
  total_cases?: number
  latest_case?: Case
}

export interface Case {
  id: number
  student_id: number
  consultant_id: number
  title: string
  description: string
  status: 'new' | 'in_progress' | 'documents_pending' | 'submitted' | 'approved' | 'rejected' | 'completed'
  priority: 'high' | 'medium' | 'low'
  target_intake: string
  application_deadline?: string
  created_at: string
  updated_at: string
  next_action?: string
  next_action_date?: string
  progress_percentage: number
  estimated_completion?: string
  student?: Student
}

export interface CaseActivity {
  id: number
  case_id: number
  activity_type: 'consultation' | 'document_upload' | 'status_update' | 'message' | 'payment'
  title: string
  description: string
  created_at: string
  created_by: string
  metadata?: Record<string, any>
}

export interface DashboardStats {
  total_cases: number
  active_cases: number
  completed_cases: number
  pending_actions: number
  total_revenue: number
  this_month_revenue: number
  success_rate: number
  average_completion_time: string
}

export interface DashboardData {
  stats: DashboardStats
  recent_activities: CaseActivity[]
  upcoming_deadlines: Array<{
    id: number
    title: string
    next_action: string
    next_action_date: string
    priority: string
    student_name: string
  }>
}

// Request/Response Types
export interface CreateStudentRequest {
  name: string
  email: string
  phone: string
  country: string
  preferred_language?: string
  education_level: string
  target_program: string
  target_institution: string
  ielts_score?: number
}

export interface CreateCaseRequest {
  student_id: number
  title: string
  description: string
  priority?: 'high' | 'medium' | 'low'
  target_intake: string
  application_deadline?: string
  next_action?: string
  next_action_date?: string
}

export interface UpdateCaseRequest {
  title?: string
  description?: string
  status?: Case['status']
  priority?: Case['priority']
  target_intake?: string
  application_deadline?: string
  next_action?: string
  next_action_date?: string
  progress_percentage?: number
}

export interface StudentsResponse {
  students: Student[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

export interface CasesResponse {
  cases: Case[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

export interface CaseDetailsResponse {
  case: Case
  student: Student
  activities: CaseActivity[]
}

// API Functions
export const consultantCrmApi = {
  // Dashboard
  getDashboard: async (consultantId: number): Promise<DashboardData> => {
    const response = await api.get(`/consultant/${consultantId}/dashboard`)
    return response.data
  },

  // Students Management
  getStudents: async (
    consultantId: number,
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: Student['status']
  ): Promise<StudentsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    
    if (search) params.append('search', search)
    if (status) params.append('status', status)

    const response = await api.get(`/consultant/${consultantId}/students?${params}`)
    return response.data
  },

  createStudent: async (
    consultantId: number,
    studentData: CreateStudentRequest
  ): Promise<{ message: string; student: Student }> => {
    const response = await api.post(`/consultant/${consultantId}/students`, studentData)
    return response.data
  },

  getStudent: async (consultantId: number, studentId: number): Promise<Student> => {
    const response = await api.get(`/consultant/${consultantId}/students/${studentId}`)
    return response.data
  },

  updateStudent: async (
    consultantId: number,
    studentId: number,
    studentData: Partial<CreateStudentRequest>
  ): Promise<{ message: string; student: Student }> => {
    const response = await api.put(`/consultant/${consultantId}/students/${studentId}`, studentData)
    return response.data
  },

  // Cases Management
  getCases: async (
    consultantId: number,
    page: number = 1,
    limit: number = 10,
    status?: Case['status'],
    priority?: Case['priority']
  ): Promise<CasesResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    
    if (status) params.append('status', status)
    if (priority) params.append('priority', priority)

    const response = await api.get(`/consultant/${consultantId}/cases?${params}`)
    return response.data
  },

  createCase: async (
    consultantId: number,
    caseData: CreateCaseRequest
  ): Promise<{ message: string; case: Case }> => {
    const response = await api.post(`/consultant/${consultantId}/cases`, caseData)
    return response.data
  },

  getCaseDetails: async (
    consultantId: number,
    caseId: number
  ): Promise<CaseDetailsResponse> => {
    const response = await api.get(`/consultant/${consultantId}/cases/${caseId}`)
    return response.data
  },

  updateCase: async (
    consultantId: number,
    caseId: number,
    caseData: UpdateCaseRequest
  ): Promise<{ message: string; case: Case }> => {
    const response = await api.put(`/consultant/${consultantId}/cases/${caseId}`, caseData)
    return response.data
  },

  // Case Activities
  getCaseActivities: async (
    consultantId: number,
    caseId: number
  ): Promise<CaseActivity[]> => {
    const response = await api.get(`/consultant/${consultantId}/cases/${caseId}/activities`)
    return response.data.activities
  },

  addCaseActivity: async (
    consultantId: number,
    caseId: number,
    activity: {
      activity_type: CaseActivity['activity_type']
      title: string
      description: string
      metadata?: Record<string, any>
    }
  ): Promise<{ message: string; activity: CaseActivity }> => {
    const response = await api.post(`/consultant/${consultantId}/cases/${caseId}/activities`, activity)
    return response.data
  }
}

// React Hooks (using the pattern from your existing API)
export const useDashboard = (consultantId: number) => {
  return {
    fetch: () => consultantCrmApi.getDashboard(consultantId)
  }
}

export const useStudents = (
  consultantId: number,
  page: number = 1,
  search?: string,
  status?: Student['status']
) => {
  return {
    fetch: () => consultantCrmApi.getStudents(consultantId, page, 10, search, status)
  }
}

export const useCases = (
  consultantId: number,
  page: number = 1,
  status?: Case['status'],
  priority?: Case['priority']
) => {
  return {
    fetch: () => consultantCrmApi.getCases(consultantId, page, 10, status, priority)
  }
} 