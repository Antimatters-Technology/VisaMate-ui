// Enhanced Content script for VisaMate Chrome Extension
// Provides autofill capabilities and automatic form progression

interface VisaPortalConfig {
  name: string
  selectors: {
    forms: string[]
    inputs: string[]
    nextButton: string[]
    errorMessages: string[]
    submitButton: string[]
  }
  fieldMappings: Record<string, string[]>
  autoFillEnabled: boolean
}

interface QuestionnaireAnswers {
  [key: string]: string
}

// Enhanced configuration for different visa portals
const PORTAL_CONFIGS: Record<string, VisaPortalConfig> = {
  'cic.gc.ca': {
    name: 'Immigration Canada',
    selectors: {
      forms: ['form[name="applicationForm"]', '.application-form', 'form'],
      inputs: ['input[type="text"]', 'input[type="email"]', 'input[type="date"]', 'select', 'textarea', 'input[type="radio"]', 'input[type="checkbox"]'],
      nextButton: ['#nextButton', '.btn-next', 'input[value="Next"]', 'button[type="submit"]'],
      errorMessages: ['.error-message', '.validation-error', '.alert-danger'],
      submitButton: ['input[type="submit"]', 'button[type="submit"]', '.btn-submit']
    },
    fieldMappings: {
      'What would you like to do in Canada?': ['purpose', 'visit_purpose', 'intention'],
      'How long are you planning to stay?': ['duration', 'stay_duration', 'visit_length'],
      'What country issued your passport?': ['passport_country', 'citizenship', 'nationality'],
      'What country do you currently live in?': ['current_country', 'residence_country', 'location'],
      'What is your date of birth?': ['birth_date', 'dob', 'date_of_birth'],
      'Do you have a provincial attestation letter (PAL) or territorial attestation letter (TAL)?': ['pal_tal', 'attestation_letter'],
      'Which province or territory issued your attestation letter?': ['attestation_province', 'pal_province'],
      'Have you been accepted to a designated learning institution (DLI)?': ['dli_accepted', 'institution_acceptance'],
      'What is the name of your institution?': ['institution_name', 'school_name', 'university'],
      'What program will you be studying?': ['program', 'study_program', 'course'],
      'Do you have a Guaranteed Investment Certificate (GIC) that meets Student Direct Stream (SDS) requirements?': ['gic_sds', 'gic'],
      'Have you paid your first year tuition in full?': ['tuition_paid', 'fees_paid'],
      'What is the amount of your GIC (in CAD)?': ['gic_amount', 'investment_amount'],
      'Have you taken a language test in the past 2 years?': ['language_test', 'english_test'],
      'What type of language test did you take?': ['test_type', 'language_test_type'],
      'IELTS Listening score': ['ielts_listening', 'listening_score'],
      'IELTS Reading score': ['ielts_reading', 'reading_score'],
      'IELTS Writing score': ['ielts_writing', 'writing_score'],
      'IELTS Speaking score': ['ielts_speaking', 'speaking_score']
    },
    autoFillEnabled: true
  },
  'localhost': {
    name: 'Localhost Test',
    selectors: {
      forms: ['form', '#applicationForm'],
      inputs: ['input', 'select', 'textarea'],
      nextButton: ['button[type="submit"]'],
      errorMessages: [],
      submitButton: ['button[type="submit"]']
    },
    fieldMappings: {
      'What would you like to do in Canada?': ['purpose'],
      'How long are you planning to stay?': ['duration'],
      'What country issued your passport?': ['passport_country'],
      'What country do you currently live in?': ['current_country'],
      'What is your date of birth?': ['dob']
    },
    autoFillEnabled: true
  },
  'homeaffairs.gov.au': {
    name: 'Australian Immigration',
    selectors: {
      forms: ['.visa-form', '#applicationForm', 'form'],
      inputs: ['input', 'select', 'textarea'],
      nextButton: ['.btn-primary', '#continue-btn', 'button[type="submit"]'],
      errorMessages: ['.field-validation-error', '.error'],
      submitButton: ['input[type="submit"]', 'button[type="submit"]']
    },
    fieldMappings: {
      'What would you like to do in Canada?': ['purpose', 'visit_purpose'],
      'What country issued your passport?': ['passport_country', 'citizenship'],
      'What country do you currently live in?': ['current_country', 'residence']
    },
    autoFillEnabled: true
  }
}

