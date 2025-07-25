'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import { useDocuments } from '@/stores/documents'
import { formatDateSafe } from '@/utils/date'

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
        <div key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
          <p className="text-sm font-medium truncate max-w-[150px]" title={doc.name}>
            {doc.name}
          </p>
          {getStatusBadge(doc.status)}
        </div>
      ))}
    </div>
  )
} 