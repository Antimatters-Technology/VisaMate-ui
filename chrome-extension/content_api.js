// Content script for IRCC Autofill Helper with API Integration
console.log('IRCC Autofill Helper with API Integration loaded');

let answers = {};
let isAutofilling = false;
let apiBaseUrl = 'http://localhost:8000'; // Change this to your server URL

// API Configuration
const API_CONFIG = {
    baseUrl: apiBaseUrl,
    endpoints: {
        answers: '/api/questionnaire/answers',
        health: '/health'
    }
};

// Load answers from API
async function loadAnswersFromAPI(studentId = 'default') {
    try {
        console.log('🔄 Fetching answers from API...');
        
        const response = await fetch(`${API_CONFIG.baseUrl}/api/questionnaire/answers/${studentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        answers = data.answers;
        
        console.log('✅ Answers loaded from API:', Object.keys(answers).length, 'questions');
        return true;
    } catch (error) {
        console.error('❌ Failed to load answers from API:', error);
        
        // Fallback to local storage
        console.log('🔄 Falling back to local storage...');
        return await loadAnswersFromStorage();
    }
}

// Load answers from Chrome storage (fallback)
async function loadAnswersFromStorage() {
    try {
        const result = await chrome.storage.sync.get('answers');
        if (result.answers) {
            answers = result.answers;
            console.log('✅ Answers loaded from storage:', Object.keys(answers).length, 'questions');
            return true;
        } else {
            console.warn('⚠️ No answers found in storage');
            return false;
        }
    } catch (error) {
        console.error('❌ Failed to load answers from storage:', error);
        return false;
    }
}

// Check API health
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/health`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Health Check:', data);
            return true;
        }
    } catch (error) {
        console.warn('⚠️ API Health Check failed:', error);
        return false;
    }
}

// Initialize
async function initialize() {
    console.log('🚀 Initializing IRCC Autofill Helper...');
    
    // Check API health first
    const apiHealthy = await checkAPIHealth();
    
    if (apiHealthy) {
        await loadAnswersFromAPI();
    } else {
        await loadAnswersFromStorage();
    }
}

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
            await initialize();
        }
        
        if (Object.keys(answers).length === 0) {
            console.warn('⚠️ No answers available for autofill');
            showAutofillStatus('No answers available', 'warning');
            return;
        }
        
        // Find all question elements
        const questionElements = findQuestionElements();
        console.log(`🔍 Found ${questionElements.length} question elements`);
        
        let filledCount = 0;
        let skippedCount = 0;
        
        for (const element of questionElements) {
            const questionText = extractQuestionText(element);
            if (questionText && answers[questionText]) {
                const answer = answers[questionText];
                if (fillField(element, answer, questionText)) {
                    filledCount++;
                } else {
                    skippedCount++;
                }
            } else {
                skippedCount++;
            }
        }
        
        console.log(`✅ Autofill completed: ${filledCount} filled, ${skippedCount} skipped`);
        showAutofillStatus(`Autofilled ${filledCount} questions`, 'success');
        
        // Check for next button and click if available
        setTimeout(checkAndClickNext, 1000);
        
    } catch (error) {
        console.error('❌ Autofill error:', error);
        showAutofillStatus('Autofill failed', 'error');
    } finally {
        isAutofilling = false;
    }
}

// Find question elements on the page
function findQuestionElements() {
    const selectors = [
        'legend',
        '[class*="question"]',
        '[class*="Question"]',
        'label[for]',
        'div[role="group"]',
        'fieldset'
    ];
    
    const elements = [];
    selectors.forEach(selector => {
        const found = document.querySelectorAll(selector);
        elements.push(...Array.from(found));
    });
    
    return elements;
}

// Extract question text from element
function extractQuestionText(element) {
    let text = '';
    
    // Try different methods to extract text
    if (element.tagName === 'LEGEND') {
        text = element.textContent.trim();
    } else if (element.querySelector('legend')) {
        text = element.querySelector('legend').textContent.trim();
    } else if (element.querySelector('label')) {
        text = element.querySelector('label').textContent.trim();
    } else {
        text = element.textContent.trim();
    }
    
    return normalizeText(text);
}

