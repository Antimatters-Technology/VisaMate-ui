// Content script for IRCC Autofill Helper - Simple Version
console.log('IRCC Autofill Helper (Simple) loaded');

let answers = {};
let isAutofilling = false;

// Load answers from local JSON file
async function loadAnswersFromFile() {
    try {
        console.log('🔄 Loading answers from local JSON file...');
        
        const response = await fetch(chrome.runtime.getURL('answers.json'));
        const data = await response.json();
        
        // Convert the answers format to match the expected structure
        answers = {};
        for (const answer of data.answers) {
            const questionNumber = answer.question_number;
            const answerText = answer.answer;
            
            // Map question numbers to actual questions
            const questionMapping = {
                1: "What would you like to do in Canada?",
                2: "How long are you planning to stay in Canada?",
                3: "Select the code that matches the one on your passport.",
                4: "What is your current country or territory of residence? If you are presently in Canada, you should select Canada.",
                5: "Do you have a family member who is a Canadian citizen or permanent resident and is 18 years or older?",
                6: "What is your date of birth?",
                7: "Do you have a provincial or territorial attestation letter or meet an exception from submitting a provincial or territorial attestation letter?",
                8: "Which province or territory is your provincial attestation letter from?",
                9: "Are you a lawful permanent resident of the United States with a valid U.S. Citizenship and Immigration Services (USCIS) number?",
                10: "Have you travelled directly to Canada from the United States or St. Pierre and Miquelon or will you be traveling directly to Canada from the United States or St. Pierre and Miquelon?",
                11: "Have you been accepted to a designated learning institution?",
                12: "Are you planning to attend a post-secondary designated learning institution?",
                13: "What is your marital status ?",
                14: "What is your province or territory of destination? If visiting multiple provinces or territories, select the one in which you will be spending most of your time.",
                15: "Are you currently, or will you be living in Canada with a parent or legal guardian for the entire period of your stay?",
                16: "Do you have an SDS eligible GIC?",
                17: "Did you pay your first year's tuition in full?",
                18: "Have you taken a language test in the past 2 years?",
                19: "Were all your results for listening, reading, writing and speaking on the International English Language Testing System (IELTS) a 6.0 or higher?",
                20: "Do you have a valid work permit or study permit, and need a visa to return to Canada?",
                21: "Are you an exchange student ?",
                22: "Is work an essential component of your studies?",
                23: "Are you a spouse, common-law partner or child of certain skilled worker or of certain full time international student that has or will have status in Canada?",
                24: "Are you:\n-  A recipient of a Commonwealth scholarship; or\n-  A recipient of a full bursary (covering all expenses) from the Canadian International Development Agency (CIDA), including Francophonie scholarships; or\n-  A participant in a Canadian aid program for developing countries?",
                25: "Are you accompanying a family member that has status in Canada, or has recently been approved to come to Canada?",
                26: "Have you ever committed, been arrested for, been charged with, or convicted of any criminal offence in any country?",
                27: "Do you want to submit an application for a family member?",
                28: "Are you giving someone access to your application?",
                29: "In the past 10 years, have you given your fingerprints and photo (biometrics) for an application to come to Canada?",
                30: "There are fees associated with this application. Will you be paying your fees or are you fee exempt?",
                31: "Are you able to make a digital copy of your documents with a scanner or camera?",
                32: "Will you be paying your application fees online?  To pay online, you can use a credit card (Visa, MasterCard, American Express, JCB, China Union Pay) or a Visa Debit or Debit MasterCard."
            };
            
            if (questionNumber in questionMapping) {
                const questionText = questionMapping[questionNumber];
                answers[questionText] = answerText;
            }
        }
        
        console.log('✅ Answers loaded from file:', Object.keys(answers).length, 'questions');
        return true;
    } catch (error) {
        console.error('❌ Failed to load answers from file:', error);
        return false;
    }
}

// Initialize
async function initialize() {
    console.log('🚀 Initializing IRCC Autofill Helper (Simple)...');
    await loadAnswersFromFile();
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