import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Document {
  id: string
  name: string
  type: string
  size: number
  status: 'uploading' | 'completed' | 'failed' | 'processing'
  uploadedAt: string
  url?: string
}

interface DocumentsStore {
  documents: Document[]
  addDocument: (document: Document) => void
  updateDocument: (id: string, updates: Partial<Document>) => void
  removeDocument: (id: string) => void
  clearDocuments: () => void
}

export const useDocuments = create<DocumentsStore>()(
  persist(
    (set) => ({
      documents: [],
      addDocument: (document) =>
        set((state) => ({
          documents: [...state.documents, document]
        })),
      updateDocument: (id, updates) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, ...updates } : doc
          )
        })),
      removeDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id)
        })),
      clearDocuments: () => set({ documents: [] })
    }),
    {
      name: 'documents-storage'
    }
  )
) 