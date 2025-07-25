'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'

interface GeneratedDocument {
  id: string
  name: string
  displayName: string
  type: 'pdf' | 'txt'
  icon: 'pdf' | 'txt'
}

const generatedDocuments: GeneratedDocument[] = [
  {
    id: '1',
    name: 'FILLED_IMM1294E_Study_Permit.txt',
    displayName: 'IMM1294E Study Permit',
    type: 'pdf',
    icon: 'pdf'
  },
  {
    id: '2', 
    name: 'FILLED_IMM5257E_Temporary_Resident_Visa.txt',
    displayName: 'IMM5257E Temporary Resident Visa',
    type: 'pdf',
    icon: 'pdf'
  },
  {
    id: '3',
    name: 'FILLED_IMM5645E_Family_Information.txt', 
    displayName: 'IMM5645E Family Information',
    type: 'pdf',
    icon: 'pdf'
  },
  {
    id: '4',
    name: 'AI_Generated_SOP.txt',
    displayName: 'Statement of Purpose',
    type: 'txt',
    icon: 'txt'
  }
]

export function AIGeneratedDocuments() {
  const handleDownload = (document: GeneratedDocument) => {
    // Create a download link for the document
    const link = window.document.createElement('a')
    link.href = `/generated-documents/${document.name}`
    link.download = document.name
    link.click()
  }

  const getFileIcon = (type: 'pdf' | 'txt') => {
    if (type === 'pdf') {
      return (
        <div className="relative">
          <FileText className="w-12 h-12 text-gray-400" />
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded font-bold">
            PDF
          </div>
          <div className="absolute bottom-0 right-0 text-red-500">
            <Download className="w-4 h-4" />
          </div>
        </div>
      )
    } else {
      return (
        <div className="relative">
          <FileText className="w-12 h-12 text-gray-600" />
          <div className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs px-1 py-0.5 rounded font-bold">
            TXT
          </div>
        </div>
      )
    }
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-blue-900">
          AI Generated Supporting Documents for IRCC
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {generatedDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleDownload(doc)}
            >
              <div className="mb-3">
                {getFileIcon(doc.icon)}
              </div>
              <p className="text-sm font-medium text-center text-gray-800 leading-tight">
                {doc.displayName}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-blue-600 text-center">
          Documents generated using AI OCR technology from your uploaded files
        </div>
      </CardContent>
    </Card>
  )
} 