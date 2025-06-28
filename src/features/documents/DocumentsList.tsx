import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import { useDocuments } from '@/stores/documents'

interface Document {
  id: string
  name: string
  type: string
  size: number
  status: 'uploading' | 'completed' | 'failed' | 'processing'
  uploadedAt: string
  url?: string
}

export function DocumentsList() {
  const { documents, removeDocument } = useDocuments()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'uploading':
        return <Badge variant="info">Uploading</Badge>
      case 'processing':
        return <Badge variant="warning">Processing</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No documents uploaded yet.</p>
        <p className="text-sm mt-2">Upload your first document to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium truncate">{doc.name}</p>
              {getStatusBadge(doc.status)}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{doc.type.toUpperCase()}</span>
              <span>{formatFileSize(doc.size)}</span>
              <span>
                {new Date(doc.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {doc.status === 'completed' && doc.url && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open(doc.url, '_blank')}
              >
                View
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => removeDocument(doc.id)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
} 