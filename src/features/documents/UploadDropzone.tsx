import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { usePresign } from './usePresign'

interface UploadDropzoneProps {
  onUploadComplete?: (files: { id: string; name: string; url: string }[]) => void
  acceptedFileTypes?: string[]
  maxFileSize?: number
}

export function UploadDropzone({ 
  onUploadComplete,
  acceptedFileTypes = ['pdf', 'jpg', 'jpeg', 'png'],
  maxFileSize = 10 * 1024 * 1024 // 10MB
}: UploadDropzoneProps) {
  const { uploadFile, isUploading } = usePresign()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const uploadPromises = acceptedFiles.map(file => uploadFile(file))
      const results = await Promise.all(uploadPromises)
      
      const successfulUploads = results
        .filter(result => result.success)
        .map(result => result.data!)
      
      if (onUploadComplete && successfulUploads.length > 0) {
        onUploadComplete(successfulUploads)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }, [uploadFile, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[`image/${type}`] = []
      acc[`application/${type}`] = []
      return acc
    }, {} as Record<string, string[]>),
    maxSize: maxFileSize,
    multiple: true
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                or click to browse files
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supports: {acceptedFileTypes.join(', ').toUpperCase()} 
                (Max size: {Math.round(maxFileSize / 1024 / 1024)}MB)
              </p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              disabled={isUploading}
              onClick={(e) => e.stopPropagation()}
            >
              {isUploading ? 'Uploading...' : 'Choose Files'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 