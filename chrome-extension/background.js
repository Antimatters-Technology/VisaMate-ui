// Background service worker for IRCC Autofill Helper
chrome.runtime.onInstalled.addListener(() => {
  console.log('IRCC Autofill Helper installed');
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  // Check if we're on the IRCC site
  if (!tab.url || !tab.url.includes('onlineservices-servicesenligne.cic.gc.ca')) {
    // Create a notification or alert
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        alert('Please navigate to the IRCC e-application site first:\nhttps://onlineservices-servicesenligne.cic.gc.ca/eapp/eapp');
      }
    });
    return;
  }

  // Inject and run the autofill script
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: triggerAutofill
    });
  } catch (error) {
    console.error('Failed to inject autofill script:', error);
  }
});

// Function to trigger autofill (injected into page)
function triggerAutofill() {
  // Dispatch a custom event that the content script will listen for
  window.dispatchEvent(new CustomEvent('irccAutofill', { detail: { trigger: true } }));
}

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'autofillComplete') {
    console.log('Autofill completed:', request.data);
  } else if (request.action === 'autofillError') {
    console.error('Autofill error:', request.error);
  }
  sendResponse({ received: true });
});

// Load answers when extension starts
chrome.runtime.onStartup.addListener(() => {
  loadDefaultAnswers();
});

chrome.runtime.onInstalled.addListener(() => {
  loadDefaultAnswers();
});

async function loadDefaultAnswers() {
  try {
    // Check if answers are already stored
    const result = await chrome.storage.sync.get('answers');
    if (!result.answers) {
      // Load default answers from answers.json
      const response = await fetch(chrome.runtime.getURL('answers.json'));
      const defaultAnswers = await response.json();
      await chrome.storage.sync.set({ answers: defaultAnswers });
      console.log('Default answers loaded');
    }
  } catch (error) {
    console.error('Failed to load default answers:', error);
  }
} 