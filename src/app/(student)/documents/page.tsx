'use client'

import { UploadDropzone } from '@/features/documents/UploadDropzone'
import { DocumentsList } from '@/features/documents/DocumentsList'
import { CompletionBanner } from '@/features/documents/CompletionBanner'
import { WhatsAppSetup } from '@/features/whatsapp/WhatsAppSetup'
import { Header } from '@/components/layout/Header'
import { RAGChatBot } from '@/components/shared/RAGChatBot'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import { useWizard } from '@/features/wizard/useWizard'
import { useDocuments } from '@/stores/documents'
import { useStudentProfile } from '@/stores/student-profile'
import { useState } from 'react'
import { ChevronRight, FileText, Bot, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'

export default function DocumentsPage() {
  // Initialize wizard session for document uploads
  const { sessionId, isLoading, currentStep, nextStep, prevStep, formData, updateFormData, wizardTree, currentSection, progress } = useWizard()
  const { documents } = useDocuments()
  const [localAnswers, setLocalAnswers] = useState<Record<string, any>>({})
  const [questionsCompleted, setQuestionsCompleted] = useState(0)
  
  // Check if user has uploaded documents
  const hasUploadedDocuments = documents.length > 0
  const completedDocuments = documents.filter(doc => doc.status === 'completed').length

  // Handle input changes with autosave
  const handleInputChange = (questionId: string, value: any) => {
    setLocalAnswers(prev => ({ ...prev, [questionId]: value }))
    updateFormData(questionId, value)
    
    // Update completion count
    const completed = Object.keys({ ...formData, [questionId]: value }).filter(key => 
      formData[key] && formData[key] !== ''
    ).length
    setQuestionsCompleted(completed)
  }

  // Render different question types with enhanced styling
  const renderQuestion = (question: any) => {
    const value = localAnswers[question.id] || formData[question.id] || ''

    switch (question.type) {
      case 'text':
        return (
          <div className="relative">
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder={`Enter ${question.question.toLowerCase()}`}
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            />
            {value && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
            )}
          </div>
        )

      case 'single_choice':
        return (
          <select
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          >
            <option value="">Select an option</option>
            {question.options?.map((option: any, idx: number) => {
              const optionValue = typeof option === 'string' ? option : option.value
              const optionLabel = typeof option === 'string' ? option : option.label
              
              return (
                <option key={idx} value={optionValue}>
                  {optionLabel}
                </option>
              )
            })}
          </select>
        )

      case 'yes_no':
        return (
          <div className="flex gap-4">
            {['Yes', 'No'].map((option) => (
              <label key={option} className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                value === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className="text-blue-500"
                />
                <span className="font-medium">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'date':
        return (
          <input
            type="date"
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          />
        )

      default:
        return (
          <input
            type="text"
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            placeholder={`Enter ${question.question.toLowerCase()}`}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Document Management & Application
          </h1>
          <p className="text-gray-600">
            Upload your documents and complete your visa application questionnaire.
          </p>
        </div>

        {/* WhatsApp Upload Option */}
        <div className="mb-8">
          <WhatsAppSetup sessionId={sessionId || undefined} />
        </div>
        
        {/* Upload Documents Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Upload Documents
                </CardTitle>
                <CardDescription>
                  Drag and drop your files or click to browse. We'll extract information automatically.
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

        {/* Smart Questionnaire Section */}
        {wizardTree?.sections && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Bot className="w-8 h-8 text-blue-500" />
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Application Questionnaire
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Complete the questionnaire below. When you upload documents, we'll auto-fill relevant fields using OCR technology.
              </p>
            </div>

            {/* Progress Dashboard */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
                    <div className="text-sm text-gray-600">Documents Uploaded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{questionsCompleted}</div>
                    <div className="text-sm text-gray-600">Questions Answered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{Math.round(progress)}%</div>
                    <div className="text-sm text-gray-600">Progress Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{currentStep}</div>
                    <div className="text-sm text-gray-600">Current Step</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-white rounded-full h-3 mt-6">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Step Navigation */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4 overflow-x-auto pb-4">
                {wizardTree.sections.map((section, index) => (
                  <div key={section.id} className="flex items-center">
                    <div className={`flex items-center justify-center min-w-10 h-10 rounded-full border-2 transition-all ${
                      index + 1 === currentStep 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : index + 1 < currentStep 
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 text-gray-500'
                    }`}>
                      {index + 1 < currentStep ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="ml-2 hidden sm:block">
                      <div className="text-sm font-medium">{section.title}</div>
                      <div className="text-xs text-gray-500">{section.description}</div>
                    </div>
                    {index < wizardTree.sections.length - 1 && (
                      <ChevronRight className="w-4 h-4 mx-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Current Step Content */}
            {currentSection && (
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {currentStep}
                    </div>
                    {currentSection.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {currentSection.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {currentSection.questions.map((question, index) => (
                      <div key={question.id} className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium mt-1">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              {question.question}
                              {question.required && <span className="text-red-500 ml-1">*</span>}
                              {formData[question.id] && (
                                <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                                  OCR Filled
                                </Badge>
                              )}
                            </label>
                            {renderQuestion(question)}
                            {(question as any).help && (
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {(question as any).help}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-8 border-t">
                    <Button 
                      variant="outline" 
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center gap-2"
                    >
                      ← Previous Step
                    </Button>
                    <Button 
                      onClick={nextStep}
                      className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
                    >
                      Next Step →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* OCR Status Card */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Bot className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="font-medium text-green-800">OCR Auto-Fill Ready</div>
                    <div className="text-sm text-green-600">
                      Upload documents above and we'll automatically fill relevant questionnaire fields.
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">Ready</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Completion CTA - Show when both documents and questionnaire are done */}
        {hasUploadedDocuments && (
          <div className="mt-8">
            <CompletionBanner />
          </div>
        )}
      </div>

      {/* RAG ChatBot - Fixed position at bottom right */}
      <RAGChatBot />
    </div>
  )
} 