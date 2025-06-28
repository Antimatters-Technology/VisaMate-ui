import { useState, useEffect, useCallback } from 'react'
import { api } from '@/libs/api'

interface WizardQuestion {
  id: string
  type: 'single_choice' | 'multiple_choice' | 'yes_no' | 'text' | 'date' | 'country_select'
  question: string
  options?: string[]
  required: boolean
  validation?: string
}

interface WizardSection {
  id: string
  title: string
  description: string
  questions: WizardQuestion[]
}

interface WizardTree {
  sections: WizardSection[]
  current_section: string
  progress: number
}

interface WizardState {
  sessionId: string | null
  currentStep: number
  wizardTree: WizardTree | null
  formData: Record<string, any>
  isLoading: boolean
  error: string | null
}

export function useWizard() {
  const [state, setState] = useState<WizardState>({
    sessionId: null,
    currentStep: 1,
    wizardTree: null,
    formData: {},
    isLoading: false,
    error: null
  })

  // Initialize wizard session
  const initializeWizard = useCallback(async () => {
    if (state.sessionId) return // Already initialized

    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // Start a new wizard session
      const sessionResponse = await api.post('/wizard/start')
      const sessionId = sessionResponse.data.session_id

      // Get the wizard tree
      const treeResponse = await api.get(`/wizard/tree/${sessionId}`)
      const wizardTree: WizardTree = treeResponse.data

      setState(prev => ({
        ...prev,
        sessionId,
        wizardTree,
        isLoading: false
      }))

    } catch (error: any) {
      console.error('Failed to initialize wizard:', error)
      setState(prev => ({
        ...prev,
        error: error.response?.data?.detail || 'Failed to initialize wizard',
        isLoading: false
      }))
    }
  }, [state.sessionId])

  // Save answers to backend with autosave
  const saveAnswers = useCallback(async (answers: Record<string, any>, shouldAutosave = false) => {
    if (!state.sessionId) return

    try {
      await api.post(`/wizard/questionnaire/${state.sessionId}`, {
        answers,
        section_id: state.wizardTree?.current_section
      })

      // Update local state
      setState(prev => ({
        ...prev,
        formData: { ...prev.formData, ...answers }
      }))

      if (!shouldAutosave) {
        console.log('Answers saved successfully')
      }

    } catch (error: any) {
      console.error('Failed to save answers:', error)
      if (!shouldAutosave) {
        setState(prev => ({
          ...prev,
          error: error.response?.data?.detail || 'Failed to save answers'
        }))
      }
    }
  }, [state.sessionId, state.wizardTree?.current_section])

  // Update form data locally and trigger autosave
  const updateFormData = useCallback((key: string, value: any) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [key]: value }
    }))

    // Autosave after 2 second delay
    const timeoutId = setTimeout(() => {
      saveAnswers({ [key]: value }, true)
    }, 2000)

    // Cleanup previous timeout
    return () => clearTimeout(timeoutId)
  }, [saveAnswers])

  // Navigation functions
  const nextStep = useCallback(async () => {
    if (!state.wizardTree || !state.wizardTree.sections) return

    const currentSection = getCurrentSection()
    if (!currentSection) return

    // Save current section answers before moving
    await saveAnswers(state.formData)

    // Move to next step
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, state.wizardTree!.sections.length)
    }))
  }, [state.wizardTree, state.formData, saveAnswers])

  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1)
    }))
  }, [])

  // Get current section data
  const getCurrentSection = useCallback((): WizardSection | null => {
    if (!state.wizardTree || !state.wizardTree.sections) return null
    return state.wizardTree.sections[state.currentStep - 1] || null
  }, [state.wizardTree, state.currentStep])

  // Get document checklist
  const getDocumentChecklist = useCallback(async () => {
    if (!state.sessionId) return []

    try {
      const response = await api.get(`/wizard/document-checklist/${state.sessionId}`)
      return response.data.documents || []
    } catch (error: any) {
      console.error('Failed to get document checklist:', error)
      return []
    }
  }, [state.sessionId])

  // Initialize wizard on mount
  useEffect(() => {
    initializeWizard()
  }, [initializeWizard])

  return {
    // State
    sessionId: state.sessionId,
    currentStep: state.currentStep,
    wizardTree: state.wizardTree,
    formData: state.formData,
    isLoading: state.isLoading,
    error: state.error,
    
    // Current section data
    currentSection: getCurrentSection(),
    
    // Actions
    updateFormData,
    saveAnswers: (answers: Record<string, any>) => saveAnswers(answers, false),
    nextStep,
    prevStep,
    getDocumentChecklist,
    
    // Utils
    isFirstStep: state.currentStep === 1,
    isLastStep: state.currentStep === (state.wizardTree?.sections?.length || 1),
    progress: state.wizardTree?.progress || 0
  }
}