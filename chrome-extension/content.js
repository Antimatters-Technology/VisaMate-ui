// Content script for IRCC Autofill Helper
console.log('IRCC Autofill Helper content script loaded');

let answers = {};
let isAutofilling = false;

// Load answers from storage
async function loadAnswers() {
  try {
    const result = await chrome.storage.sync.get('answers');
    if (result.answers) {
      answers = result.answers;
      console.log('Answers loaded:', Object.keys(answers).length, 'questions');
    } else {
      console.warn('No answers found in storage');
    }
  } catch (error) {
    console.error('Failed to load answers:', error);
  }
}

// Initialize
loadAnswers();

// Listen for autofill trigger from background script
window.addEventListener('irccAutofill', (event) => {
  if (event.detail.trigger) {
    performAutofill();
  }
});

// Auto-fill when page loads and when DOM changes
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(performAutofill, 1000);
});

// Also run when page is fully loaded
window.addEventListener('load', () => {
  setTimeout(performAutofill, 1500);
});

// Run immediately if document is already loaded
if (document.readyState === 'loading') {
  // Document is still loading
} else if (document.readyState === 'interactive') {
  // Document has finished loading but resources may still be loading
  setTimeout(performAutofill, 500);
} else {
  // Document and all resources have finished loading
  setTimeout(performAutofill, 200);
}

