'use client'

import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/shared/Badge'
import { useWizard } from './useWizard'

interface DocumentItem {
  document_type: string
  description: string
  required: boolean
  status: 'pending' | 'uploaded' | 'verified' | 'rejected'
}

export function DocumentChecklist() {
  const { getDocumentChecklist, sessionId } = useWizard()
  const [checklist, setChecklist] = useState<DocumentItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchChecklist = async () => {
      if (!sessionId) return
      
      setIsLoading(true)
      try {
        const documents = await getDocumentChecklist()
        setChecklist(documents)
      } catch (error) {
        console.error('Failed to fetch document checklist:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChecklist()
  }, [sessionId, getDocumentChecklist])

  const getStatusBadge = (status: DocumentItem['status']) => {
    switch (status) {
      case 'uploaded':
        return <Badge className="bg-blue-100 text-blue-800">Uploaded</Badge>
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm">Loading checklist...</span>
      </div>
    )
  }

  if (checklist.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p className="text-sm">Complete the wizard to see required documents</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Required Documents</h3>
      <div className="space-y-2">
        {checklist.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex-1">
              <div className="font-medium text-sm">{item.document_type}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
            <div className="flex items-center gap-2">
              {item.required && (
                <span className="text-xs text-red-500">Required</span>
              )}
              {getStatusBadge(item.status)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          <strong>Progress:</strong> {checklist.filter(item => item.status !== 'pending').length} of {checklist.length} documents processed
        </div>
      </div>
    </div>
  )
} 