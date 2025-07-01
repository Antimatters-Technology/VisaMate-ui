// Main types for VisaMate application

export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'consultant' | 'admin'
  avatar?: string
  createdAt: string
  updatedAt: string
  preferences: UserPreferences
}

export interface UserPreferences {
  language: 'en' | 'pa' | 'gu' | 'hn'
  theme: 'light' | 'dark'
  notifications: boolean
  timezone: string
}

export interface Application {
  id: string
  userId: string
  status: ApplicationStatus
  country: string
  program: string
  progress: number
  createdAt: string
  updatedAt: string
  submittedAt?: string
  data: ApplicationData
}

export type ApplicationStatus = 
  | 'draft'
  | 'in-progress'
  | 'review'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'withdrawn'

export interface ApplicationData {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  documents: Document[]
  eligibility: EligibilityAssessment
}

export interface PersonalInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
  nationality: string
  passportNumber: string
  email: string
  phone: string
  address: Address
}

export interface Address {
  street: string
  city: string
  state: string
  country: string
  postalCode: string
}

export interface Education {
  id: string
  level: 'high-school' | 'diploma' | 'bachelors' | 'masters' | 'phd'
  institution: string
  program: string
  country: string
  startDate: string
  endDate: string
  grade: string
  documents: string[]
}

export interface Experience {
  id: string
  title: string
  company: string
  country: string
  startDate: string
  endDate?: string
  description: string
  skills: string[]
  documents: string[]
}

export interface Document {
  id: string
  name: string
  type: DocumentType
  category: DocumentCategory
  size: number
  mimeType: string
  status: DocumentStatus
  uploadedAt: string
  verifiedAt?: string
  url?: string
  metadata: Record<string, any>
}

export type DocumentType = 
  | 'passport'
  | 'visa'
  | 'education-certificate'
  | 'transcript'
  | 'work-reference'
  | 'language-test'
  | 'financial-statement'
  | 'medical-report'
  | 'police-clearance'
  | 'other'

export type DocumentCategory = 
  | 'identity'
  | 'education'
  | 'work'
  | 'financial'
  | 'medical'
  | 'legal'
  | 'other'

export type DocumentStatus = 
  | 'uploading'
  | 'processing'
  | 'completed'
  | 'verified'
  | 'rejected'
  | 'missing'

export interface EligibilityAssessment {
  overall: AssessmentScore
  factors: {
    age: AssessmentScore
    education: AssessmentScore
    language: AssessmentScore
    experience: AssessmentScore
    financialSupport: AssessmentScore
  }
  recommendations: string[]
  calculatedAt: string
}

export type AssessmentScore = 'high' | 'medium' | 'low' | 'unknown'

export interface Case {
  id: string
  consultantId: string
  clientId: string
  applicationId: string
  status: CaseStatus
  priority: CasePriority
  assignedAt: string
  lastContactAt?: string
  notes: CaseNote[]
  timeline: CaseTimelineEntry[]
}

export type CaseStatus = 
  | 'new'
  | 'assigned'
  | 'in-progress'
  | 'waiting-client'
  | 'review'
  | 'completed'
  | 'cancelled'

export type CasePriority = 'low' | 'medium' | 'high' | 'urgent'

export interface CaseNote {
  id: string
  authorId: string
  content: string
  isPrivate: boolean
  createdAt: string
}

export interface CaseTimelineEntry {
  id: string
  type: 'note' | 'status_change' | 'document_upload' | 'meeting' | 'deadline'
  title: string
  description?: string
  createdAt: string
  createdBy: string
  metadata?: Record<string, any>
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface WebSocketMessage {
  type: string
  payload: any
  timestamp: string
  userId?: string
} 