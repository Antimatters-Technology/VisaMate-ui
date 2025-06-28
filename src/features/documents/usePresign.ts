import { useState } from 'react'
import { api } from '@/libs/api'
import { useDocuments } from '@/stores/documents'
import { useWizard } from '@/features/wizard/useWizard'

interface PresignResponse {
  success: boolean
  data?: {
    id: string
    name: string
    url: string
  }
  error?: string
}

interface PresignInitResponse {
  document_id: string
  upload_url: string
  expires_in: number
  max_file_size: number
  required_headers?: Record<string, string>
  s3_key: string
}

export function usePresign() {
  const [isUploading, setIsUploading] = useState(false)
  const { addDocument, updateDocument } = useDocuments()
  const { sessionId } = useWizard()

  const uploadFile = async (file: File): Promise<PresignResponse> => {
    setIsUploading(true)
    
    try {
      // Step 1: Get presigned URL from backend
      const initResponse = await api.post('/documents/init', {
        filename: file.name,
        content_type: file.type,
        size: file.size,
        category: 'other', // Default category, can be made dynamic
        session_id: sessionId // Include session ID for tracking
      })

      console.log('Presign init response:', initResponse.data)

      const { document_id, upload_url }: PresignInitResponse = initResponse.data

      // Validate required fields
      if (!document_id || !upload_url) {
        throw new Error(`Invalid response from backend: missing document_id or upload_url. Response: ${JSON.stringify(initResponse.data)}`)
      }

      // Step 2: Add optimistic document to store
      const optimisticDoc = {
        id: document_id,
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'uploading' as const,
        uploadedAt: new Date().toISOString(),
      }
      addDocument(optimisticDoc)

      // Step 3: Upload to S3 using presigned PUT URL
      // Your backend provides a direct PUT URL, not POST with form fields
      const headers: Record<string, string> = {}
      
      // Add required headers from backend response
      if (initResponse.data.required_headers) {
        Object.entries(initResponse.data.required_headers).forEach(([key, value]) => {
          headers[key] = value as string
        })
      }

      console.log('Uploading to S3 with:', {
        method: 'PUT',
        url: upload_url,
        headers: headers,
        fileSize: file.size,
        fileType: file.type
      })

      const uploadResponse = await fetch(upload_url, {
        method: 'PUT',
        headers: headers,
        body: file, // Upload file directly, not as FormData
      })

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text().catch(() => 'No error details')
        console.error('S3 upload failed:', {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          url: upload_url,
          headers: headers,
          errorText: errorText
        })
        throw new Error(`S3 upload failed: ${uploadResponse.status} ${uploadResponse.statusText}. Details: ${errorText}`)
      }

      // Step 4: Mark upload as complete in backend
      await api.post('/documents/upload-complete', {
        document_id: document_id
      })

      // Step 5: Update document status to completed
      updateDocument(document_id, {
        status: 'completed',
        url: uploadResponse.url || upload_url
      })

      return {
        success: true,
        data: {
          id: document_id,
          name: file.name,
          url: uploadResponse.url || upload_url
        }
      }

    } catch (error: any) {
      console.error('Upload failed:', error)
      
      // Update document status to failed if we had added it optimistically
      if (error.document_id) {
        updateDocument(error.document_id, { status: 'failed' })
      }

      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Upload failed'
      }
    } finally {
      setIsUploading(false)
    }
  }

  return {
    uploadFile,
    isUploading
  }
} 