class VisaMateAutofillAssistant {
  private config: VisaPortalConfig | null = null
  private helperPanel: HTMLElement | null = null
  private questionnaireAnswers: QuestionnaireAnswers = {}
  private isAutoFillEnabled: boolean = false
  private currentForm: HTMLFormElement | null = null
  private fillProgress: { total: number; filled: number } = { total: 0, filled: 0 }

  constructor() {
    this.init()
  }

  async init() {
    // Detect which portal we're on
    const hostname = window.location.hostname
    for (const [domain, config] of Object.entries(PORTAL_CONFIGS)) {
      if (hostname.includes(domain)) {
        this.config = config
        break
      }
    }

    if (this.config) {
      await this.loadQuestionnaireAnswers()
      this.setupAssistant()
    }
  }

  async loadQuestionnaireAnswers() {
    try {
      // Request answers from background script
      const response = await chrome.runtime.sendMessage({ action: 'getAnswers' })
      
      if (response.error) {
        console.error('Failed to load questionnaire answers:', response.error)
        return
      }

      this.questionnaireAnswers = response.answers || {}
      console.log('Loaded questionnaire answers:', this.questionnaireAnswers)
    } catch (error) {
      console.error('Error loading questionnaire answers:', error)
    }
  }

  setupAssistant() {
    // Create enhanced helper panel
    this.createHelperPanel()
    
    // Monitor forms for autofill
    this.monitorForms()
    
    // Add helpful tooltips
    this.addTooltips()
    
    // Monitor for errors
    this.monitorErrors()

    // Auto-detect and fill forms when loaded
    this.setupFormDetection()
  }