// Watch for dynamic content changes and auto-fill
const observer = new MutationObserver((mutations) => {
  let shouldAutofill = false;
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      // Check if new form elements were added
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.querySelector && (node.querySelector('select') || node.querySelector('input') || node.tagName === 'SELECT' || node.tagName === 'INPUT')) {
            shouldAutofill = true;
          }
          // Also check for questionnaire-specific elements
          if (node.querySelector && (
            node.querySelector('[class*="question"]') || 
            node.querySelector('legend') ||
            node.textContent.includes('What would you like to do in Canada') ||
            node.textContent.includes('eligib')
          )) {
            shouldAutofill = true;
          }
        }
      });
    }
  });
  
  if (shouldAutofill && !isAutofilling) {
    console.log('🔄 Auto-detected new form elements, triggering autofill...');
    setTimeout(performAutofill, 800);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Main autofill function
async function performAutofill() {
  if (isAutofilling) return;
  isAutofilling = true;
  
  try {
    console.log('🚀 Starting autofill process...');
    
    if (Object.keys(answers).length === 0) {
      await loadAnswers();
    }
    
    if (Object.keys(answers).length === 0) {
      console.warn('No answers available for autofill');
      return;
    }
    
    // Check if we're on the right page
    const pageText = document.body.textContent.toLowerCase();
    if (!pageText.includes('find out if you') && !pageText.includes('eligib') && !pageText.includes('what would you like to do in canada')) {
      console.log('⏸️ Not on questionnaire page, skipping autofill');
      return;
    }
    
    let filledCount = 0;
    
    // Find all potential question elements
    const questionSelectors = [
      'label',
      'legend', 
      'h3',
      'h4',
      'h5',
      '.question',
      '.form-label',
      '[data-question]',
      'div[class*="question"]',
      'span[class*="question"]'
    ];
    
    const questionElements = document.querySelectorAll(questionSelectors.join(', '));
    
    questionElements.forEach((questionElement) => {
      const questionText = normalizeText(questionElement.innerText || questionElement.textContent);
      
      // Try to find exact match or close match
      let matchedAnswer = null;
      let matchedKey = null;
      
      // First try exact match
      for (const [key, value] of Object.entries(answers)) {
        if (normalizeText(key) === questionText) {
          matchedAnswer = value;
          matchedKey = key;
          break;
        }
      }
      
      // If no exact match, try partial match
      if (!matchedAnswer) {
        for (const [key, value] of Object.entries(answers)) {
          const normalizedKey = normalizeText(key);
          if (questionText.includes(normalizedKey) || normalizedKey.includes(questionText)) {
            if (questionText.length > 10 && normalizedKey.length > 10) { // Avoid matching very short strings
              matchedAnswer = value;
              matchedKey = key;
              break;
            }
          }
        }
      }
      
      if (matchedAnswer) {
        const filled = fillField(questionElement, matchedAnswer, questionText);
        if (filled) {
          filledCount++;
          console.log(`✓ Filled: "${matchedKey}" → "${matchedAnswer}"`);
        }
      }
    });
    
    console.log(`✅ Autofill completed. Filled ${filledCount} fields.`);
    
    // Show visual notification and handle next button
    if (filledCount > 0) {
      showAutofillStatus(`🎉 Auto-filled ${filledCount} questions!`, 'success');
      // Wait a moment then check if we should click next
      setTimeout(() => checkAndClickNext(), 1000);
    } else {
      // No fields filled - check if we should click next anyway
      showAutofillStatus('ℹ️ No new fields to fill', 'info');
      setTimeout(() => checkAndClickNext(), 500);
    }
    
    // Send message to background script
    chrome.runtime.sendMessage({
      action: 'autofillComplete',
      data: { filledCount }
    });
    
  } catch (error) {
    console.error('Autofill error:', error);
    chrome.runtime.sendMessage({
      action: 'autofillError',
      error: error.message
    });
  } finally {
    isAutofilling = false;
  }
}

// Normalize text for comparison
function normalizeText(text) {
  if (!text) return '';
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .toLowerCase();
}

// Fill a form field based on the question element
function fillField(questionElement, answer, questionText) {
  // Special handling for date of birth with 3 dropdowns
  if (questionText.includes('date of birth') || questionText.includes('birth')) {
    return fillDateOfBirth(questionElement, answer);
  }
  
  // Strategy 1: Look for select element using label's 'for' attribute
  if (questionElement.tagName === 'LABEL' && questionElement.htmlFor) {
    const select = document.getElementById(questionElement.htmlFor);
    if (select && fillSelectElement(select, answer)) {
      return true;
    }
  }
  
  // Strategy 2: Look for select element as a sibling or child
  let select = questionElement.querySelector('select');
  if (!select) {
    // Look in parent container
    const parent = questionElement.closest('div, fieldset, section');
    if (parent) {
      select = parent.querySelector('select');
    }
  }
  
  // Strategy 3: Look for select element as next sibling
  if (!select) {
    let nextElement = questionElement.nextElementSibling;
    while (nextElement && !select) {
      if (nextElement.tagName === 'SELECT') {
        select = nextElement;
        break;
      }
      select = nextElement.querySelector('select');
      nextElement = nextElement.nextElementSibling;
    }
  }
  
  // Strategy 4: Look for input fields (text, radio, checkbox)
  if (!select) {
    const input = findInputField(questionElement, answer);
    if (input) {
      return fillInputElement(input, answer);
    }
  }
  
  if (select) {
    return fillSelectElement(select, answer);
  }
  
  console.warn(`No form element found for question: "${questionText}"`);
  return false;
}

// Find input field associated with question
function findInputField(questionElement, answer) {
  // Look for input in question element and its container
  const containers = [
    questionElement,
    questionElement.parentElement,
    questionElement.closest('div, fieldset, section')
  ].filter(Boolean);
  
  for (const container of containers) {
    const inputs = container.querySelectorAll('input[type="text"], input[type="date"], input[type="email"], input[type="tel"]');
    if (inputs.length > 0) {
      return inputs[0]; // Return first input found
    }
    
    // Look for radio buttons or checkboxes
    const radioInputs = container.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    for (const radio of radioInputs) {
      const label = radio.closest('label') || document.querySelector(`label[for="${radio.id}"]`);
      if (label && normalizeText(label.textContent).includes(normalizeText(answer))) {
        return radio;
      }
    }
  }
  
  return null;
}

// Fill select element
function fillSelectElement(select, answer) {
  if (!select || select.tagName !== 'SELECT') return false;
  
  // Find option by text content
  const options = Array.from(select.options);
  
  // Try exact match first
  let option = options.find(opt => normalizeText(opt.textContent) === normalizeText(answer));
  
  // Try partial match
  if (!option) {
    option = options.find(opt => {
      const optText = normalizeText(opt.textContent);
      const answerText = normalizeText(answer);
      return optText.includes(answerText) || answerText.includes(optText);
    });
  }
  
  // For "Yes/No" questions, be more flexible
  if (!option && (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'no')) {
    option = options.find(opt => normalizeText(opt.textContent).startsWith(answer.toLowerCase()));
  }
  
  if (option && select.value !== option.value) {
    select.value = option.value;
    
    // Trigger events
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
    select.dispatchEvent(new Event('blur', { bubbles: true }));
    
    // Some sites use custom events
    select.dispatchEvent(new CustomEvent('update', { bubbles: true }));
    
    return true;
  }
  
  if (!option) {
    console.warn(`No option found for answer: "${answer}" in select with options:`, options.map(o => o.textContent));
  }
  
  return false;
}

// Fill input element
function fillInputElement(input, answer) {
  if (!input) return false;
  
  const inputType = input.type.toLowerCase();
  
  switch (inputType) {
    case 'text':
    case 'email':
    case 'tel':
      if (input.value !== answer) {
        input.value = answer;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      break;
      
    case 'date':
      // Handle date format conversion if needed
      const dateValue = convertToDateFormat(answer);
      if (dateValue && input.value !== dateValue) {
        input.value = dateValue;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      break;
      
    case 'radio':
    case 'checkbox':
      const shouldCheck = normalizeText(answer) === 'yes' || normalizeText(answer) === 'true';
      if (input.checked !== shouldCheck) {
        input.checked = shouldCheck;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      break;
  }
  
  return false;
}

// Convert date format (e.g., "May 4, 2003" to "2003-05-04")
function convertToDateFormat(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.warn('Date conversion failed:', dateString);
    return null;
  }
}

// Fill date of birth with 3 separate dropdowns (year, month, day)
function fillDateOfBirth(questionElement, dateString) {
  try {
    // Parse the date "May 4, 2003"
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date format:', dateString);
      return false;
    }
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const day = date.getDate();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[date.getMonth()];
    
    console.log(`Filling DOB: ${year}-${month}-${day} (${monthName} ${day}, ${year})`);
    
    // Find the container that holds all three dropdowns
    const container = questionElement.closest('div, fieldset, section') || questionElement.parentElement;
    if (!container) {
      console.warn('Could not find container for date dropdowns');
      return false;
    }
    
    // Find all select elements in the container
    const selects = container.querySelectorAll('select');
    if (selects.length < 3) {
      console.warn('Could not find 3 date dropdowns, found:', selects.length);
      return false;
    }
    
    let filled = 0;
    
    // Try to identify and fill each dropdown by analyzing their options
    selects.forEach((select, index) => {
      const options = Array.from(select.options);
      const optionTexts = options.map(opt => opt.textContent.toLowerCase().trim());
      
      // Check if this is the year dropdown (contains 4-digit years)
      if (optionTexts.some(text => /^\d{4}$/.test(text))) {
        const yearOption = options.find(opt => opt.textContent.trim() === year.toString());
        if (yearOption && select.value !== yearOption.value) {
          select.value = yearOption.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          select.dispatchEvent(new Event('input', { bubbles: true }));
          console.log(`✓ Filled year: ${year}`);
          filled++;
        }
      }
      // Check if this is the month dropdown (contains month names or numbers)
      else if (optionTexts.some(text => monthNames.map(m => m.toLowerCase()).includes(text))) {
        const monthOption = options.find(opt => 
          opt.textContent.toLowerCase().trim() === monthName.toLowerCase() ||
          opt.textContent.trim() === month.toString().padStart(2, '0') ||
          opt.textContent.trim() === month.toString()
        );
        if (monthOption && select.value !== monthOption.value) {
          select.value = monthOption.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          select.dispatchEvent(new Event('input', { bubbles: true }));
          console.log(`✓ Filled month: ${monthName}`);
          filled++;
        }
      }
      // Check if this is the day dropdown (contains 1-31)
      else if (optionTexts.some(text => /^[1-9]$|^[12]\d$|^3[01]$/.test(text))) {
        const dayOption = options.find(opt => 
          opt.textContent.trim() === day.toString() ||
          opt.textContent.trim() === day.toString().padStart(2, '0')
        );
        if (dayOption && select.value !== dayOption.value) {
          select.value = dayOption.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          select.dispatchEvent(new Event('input', { bubbles: true }));
          console.log(`✓ Filled day: ${day}`);
          filled++;
        }
      }
    });
    
    return filled > 0;
    
  } catch (error) {
    console.error('Error filling date of birth:', error);
    return false;
  }
}

// Add visual feedback
function showAutofillStatus(message, type = 'info') {
  // Remove existing status if present
  const existingStatus = document.getElementById('ircc-autofill-status');
  if (existingStatus) {
    existingStatus.remove();
  }
  
  // Create status element
  const status = document.createElement('div');
  status.id = 'ircc-autofill-status';
  status.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === 'error' ? '#f44336' : '#4CAF50'};
    color: white;
    border-radius: 4px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  status.textContent = message;
  
  document.body.appendChild(status);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (status.parentNode) {
      status.remove();
    }
  }, 3000);
}

