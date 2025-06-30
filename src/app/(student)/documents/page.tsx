'use client'

import { UploadDropzone } from '@/features/documents/UploadDropzone'
import { DocumentsList } from '@/features/documents/DocumentsList'
import { CompletionBanner } from '@/features/documents/CompletionBanner'
import { WhatsAppSetup } from '@/features/whatsapp/WhatsAppSetup'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useWizard } from '@/features/wizard/useWizard'
import { useDocuments } from '@/stores/documents'

export default function DocumentsPage() {
  // Initialize wizard session for document uploads
  const { sessionId, isLoading } = useWizard()
  const { documents } = useDocuments()
  
  // Check if user has uploaded documents
  const hasUploadedDocuments = documents.length > 0
  const completedDocuments = documents.filter(doc => doc.status === 'completed').length
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Document Management
          </h1>
          <p className="text-gray-600">
            Upload and manage your visa application documents.
          </p>
        </div>

        {/* WhatsApp Upload Option */}
        <div className="mb-8">
          <WhatsAppSetup sessionId={sessionId || undefined} />
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>
                  Drag and drop your files or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500">Initializing session...</div>
                  </div>
                ) : (
                  <UploadDropzone 
                    onUploadComplete={(files) => {
                      console.log('Files uploaded:', files)
                      // Files are automatically added to the documents store
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Documents</CardTitle>
                <CardDescription>
                  Uploaded files and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentsList />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Completion CTA - Show when documents are uploaded */}
        {hasUploadedDocuments && (
          <div className="mt-8">
            <CompletionBanner />
          </div>
        )}
      </div>
    </div>
  )
} 