// Normalize text for matching
function normalizeText(text) {
    return text
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s?.,]/g, '')
        .trim();
}

// Fill a field with the given answer
function fillField(questionElement, answer, questionText) {
    try {
        const inputField = findInputField(questionElement, answer);
        if (!inputField) {
            console.log(`⚠️ No input field found for: ${questionText}`);
            return false;
        }
        
        if (inputField.tagName === 'SELECT') {
            fillSelectElement(inputField, answer);
        } else if (inputField.type === 'date') {
            fillDateOfBirth(questionElement, answer);
        } else {
            fillInputElement(inputField, answer);
        }
        
        console.log(`✅ Filled: ${questionText} -> ${answer}`);
        return true;
    } catch (error) {
        console.error(`❌ Error filling field for ${questionText}:`, error);
        return false;
    }
}

// Find input field for the question
function findInputField(questionElement, answer) {
    // Look for select elements first
    let select = questionElement.querySelector('select');
    if (select) return select;
    
    // Look for input elements
    let input = questionElement.querySelector('input');
    if (input) return input;
    
    // Look in parent elements
    let parent = questionElement.parentElement;
    while (parent && parent !== document.body) {
        select = parent.querySelector('select');
        if (select) return select;
        
        input = parent.querySelector('input');
        if (input) return input;
        
        parent = parent.parentElement;
    }
    
    return null;
}

// Fill select element
function fillSelectElement(select, answer) {
    const options = Array.from(select.options);
    
    for (const option of options) {
        const optionText = normalizeText(option.textContent);
        const answerText = normalizeText(answer);
        
        if (optionText.includes(answerText) || answerText.includes(optionText)) {
            select.value = option.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }
    }
    
    return false;
}

// Fill input element
function fillInputElement(input, answer) {
    if (input.type === 'text' || input.type === 'email') {
        input.value = answer;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    }
    
    return false;
}

// Fill date of birth
function fillDateOfBirth(questionElement, dateString) {
    if (dateString === 'Personal') {
        console.log('ℹ️ Date of birth marked as Personal - user needs to fill manually');
        return false;
    }
    
    const dateInput = questionElement.querySelector('input[type="date"]');
    if (dateInput) {
        const formattedDate = convertToDateFormat(dateString);
        if (formattedDate) {
            dateInput.value = formattedDate;
            dateInput.dispatchEvent(new Event('input', { bubbles: true }));
            dateInput.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }
    }
    
    return false;
}

// Convert date string to YYYY-MM-DD format
function convertToDateFormat(dateString) {
    if (dateString === 'Personal') return null;
    
    // Handle different date formats
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
    }
    
    return null;
}

// Show autofill status
function showAutofillStatus(message, type = 'info') {
    const statusDiv = document.createElement('div');
    statusDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 15px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    
    switch (type) {
        case 'success':
            statusDiv.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            statusDiv.style.backgroundColor = '#f44336';
            break;
        case 'warning':
            statusDiv.style.backgroundColor = '#ff9800';
            break;
        default:
            statusDiv.style.backgroundColor = '#2196F3';
    }
    
    statusDiv.textContent = `IRCC Autofill: ${message}`;
    document.body.appendChild(statusDiv);
    
    setTimeout(() => {
        if (statusDiv.parentNode) {
            statusDiv.parentNode.removeChild(statusDiv);
        }
    }, 3000);
}

// Check and click next button
function checkAndClickNext() {
    const nextButton = findNextButton();
    if (nextButton) {
        console.log('🔄 Clicking next button...');
        nextButton.click();
    }
}

// Find next button
function findNextButton() {
    const selectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:contains("Next")',
        'button:contains("Continue")',
        'a:contains("Next")',
        'a:contains("Continue")'
    ];
    
    for (const selector of selectors) {
        const button = document.querySelector(selector);
        if (button && button.offsetParent !== null) {
            return button;
        }
    }
    
    return null;
}

// Initialize the extension
initialize(); 