// Check if all visible fields are filled and click Next if appropriate
function checkAndClickNext() {
  try {
    console.log('🔍 Checking if we should click Next...');
    
    // Check if there are any empty required fields visible
    const emptyRequiredFields = findEmptyRequiredFields();
    
    if (emptyRequiredFields.length > 0) {
      console.log(`⏸️ Found ${emptyRequiredFields.length} empty required fields, not clicking Next`);
      return;
    }
    
    // Look for Next/Continue/Submit buttons
    const nextButton = findNextButton();
    
    if (nextButton) {
      console.log('🎯 Found Next button, clicking it...');
      showAutofillStatus('➡️ Moving to next section...', 'info');
      
      // Scroll button into view if needed
      nextButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Wait a moment then click
      setTimeout(() => {
        nextButton.click();
        console.log('✅ Clicked Next button');
      }, 500);
      
    } else {
      console.log('❓ No Next button found');
    }
    
  } catch (error) {
    console.error('Error checking Next button:', error);
  }
}

// Find empty required fields on the current page
function findEmptyRequiredFields() {
  const emptyFields = [];
  
  // Check all select elements
  const selects = document.querySelectorAll('select');
  selects.forEach(select => {
    if (isFieldRequired(select) && (!select.value || select.value === '' || select.selectedIndex <= 0)) {
      emptyFields.push(select);
    }
  });
  
  // Check all input elements
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"]');
  inputs.forEach(input => {
    if (isFieldRequired(input) && (!input.value || input.value.trim() === '')) {
      emptyFields.push(input);
    }
  });
  
  // Check required radio button groups
  const radioGroups = {};
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    if (isFieldRequired(radio)) {
      if (!radioGroups[radio.name]) {
        radioGroups[radio.name] = [];
      }
      radioGroups[radio.name].push(radio);
    }
  });
  
  Object.values(radioGroups).forEach(group => {
    const hasSelection = group.some(radio => radio.checked);
    if (!hasSelection) {
      emptyFields.push(group[0]); // Add first radio as representative
    }
  });
  
  return emptyFields;
}

