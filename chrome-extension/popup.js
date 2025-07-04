// Popup script for IRCC Autofill Helper
console.log('IRCC Autofill Helper popup loaded');

// DOM elements
const autofillBtn = document.getElementById('autofillBtn');
const autofillText = document.getElementById('autofillText');
const settingsBtn = document.getElementById('settingsBtn');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const statusEl = document.getElementById('status');
const settingsPanel = document.getElementById('settingsPanel');
const answersJson = document.getElementById('answersJson');
const questionCount = document.getElementById('questionCount');
const lastFilled = document.getElementById('lastFilled');

let currentAnswers = {};
let isSettingsOpen = false;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await loadAnswers();
  updateStats();
  setupEventListeners();
});

// Load answers from storage
async function loadAnswers() {
  try {
    const result = await chrome.storage.sync.get(['answers', 'lastFillStats']);
    
    if (result.answers) {
      currentAnswers = result.answers;
      answersJson.value = JSON.stringify(currentAnswers, null, 2);
    } else {
      // Load default answers
      await loadDefaultAnswers();
    }
    
    if (result.lastFillStats) {
      lastFilled.textContent = result.lastFillStats.filledCount || 0;
    }
    
  } catch (error) {
    console.error('Failed to load answers:', error);
    showStatus('Failed to load configuration', 'error');
  }
}

// Load default answers from answers.json
async function loadDefaultAnswers() {
  try {
    const response = await fetch(chrome.runtime.getURL('answers.json'));
    const defaultAnswers = await response.json();
    currentAnswers = defaultAnswers;
    answersJson.value = JSON.stringify(currentAnswers, null, 2);
    await chrome.storage.sync.set({ answers: currentAnswers });
    console.log('Default answers loaded');
  } catch (error) {
    console.error('Failed to load default answers:', error);
    showStatus('Failed to load default configuration', 'error');
  }
}

// Setup event listeners
function setupEventListeners() {
  autofillBtn.addEventListener('click', handleAutofill);
  settingsBtn.addEventListener('click', toggleSettings);
  saveBtn.addEventListener('click', saveAnswers);
  resetBtn.addEventListener('click', resetAnswers);
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'autofillComplete') {
      handleAutofillComplete(request.data);
    } else if (request.action === 'autofillError') {
      handleAutofillError(request.error);
    }
  });
  
  // Auto-save answers as user types (debounced)
  let saveTimeout;
  answersJson.addEventListener('input', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      try {
        const parsed = JSON.parse(answersJson.value);
        currentAnswers = parsed;
        chrome.storage.sync.set({ answers: currentAnswers });
        updateStats();
      } catch (error) {
        // Invalid JSON, don't save
      }
    }, 1000);
  });
}

// Handle autofill button click
async function handleAutofill() {
  try {
    // Check if we're on the correct site
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url || !tab.url.includes('onlineservices-servicesenligne.cic.gc.ca')) {
      showStatus('Please navigate to the IRCC e-application site first', 'error');
      return;
    }
    
    // Update button state
    setAutofillLoading(true);
    showStatus('Starting autofill process...', 'info');
    
    // Trigger autofill
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        window.dispatchEvent(new CustomEvent('irccAutofill', { detail: { trigger: true } }));
      }
    });
    
    // Auto-hide loading state after 5 seconds
    setTimeout(() => {
      if (autofillBtn.disabled) {
        setAutofillLoading(false);
        showStatus('Autofill process completed. Check the form fields.', 'success');
      }
    }, 5000);
    
  } catch (error) {
    console.error('Autofill failed:', error);
    setAutofillLoading(false);
    showStatus('Failed to start autofill. Please try again.', 'error');
  }
}

// Handle autofill completion
function handleAutofillComplete(data) {
  setAutofillLoading(false);
  
  if (data.filledCount > 0) {
    showStatus(`✅ Successfully filled ${data.filledCount} fields!`, 'success');
    
    // Save stats
    chrome.storage.sync.set({ 
      lastFillStats: { 
        filledCount: data.filledCount, 
        timestamp: Date.now() 
      } 
    });
    
    // Update UI
    lastFilled.textContent = data.filledCount;
  } else {
    showStatus('No fields were filled. The form might already be completed or the page structure may have changed.', 'info');
  }
}

// Handle autofill error
function handleAutofillError(error) {
  setAutofillLoading(false);
  showStatus(`Error: ${error}`, 'error');
}

// Set autofill button loading state
function setAutofillLoading(loading) {
  autofillBtn.disabled = loading;
  
  if (loading) {
    autofillText.innerHTML = '<span class="loading"></span>Filling form...';
  } else {
    autofillText.textContent = '🚀 Manual Fill';
  }
}

// Toggle settings panel
function toggleSettings() {
  isSettingsOpen = !isSettingsOpen;
  settingsPanel.classList.toggle('hidden', !isSettingsOpen);
  settingsBtn.textContent = isSettingsOpen ? '❌ Close' : '⚙️ Settings';
  
  if (isSettingsOpen) {
    answersJson.focus();
  }
}

// Save answers
async function saveAnswers() {
  try {
    const newAnswers = JSON.parse(answersJson.value);
    currentAnswers = newAnswers;
    
    await chrome.storage.sync.set({ answers: currentAnswers });
    updateStats();
    showStatus('✅ Answers saved successfully!', 'success');
    
  } catch (error) {
    console.error('Failed to save answers:', error);
    showStatus('❌ Invalid JSON format. Please check your syntax.', 'error');
  }
}

// Reset to default answers
async function resetAnswers() {
  if (confirm('Are you sure you want to reset to default answers? This will overwrite your current configuration.')) {
    try {
      await loadDefaultAnswers();
      updateStats();
      showStatus('✅ Reset to default answers', 'success');
    } catch (error) {
      console.error('Failed to reset answers:', error);
      showStatus('❌ Failed to reset answers', 'error');
    }
  }
}

// Update statistics
function updateStats() {
  questionCount.textContent = Object.keys(currentAnswers).length;
}

// Show status message
function showStatus(message, type = 'info') {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  statusEl.classList.remove('hidden');
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    statusEl.classList.add('hidden');
  }, 5000);
}

// Handle storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.answers) {
      currentAnswers = changes.answers.newValue || {};
      if (!isSettingsOpen) {
        answersJson.value = JSON.stringify(currentAnswers, null, 2);
      }
      updateStats();
    }
    
    if (changes.lastFillStats) {
      const stats = changes.lastFillStats.newValue;
      if (stats) {
        lastFilled.textContent = stats.filledCount || 0;
      }
    }
  }
});

// Format JSON nicely when settings panel opens
settingsBtn.addEventListener('click', () => {
  if (!isSettingsOpen && currentAnswers) {
    answersJson.value = JSON.stringify(currentAnswers, null, 2);
  }
});

console.log('IRCC Autofill Helper popup ready'); 