  createHelperPanel() {
    this.helperPanel = document.createElement('div')
    this.helperPanel.id = 'visamate-helper-panel'
    this.helperPanel.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        padding: 16px;
        min-width: 320px;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 24px; margin-right: 8px;">��</span>
          <strong>VisaMate Assistant</strong>
          <button id="visamate-close" style="margin-left: auto; border: none; background: none; font-size: 18px; cursor: pointer;">&times;</button>
        </div>
        
        <div id="visamate-content">
          <p style="margin: 0; color: #666; font-size: 14px; margin-bottom: 12px;">
            AI-powered assistance for ${this.config?.name}
          </p>
          
          <div style="margin-bottom: 12px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input type="checkbox" id="visamate-autofill-toggle" style="margin-right: 8px;" ${this.isAutoFillEnabled ? 'checked' : ''}>
              <span style="font-size: 13px;">Enable Auto-fill</span>
            </label>
          </div>
          
          <div id="visamate-autofill-controls" style="margin-bottom: 12px; ${this.isAutoFillEnabled ? '' : 'display: none;'}">
            <button id="visamate-fill-form" style="
              width: 100%;
              padding: 8px;
              background: #2563eb;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 13px;
              margin-bottom: 8px;
            ">Fill Current Form</button>
            
            <button id="visamate-next-button" style="
              width: 100%;
              padding: 8px;
              background: #059669;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 13px;
            ">Click Next</button>
          </div>
          
          <div id="visamate-progress" style="margin-bottom: 12px; display: none;">
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
              Fill Progress: <span id="progress-text">0/0</span>
            </div>
            <div style="background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
              <div id="progress-bar" style="background: #2563eb; height: 100%; width: 0%; transition: width 0.3s;"></div>
            </div>
          </div>
          
          <div id="visamate-tips" style="margin-top: 12px;"></div>
          
          <div id="visamate-status" style="margin-top: 12px; font-size: 12px; color: #666;"></div>
        </div>
      </div>
    `
    
    document.body.appendChild(this.helperPanel)
    
    // Add event listeners
    this.setupEventListeners()
  }

  setupEventListeners() {
    // Close button
    const closeBtn = document.getElementById('visamate-close')
    closeBtn?.addEventListener('click', () => {
      this.helperPanel?.remove()
    })

    // Auto-fill toggle
    const toggleBtn = document.getElementById('visamate-autofill-toggle') as HTMLInputElement
    toggleBtn?.addEventListener('change', (e) => {
      this.isAutoFillEnabled = (e.target as HTMLInputElement).checked
      const controls = document.getElementById('visamate-autofill-controls')
      if (controls) {
        controls.style.display = this.isAutoFillEnabled ? 'block' : 'none'
      }
    })

    // Fill form button
    const fillBtn = document.getElementById('visamate-fill-form')
    fillBtn?.addEventListener('click', () => {
      this.fillCurrentForm()
    })

    // Next button
    const nextBtn = document.getElementById('visamate-next-button')
    nextBtn?.addEventListener('click', () => {
      this.clickNextButton()
    })
  }

  setupFormDetection() {
    // Detect forms on page load
    this.detectAndPrepareForm()

    // Watch for dynamically loaded forms
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            if (element.tagName === 'FORM' || element.querySelector('form')) {
              this.detectAndPrepareForm()
            }
          }
        })
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  detectAndPrepareForm() {
    if (!this.config) return

    // Find the current form
    for (const selector of this.config.selectors.forms) {
      const form = document.querySelector(selector) as HTMLFormElement
      if (form) {
        this.currentForm = form
        this.analyzeForm(form)
        break
      }
    }
  }

  analyzeForm(form: HTMLFormElement) {
    const inputs = form.querySelectorAll(this.config!.selectors.inputs.join(', '))
    this.fillProgress.total = inputs.length
    this.fillProgress.filled = 0

    // Count already filled inputs
    inputs.forEach(input => {
      const inputElement = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      if (inputElement.value && inputElement.value.trim() !== '') {
        this.fillProgress.filled++
      }
    })

    this.updateProgressDisplay()
    this.updateStatus(`Found form with ${inputs.length} fields`)

    // Auto-fill if enabled and answers are available
    if (this.isAutoFillEnabled && Object.keys(this.questionnaireAnswers).length > 0) {
      setTimeout(() => this.fillCurrentForm(), 1000) // Small delay for page stability
    }
  }

  async fillCurrentForm() {
    if (!this.currentForm || !this.config) {
      this.updateStatus('No form found to fill')
      return
    }

    if (Object.keys(this.questionnaireAnswers).length === 0) {
      this.updateStatus('No questionnaire answers available')
      return
    }

    this.updateStatus('Filling form...')
    let filledCount = 0

    const inputs = this.currentForm.querySelectorAll(this.config.selectors.inputs.join(', '))

    for (const input of Array.from(inputs)) {
      const inputElement = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      const filled = await this.fillInputField(inputElement)
      if (filled) {
        filledCount++
        this.fillProgress.filled++
        this.updateProgressDisplay()
        
        // Small delay between fills for natural behavior
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    this.updateStatus(`Auto-filled ${filledCount} fields`)

    // Auto-click next if all fields are filled
    if (this.fillProgress.filled >= this.fillProgress.total * 0.8) { // 80% completion threshold
      setTimeout(() => {
        this.showAutoProgressOption()
      }, 2000)
    }
  }

  async fillInputField(inputElement: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): Promise<boolean> {
    // Skip if already filled
    if (inputElement.value && inputElement.value.trim() !== '') {
      return false
    }

    const fieldIdentifiers = this.getFieldIdentifiers(inputElement)
    let matchedAnswer: string | null = null

    // Try to find matching answer
    for (const [question, answer] of Object.entries(this.questionnaireAnswers)) {
      const questionMappings = this.config!.fieldMappings[question] || []
      
      // Check if any field identifier matches the question mappings
      for (const identifier of fieldIdentifiers) {
        if (questionMappings.some(mapping => 
          identifier.toLowerCase().includes(mapping.toLowerCase()) ||
          mapping.toLowerCase().includes(identifier.toLowerCase())
        )) {
          matchedAnswer = answer
          break
        }
      }

      // Also check direct question match
      if (!matchedAnswer) {
        for (const identifier of fieldIdentifiers) {
          if (question.toLowerCase().includes(identifier.toLowerCase()) ||
              identifier.toLowerCase().includes(question.toLowerCase().substring(0, 20))) {
            matchedAnswer = answer
            break
          }
        }
      }

      if (matchedAnswer) break
    }

    if (matchedAnswer) {
      return await this.setFieldValue(inputElement, matchedAnswer)
    }

    return false
  }

  getFieldIdentifiers(element: HTMLElement): string[] {
    const identifiers: string[] = []

    // Get various attributes that might identify the field
    const attributes = ['name', 'id', 'placeholder', 'aria-label', 'data-field', 'class']
    
    attributes.forEach(attr => {
      const value = element.getAttribute(attr)
      if (value) {
        identifiers.push(value)
      }
    })

    // Get label text
    const label = this.findLabelForInput(element)
    if (label) {
      identifiers.push(label)
    }

    // Get nearby text content
    const nearbyText = this.getNearbyText(element)
    if (nearbyText) {
      identifiers.push(nearbyText)
    }

    return identifiers
  }

  findLabelForInput(input: HTMLElement): string | null {
    // Find associated label
    const inputId = input.getAttribute('id')
    if (inputId) {
      const label = document.querySelector(`label[for="${inputId}"]`)
      if (label) {
        return label.textContent?.trim() || null
      }
    }

    // Find parent label
    const parentLabel = input.closest('label')
    if (parentLabel) {
      return parentLabel.textContent?.trim() || null
    }

    return null
  }

  getNearbyText(element: HTMLElement): string | null {
    // Look for text in parent elements
    let current = element.parentElement
    while (current && current !== document.body) {
      const text = current.textContent?.trim()
      if (text && text.length < 200 && text.length > 3) {
        return text
      }
      current = current.parentElement
    }
    return null
  }

  async setFieldValue(element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, value: string): Promise<boolean> {
    try {
      if (element.type === 'radio') {
        // For radio buttons, find the one that matches the value
        const radioGroup = document.querySelectorAll(`input[name="${element.name}"]`) as NodeListOf<HTMLInputElement>
        for (const radio of Array.from(radioGroup)) {
          if (radio.value === value || radio.getAttribute('data-value') === value) {
            radio.checked = true
            radio.dispatchEvent(new Event('change', { bubbles: true }))
            return true
          }
        }
      } else if (element.type === 'checkbox') {
        // For checkboxes, check based on value
        const checkbox = element as HTMLInputElement
        checkbox.checked = value.toLowerCase() === 'yes' || value.toLowerCase() === 'true'
        checkbox.dispatchEvent(new Event('change', { bubbles: true }))
        return true
      } else if (element.tagName === 'SELECT') {
        // For select elements, find matching option
        const select = element as HTMLSelectElement
        for (const option of Array.from(select.options)) {
          if (option.text.includes(value) || option.value === value) {
            select.value = option.value
            select.dispatchEvent(new Event('change', { bubbles: true }))
            return true
          }
        }
      } else {
        // For text inputs, textareas
        element.value = value
        element.dispatchEvent(new Event('input', { bubbles: true }))
        element.dispatchEvent(new Event('change', { bubbles: true }))
        return true
      }
    } catch (error) {
      console.error('Error setting field value:', error)
    }

    return false
  }

  showAutoProgressOption() {
    const tipsContainer = document.getElementById('visamate-tips')
    if (tipsContainer) {
      tipsContainer.innerHTML = `
        <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 4px; padding: 8px; font-size: 12px;">
          <strong>✅ Form filled successfully!</strong><br>
          <button id="auto-progress-btn" style="
            margin-top: 8px;
            padding: 6px 12px;
            background: #16a34a;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
          ">Continue to Next Page</button>
        </div>
      `

      const autoProgressBtn = document.getElementById('auto-progress-btn')
      autoProgressBtn?.addEventListener('click', () => {
        this.clickNextButton()
      })
    }
  }

  clickNextButton() {
    if (!this.config) return

    // Try to find and click the next button
    for (const selector of this.config.selectors.nextButton) {
      const button = document.querySelector(selector) as HTMLElement
      if (button && button.offsetParent !== null) { // Check if visible
        this.updateStatus('Clicking next button...')
        button.click()
        
        setTimeout(() => {
          this.updateStatus('Navigated to next page')
          // Reset progress for new page
          this.fillProgress = { total: 0, filled: 0 }
          this.updateProgressDisplay()
        }, 1000)
        
        return
      }
    }

    this.updateStatus('No next button found')
  }

  updateProgressDisplay() {
    const progressText = document.getElementById('progress-text')
    const progressBar = document.getElementById('progress-bar')
    const progressContainer = document.getElementById('visamate-progress')

    if (progressText && progressBar && progressContainer) {
      progressText.textContent = `${this.fillProgress.filled}/${this.fillProgress.total}`
      
      const percentage = this.fillProgress.total > 0 
        ? (this.fillProgress.filled / this.fillProgress.total) * 100 
        : 0
      
      progressBar.style.width = `${percentage}%`
      progressContainer.style.display = this.fillProgress.total > 0 ? 'block' : 'none'
    }
  }

  updateStatus(message: string) {
    const statusElement = document.getElementById('visamate-status')
    if (statusElement) {
      statusElement.textContent = message
      console.log('VisaMate:', message)
    }
  }

  monitorForms() {
    if (!this.config) return

    // Watch for form field focus
    this.config.selectors.inputs.forEach(selector => {
      const inputs = document.querySelectorAll(selector)
      inputs.forEach(input => {
        input.addEventListener('focus', (e) => {
          this.showFieldHelp(e.target as HTMLElement)
        })
      })
    })
  }

  showFieldHelp(field: HTMLElement) {
    const fieldIdentifiers = this.getFieldIdentifiers(field)
    const fieldName = fieldIdentifiers[0] || 'this field'
    
    // Check if we have an answer for this field
    let hasAnswer = false
    for (const [question, answer] of Object.entries(this.questionnaireAnswers)) {
      for (const identifier of fieldIdentifiers) {
        if (question.toLowerCase().includes(identifier.toLowerCase()) ||
            identifier.toLowerCase().includes(question.toLowerCase().substring(0, 15))) {
          hasAnswer = true
          break
        }
      }
      if (hasAnswer) break
    }

    const tipsContainer = document.getElementById('visamate-tips')
    if (tipsContainer) {
      tipsContainer.innerHTML = `
        <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 4px; padding: 8px; font-size: 12px;">
          <strong>💡 Field: ${fieldName}</strong><br>
          ${hasAnswer 
            ? '✅ We have an answer for this field in your questionnaire' 
            : '⚠️ No matching answer found in questionnaire'
          }
        </div>
      `
    }
  }

  addTooltips() {
    // Add helpful tooltips to common form fields
    const commonFields = [
      { selector: 'input[name*="firstName"]', text: 'Use your full first name as shown on passport' },
      { selector: 'input[name*="lastName"]', text: 'Use your full last name as shown on passport' },
      { selector: 'input[type="email"]', text: 'Use a reliable email - important updates will be sent here' }
    ]

    commonFields.forEach(({ selector, text }) => {
      const fields = document.querySelectorAll(selector)
      fields.forEach(field => {
        field.setAttribute('title', text)
      })
    })
  }

  monitorErrors() {
    if (!this.config) return

    // Watch for error messages
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            this.config?.selectors.errorMessages.forEach(selector => {
              if (element.matches(selector) || element.querySelector(selector)) {
                this.handleError(element)
              }
            })
          }
        })
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  handleError(errorElement: Element) {
    // Show error assistance in helper panel
    const tipsContainer = document.getElementById('visamate-tips')
    if (tipsContainer) {
      tipsContainer.innerHTML = `
        <div style="background: #fef2f2; border: 1px solid #ef4444; border-radius: 4px; padding: 8px; font-size: 12px;">
          <strong>⚠️ Error detected:</strong><br>
          Please review the form entries. You may need to fill some fields manually.
        </div>
      `
    }
    this.updateStatus('Form validation error detected')
  }
}

// Initialize the assistant when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new VisaMateAutofillAssistant()
  })
} else {
  new VisaMateAutofillAssistant()
}

// Listen for messages from popup and background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    sendResponse({
      url: window.location.href,
      title: document.title,
      hasForm: document.querySelector('form') !== null,
      hasAnswers: Object.keys((window as any).questionnaireAnswers || {}).length > 0
    })
  } else if (request.action === 'fillForm') {
    const assistant = (window as any).visaMateAssistant
    if (assistant && assistant.fillCurrentForm) {
      assistant.fillCurrentForm()
      sendResponse({ success: true })
    } else {
      sendResponse({ success: false, error: 'Assistant not initialized' })
    }
  }
}) 