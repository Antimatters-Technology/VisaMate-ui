// Background service worker for VisaMate Chrome Extension
// Handles API communication and data synchronization

class VisaMateAPIService {
  constructor() {
    this.baseURL = 'http://localhost:8000/api/v1'; // Development URL
    this.apiKey = null;
    this.sessionId = null;
  }

  async init() {
    // Get stored API configuration
    const result = await chrome.storage.sync.get(['apiKey', 'sessionId', 'baseURL']);
    this.apiKey = result.apiKey;
    this.sessionId = result.sessionId;
    if (result.baseURL) {
      this.baseURL = result.baseURL;
    }
  }

  /**
   * Fetch questionnaire answers. Supports two modes:
   * 1. REST API (default): `${baseURL}/wizard/questionnaire/{sessionId}/answers`.
   * 2. Direct JSON file (e.g. S3 object): If `baseURL` ends with `.json`, it will
   *    be fetched as-is. If `baseURL` contains `amazonaws.com` but does not end
   *    with `.json`, it will try the convention
   *    `${baseURL}/json/{sessionId}/questionnaire_answers_latest.json`.
   */
  async fetchQuestionnaireAnswers(sessionId) {
    try {
      let url = '';

      // Case 1 – user provided direct JSON URL (allow query params)
      const baseTrim = this.baseURL.trim();
      const isJsonFile = /\.json(\?.*)?$/i.test(baseTrim);
      if (isJsonFile) {
        url = baseTrim;
      // Case 2 – S3 bucket base URL (public)
      } else if (this.baseURL.includes('amazonaws.com')) {
        // Attempt to fetch a conventional latest file under json/{sessionId}/
        url = `${this.baseURL.replace(/\/$/, '')}/json/${sessionId}/questionnaire_answers_latest.json`;
      } else {
        // Default API mode
        url = `${this.baseURL.replace(/\/$/, '')}/wizard/questionnaire/${sessionId}/answers`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const answers = data.answers || data; // Some direct JSON may be raw mapping

      console.log('Fetched questionnaire answers:', answers);
      
      // Cache the answers locally
      await chrome.storage.local.set({
        [`answers_${sessionId}`]: answers,
        'lastFetch': Date.now()
      });

      return answers;
    } catch (error) {
      console.error('Failed to fetch questionnaire answers:', error);
      
      // Try to get cached answers as fallback
      const cached = await chrome.storage.local.get([`answers_${sessionId}`]);
      return cached[`answers_${sessionId}`] || {};
    }
  }

  async createSession(userId = 'anonymous') {
    try {
      const response = await fetch(`${this.baseURL}/wizard/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify({ user_id: userId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const sessionId = data.session_id;
      
      // Store session ID
      await chrome.storage.sync.set({ sessionId });
      this.sessionId = sessionId;
      
      return sessionId;
    } catch (error) {
      console.error('Failed to create session:', error);
      return null;
    }
  }
}

// Initialize API service
const apiService = new VisaMateAPIService();

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getAnswers':
      handleGetAnswers(request.sessionId)
        .then(sendResponse)
        .catch(error => sendResponse({ error: error.message }));
      return true; // Keep message channel open for async response

    case 'createSession':
      handleCreateSession(request.userId)
        .then(sendResponse)
        .catch(error => sendResponse({ error: error.message }));
      return true;

    case 'getConfig':
      handleGetConfig()
        .then(sendResponse)
        .catch(error => sendResponse({ error: error.message }));
      return true;

    case 'saveConfig':
      handleSaveConfig(request.config)
        .then(sendResponse)
        .catch(error => sendResponse({ error: error.message }));
      return true;
  }
});

async function handleGetAnswers(sessionId) {
  await apiService.init();

  // Resolve session ID if not provided (API mode)
  if (!sessionId) {
    const result = await chrome.storage.sync.get(['sessionId']);
    sessionId = result.sessionId;
  }

  // If still missing and we're in direct JSON mode (file path), allow empty sessionId
  const isJsonFile = /\.json(\?.*)?$/i.test(apiService.baseURL.trim());
  if (!sessionId && !isJsonFile) {
    throw new Error('No session ID available');
  }

  const answers = await apiService.fetchQuestionnaireAnswers(sessionId || '');
  return { answers, sessionId };
}

async function handleCreateSession(userId) {
  await apiService.init();
  const sessionId = await apiService.createSession(userId);
  return { sessionId };
}

async function handleGetConfig() {
  const result = await chrome.storage.sync.get(['apiKey', 'sessionId', 'baseURL']);
  return result;
}

async function handleSaveConfig(config) {
  await chrome.storage.sync.set(config);
  await apiService.init(); // Reinitialize with new config
  return { success: true };
}

// Auto-refresh answers periodically
setInterval(async () => {
  try {
    const result = await chrome.storage.sync.get(['sessionId']);
    if (result.sessionId) {
      await apiService.init();
      await apiService.fetchQuestionnaireAnswers(result.sessionId);
      console.log('Auto-refreshed questionnaire answers');
    }
  } catch (error) {
    console.error('Auto-refresh failed:', error);
  }
}, 5 * 60 * 1000); // Refresh every 5 minutes 