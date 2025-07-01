'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { useWizard } from './useWizard'

export function WizardStepper() {
  const { 
    currentStep, 
    nextStep, 
    prevStep, 
    formData, 
    updateFormData,
    wizardTree,
    currentSection,
    isLoading,
    error,
    isFirstStep,
    isLastStep,
    progress
  } = useWizard()

  const [localAnswers, setLocalAnswers] = useState<Record<string, any>>({})

  // Handle input changes with autosave
  const handleInputChange = (questionId: string, value: any) => {
    setLocalAnswers(prev => ({ ...prev, [questionId]: value }))
    updateFormData(questionId, value)
  }

  // Render different question types
  const renderQuestion = (question: any) => {
    const value = localAnswers[question.id] || formData[question.id] || ''

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder={`Enter ${question.question.toLowerCase()}`}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          />
        )

      case 'single_choice':
        return (
          <select
            className="w-full p-2 border rounded-md"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          >
            <option value="">Select an option</option>
            {question.options?.map((option: any, idx: number) => {
              // Handle both string options and object options
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
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                />
                {option}
              </label>
            ))}
          </div>
        )

      case 'date':
        return (
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          />
        )

      default:
        return (
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder={`Enter ${question.question.toLowerCase()}`}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
          />
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3">Loading wizard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <h3 className="text-lg font-medium">Error loading wizard</h3>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  if (!wizardTree || !currentSection) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No wizard data available</p>
      </div>
    )
  }

  const sections = wizardTree.sections

  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-between">
        {sections.map((section, index) => (
          <div key={section.id} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index + 1 <= currentStep 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            <div className="ml-2 hidden sm:block">
              <div className="text-sm font-medium">{section.title}</div>
              <div className="text-xs text-gray-500">{section.description}</div>
            </div>
            {index < sections.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${
                index + 1 < currentStep ? 'bg-primary' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle>
            Step {currentStep}: {currentSection.title}
          </CardTitle>
          <CardDescription>
            {currentSection.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Render current section questions */}
          {currentSection.questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <label className="block text-sm font-medium">
                {question.question}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderQuestion(question)}
            </div>
          ))}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={isFirstStep}
            >
              Previous
            </Button>
            <Button 
              onClick={nextStep}
              disabled={isLastStep}
            >
              {isLastStep ? 'Complete' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 