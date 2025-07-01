// VisaMate Assistant simple popup JS (CSP compliant)

document.addEventListener('DOMContentLoaded', () => {
  const baseURLInput = document.getElementById('baseURL');
  const sessionIdInput = document.getElementById('sessionId');
  const apiKeyInput = document.getElementById('apiKey');
  const statusDiv = document.getElementById('status');

  const showStatus = (msg, isError = false) => {
    statusDiv.textContent = msg;
    statusDiv.className = 'status ' + (isError ? 'error' : 'success');
    statusDiv.style.display = 'block';
    setTimeout(() => (statusDiv.style.display = 'none'), 3000);
  };

  // load saved config
  chrome.storage.sync.get(['apiKey', 'sessionId', 'baseURL'], (cfg) => {
    baseURLInput.value = cfg.baseURL || 'http://localhost:8000/api/v1';
    sessionIdInput.value = cfg.sessionId || '';
    apiKeyInput.value = cfg.apiKey || '';
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    chrome.storage.sync.set(
      {
        baseURL: baseURLInput.value,
        sessionId: sessionIdInput.value,
        apiKey: apiKeyInput.value,
      },
      () => showStatus('Configuration saved!')
    );
  });

  document.getElementById('testBtn').addEventListener('click', () => {
    const base = baseURLInput.value.trim();
    let url = '';

    const jsonFilePattern = /\.json(\?.*)?$/i;
    if (jsonFilePattern.test(base)) {
      url = base; // direct file
    } else if (base.includes('amazonaws.com')) {
      url = `${base.replace(/\/$/, '')}/json/${sessionIdInput.value}/questionnaire_answers_latest.json`;
    } else {
      url = `${base.replace(/\/$/, '')}/wizard/questionnaire/${sessionIdInput.value}/answers`;
    }

    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        const answers = d.answers || d;
        showStatus(`✅ Connected – ${Object.keys(answers || {}).length} answers`);
      })
      .catch((e) => showStatus(`❌ ${e}`, true));
  });

  document.getElementById('fillBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'fillForm' }, (resp) => {
        if (resp && resp.success) {
          showStatus('✅ Form filled!');
        } else {
          showStatus('❌ ' + (resp?.error || 'Failed'), true);
        }
      });
    });
  });
}); 