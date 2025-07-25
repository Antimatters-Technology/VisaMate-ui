import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
  status: 'uploaded' | 'verified' | 'rejected'
}

interface StudentProfile {
  id?: string
  name?: string
  email?: string
  phone?: string
  documents: Document[]
  selectedConsultant?: {
    id: number
    name: string
    consultancy: string
  }
  applicationStatus: 'documents_uploaded' | 'consultant_selected' | 'profile_created' | 'in_progress'
  createdAt?: string
}

interface StudentProfileStore {
  profile: StudentProfile
  addDocument: (document: Omit<Document, 'id' | 'uploadedAt' | 'status'>) => void
  selectConsultant: (consultant: { id: number; name: string; consultancy: string }) => void
  updateProfile: (data: Partial<StudentProfile>) => void
  createApplication: () => void
  reset: () => void
}

const initialProfile: StudentProfile = {
  documents: [],
  applicationStatus: 'documents_uploaded'
}

export const useStudentProfile = create<StudentProfileStore>()(
  persist(
    (set, get) => ({
      profile: initialProfile,
      
      addDocument: (document) => {
        const newDoc: Document = {
          ...document,
          id: Date.now().toString(),
          uploadedAt: new Date().toISOString(),
          status: 'uploaded'
        }
        
        set(state => ({
          profile: {
            ...state.profile,
            documents: [...state.profile.documents, newDoc]
          }
        }))
      },
      
      selectConsultant: (consultant) => {
        set(state => ({
          profile: {
            ...state.profile,
            selectedConsultant: consultant,
            applicationStatus: 'consultant_selected'
          }
        }))
      },
      
      updateProfile: (data) => {
        set(state => ({
          profile: {
            ...state.profile,
            ...data
          }
        }))
      },
      
      createApplication: () => {
        const { profile } = get()
        
        // Send to consultant's dashboard
        if (profile.selectedConsultant) {
          // This would be an API call in real implementation
          console.log('Creating application in consultant dashboard:', {
            consultantId: profile.selectedConsultant.id,
            studentProfile: profile,
            status: 'new'
          })
          
          set(state => ({
            profile: {
              ...state.profile,
              applicationStatus: 'profile_created',
              id: Date.now().toString(),
              createdAt: new Date().toISOString()
            }
          }))
        }
      },
      
      reset: () => {
        set({ profile: initialProfile })
      }
    }),
    {
      name: 'student-profile'
    }
  )
) 