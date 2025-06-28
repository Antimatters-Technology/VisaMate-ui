// Content script for VisaMate Chrome Extension
// This script runs on visa portal websites to provide assistance

interface VisaPortalConfig {
  name: string
  selectors: {
    forms: string[]
    inputs: string[]
    nextButton: string[]
    errorMessages: string[]
  }
  helpTexts: Record<string, string>
}

// Configuration for different visa portals
const PORTAL_CONFIGS: Record<string, VisaPortalConfig> = {
  'cic.gc.ca': {
    name: 'Immigration Canada',
    selectors: {
      forms: ['form[name="applicationForm"]', '.application-form'],
      inputs: ['input[type="text"]', 'input[type="email"]', 'select', 'textarea'],
      nextButton: ['#nextButton', '.btn-next', 'input[value="Next"]'],
      errorMessages: ['.error-message', '.validation-error', '.alert-danger']
    },
    helpTexts: {
      'firstName': 'Enter your first name as shown on your passport',
      'lastName': 'Enter your last name as shown on your passport',
      'email': 'Use a valid email address - you will receive important updates here',
      'dateOfBirth': 'Enter your date of birth in DD/MM/YYYY format'
    }
  },
  'homeaffairs.gov.au': {
    name: 'Australian Immigration',
    selectors: {
      forms: ['.visa-form', '#applicationForm'],
      inputs: ['input', 'select', 'textarea'],
      nextButton: ['.btn-primary', '#continue-btn'],
      errorMessages: ['.field-validation-error', '.error']
    },
    helpTexts: {
      'passport': 'Enter your passport number without spaces or special characters',
      'countryOfBirth': 'Select the country where you were born',
      'currentLocation': 'Select your current country of residence'
    }
  }
}

class VisaMateAssistant {
  private config: VisaPortalConfig | null = null
  private helperPanel: HTMLElement | null = null

  constructor() {
    this.init()
  }

  init() {
    // Detect which portal we're on
    const hostname = window.location.hostname
    for (const [domain, config] of Object.entries(PORTAL_CONFIGS)) {
      if (hostname.includes(domain)) {
        this.config = config
        break
      }
    }

    if (this.config) {
      this.setupAssistant()
    }
  }

  setupAssistant() {
    // Create floating helper panel
    this.createHelperPanel()
    
    // Monitor form changes
    this.monitorForms()
    
    // Add helpful tooltips
    this.addTooltips()
    
    // Monitor for errors
    this.monitorErrors()
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
        min-width: 300px;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <img src="${chrome.runtime.getURL('icons/icon32.png')}" style="width: 24px; height: 24px; margin-right: 8px;">
          <strong>VisaMate Assistant</strong>
          <button id="visamate-close" style="margin-left: auto; border: none; background: none; font-size: 18px; cursor: pointer;">&times;</button>
        </div>
        <div id="visamate-content">
          <p style="margin: 0; color: #666; font-size: 14px;">
            We're here to help with your ${this.config?.name} application!
          </p>
          <div id="visamate-tips" style="margin-top: 12px;"></div>
        </div>
      </div>
    `
    
    document.body.appendChild(this.helperPanel)
    
    // Add close functionality
    const closeBtn = document.getElementById('visamate-close')
    closeBtn?.addEventListener('click', () => {
      this.helperPanel?.remove()
    })
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
    if (!this.config) return

    const fieldName = field.getAttribute('name') || field.getAttribute('id') || ''
    const helpText = this.config.helpTexts[fieldName]
    
    if (helpText) {
      const tipsContainer = document.getElementById('visamate-tips')
      if (tipsContainer) {
        tipsContainer.innerHTML = `
          <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 4px; padding: 8px; font-size: 12px;">
            <strong>💡 Tip:</strong> ${helpText}
          </div>
        `
      }
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
          We've detected a form error. Check your entries and try again. 
          <a href="#" style="color: #2563eb;">Need help?</a>
        </div>
      `
    }
  }
}

// Initialize the assistant when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new VisaMateAssistant()
  })
} else {
  new VisaMateAssistant()
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    sendResponse({
      url: window.location.href,
      title: document.title,
      hasForm: document.querySelector('form') !== null
    })
  }
}) 