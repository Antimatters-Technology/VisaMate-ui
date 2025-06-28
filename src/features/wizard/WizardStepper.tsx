import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { useWizard } from './useWizard'

const steps = [
  { id: 1, title: 'Personal Information', description: 'Basic details and background' },
  { id: 2, title: 'Education', description: 'Academic qualifications' },
  { id: 3, title: 'Experience', description: 'Work experience and skills' },
  { id: 4, title: 'Documents', description: 'Upload required documents' },
  { id: 5, title: 'Review', description: 'Review and submit application' }
]

export function WizardStepper() {
  const { currentStep, nextStep, prevStep, formData, updateFormData } = useWizard()

  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step.id <= currentStep 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step.id}
            </div>
            <div className="ml-2 hidden sm:block">
              <div className="text-sm font-medium">{step.title}</div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${
                step.id < currentStep ? 'bg-primary' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle>
            Step {currentStep}: {steps[currentStep - 1]?.title}
          </CardTitle>
          <CardDescription>
            {steps[currentStep - 1]?.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Highest Education</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">Select education level</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Years of Experience</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter years of experience"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <p>Upload your required documents here.</p>
              <Badge variant="info">Document upload functionality coming soon</Badge>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <p>Please review your application before submitting.</p>
              <Badge variant="success">All steps completed!</Badge>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button 
              onClick={nextStep}
              disabled={currentStep === steps.length}
            >
              {currentStep === steps.length ? 'Submit' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 