// Check if a field is required
function isFieldRequired(field) {
  // Check for required attribute
  if (field.required || field.hasAttribute('required')) {
    return true;
  }
  
  // Check for aria-required
  if (field.getAttribute('aria-required') === 'true') {
    return true;
  }
  
  // Check if associated label contains "(required)" text
  const label = field.closest('label') || document.querySelector(`label[for="${field.id}"]`);
  if (label && label.textContent.toLowerCase().includes('required')) {
    return true;
  }
  
  // Check for required indicator in nearby text
  const container = field.closest('div, fieldset, section');
  if (container && container.textContent.toLowerCase().includes('required')) {
    return true;
  }
  
  return false;
}

// Find the Next/Continue/Submit button
function findNextButton() {
  // Common button selectors and text patterns
  const buttonSelectors = [
    'button[type="submit"]',
    'input[type="submit"]',
    'button',
    'a[role="button"]',
    '.btn',
    '[class*="button"]'
  ];
  
  const nextTextPatterns = [
    /^next$/i,
    /^continue$/i,
    /^proceed$/i,
    /^submit$/i,
    /^update\s+information$/i,
    /^save\s+and\s+continue$/i,
    /^go\s+to\s+next$/i,
    /^next\s+step$/i,
    /^next\s+page$/i
  ];
  
  // Look for buttons with next-like text
  const allButtons = document.querySelectorAll(buttonSelectors.join(', '));
  
  for (const button of allButtons) {
    const buttonText = button.textContent.trim();
    const isNextButton = nextTextPatterns.some(pattern => pattern.test(buttonText));
    
    if (isNextButton) {
      // Make sure button is visible and enabled
      const rect = button.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0;
      const isEnabled = !button.disabled && !button.hasAttribute('disabled');
      
      if (isVisible && isEnabled) {
        console.log(`Found Next button: "${buttonText}"`);
        return button;
      }
    }
  }
  
  // Fallback: look for specific IRCC button patterns
  const irccButtons = document.querySelectorAll('[class*="btn"], [class*="button"]');
  for (const button of irccButtons) {
    if (button.textContent.includes('Update information') || 
        button.textContent.includes('Continue') ||
        button.textContent.includes('Next')) {
      const rect = button.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0;
      const isEnabled = !button.disabled;
      
      if (isVisible && isEnabled) {
        return button;
      }
    }
  }
  
  return null;
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.answers) {
    answers = changes.answers.newValue || {};
    console.log('Answers updated from storage');
  }
});

console.log('IRCC Autofill Helper ready'); 