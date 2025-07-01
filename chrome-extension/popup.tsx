import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface Config {
  apiKey?: string;
  sessionId?: string;
  baseURL?: string;
}

interface PageInfo {
  url: string;
  title: string;
  hasForm: boolean;
  hasAnswers: boolean;
}

const VisaMatePopup: React.FC = () => {
  const [config, setConfig] = useState<Config>({});
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    loadConfig();
    getPageInfo();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getConfig' });
      setConfig(response || {});
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  };

  const getPageInfo = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getPageInfo' });
        setPageInfo(response);
      }
    } catch (error) {
      console.error('Failed to get page info:', error);
    }
  };

  const saveConfig = async () => {
    setIsLoading(true);
    try {
      await chrome.runtime.sendMessage({ action: 'saveConfig', config });
      setStatus('Configuration saved successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('Failed to save configuration');
      console.error('Failed to save config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSession = async () => {
    setIsLoading(true);
    try {
      const response = await chrome.runtime.sendMessage({ 
        action: 'createSession', 
        userId: 'chrome-extension-user' 
      });
      
      if (response.sessionId) {
        setConfig(prev => ({ ...prev, sessionId: response.sessionId }));
        setStatus('New session created successfully!');
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('Failed to create session');
      }
    } catch (error) {
      setStatus('Failed to create session');
      console.error('Failed to create session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fillCurrentForm = async () => {
    setIsLoading(true);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'fillForm' });
        if (response.success) {
          setStatus('Form filled successfully!');
        } else {
          setStatus('Failed to fill form: ' + (response.error || 'Unknown error'));
        }
        setTimeout(() => setStatus(''), 3000);
      }
    } catch (error) {
      setStatus('Failed to fill form');
      console.error('Failed to fill form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAnswers = async () => {
    setIsLoading(true);
    try {
      await chrome.runtime.sendMessage({ action: 'getAnswers', sessionId: config.sessionId });
      setStatus('Answers refreshed successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('Failed to refresh answers');
      console.error('Failed to refresh answers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: '400px', padding: '16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <img 
          src="icons/icon32.png" 
          alt="VisaMate" 
          style={{ width: '24px', height: '24px', marginRight: '8px' }}
        />
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>VisaMate Assistant</h2>
      </div>

      {/* Status */}
      {status && (
        <div style={{
          padding: '8px 12px',
          marginBottom: '16px',
          backgroundColor: status.includes('Failed') ? '#fef2f2' : '#dcfce7',
          border: `1px solid ${status.includes('Failed') ? '#ef4444' : '#16a34a'}`,
          borderRadius: '4px',
          fontSize: '13px',
          color: status.includes('Failed') ? '#dc2626' : '#166534'
        }}>
          {status}
        </div>
      )}

      {/* Page Info */}
      {pageInfo && (
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Current Page:</div>
          <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            {pageInfo.title}
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
            <span style={{ color: pageInfo.hasForm ? '#16a34a' : '#dc2626' }}>
              {pageInfo.hasForm ? '✅' : '❌'} Form Detected
            </span>
            <span style={{ color: pageInfo.hasAnswers ? '#16a34a' : '#dc2626' }}>
              {pageInfo.hasAnswers ? '✅' : '❌'} Answers Available
            </span>
          </div>
        </div>
      )}

      {/* Main Actions */}
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={fillCurrentForm}
          disabled={isLoading || !pageInfo?.hasForm}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: pageInfo?.hasForm ? '#2563eb' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: pageInfo?.hasForm ? 'pointer' : 'not-allowed',
            marginBottom: '8px'
          }}
        >
          {isLoading ? 'Processing...' : 'Fill Current Form'}
        </button>

        <button
          onClick={refreshAnswers}
          disabled={isLoading || !config.sessionId}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: config.sessionId ? '#059669' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: config.sessionId ? 'pointer' : 'not-allowed'
          }}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Answers'}
        </button>
      </div>

      {/* Configuration */}
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
        <button
          onClick={() => setShowConfig(!showConfig)}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: 'transparent',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '13px',
            cursor: 'pointer',
            marginBottom: '12px'
          }}
        >
          {showConfig ? 'Hide' : 'Show'} Configuration
        </button>

                 {showConfig && (
           <div style={{ gap: '12px' }}>
             <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                API Base URL:
              </label>
              <input
                type="text"
                value={config.baseURL || 'http://localhost:8000/api/v1'}
                onChange={(e) => setConfig(prev => ({ ...prev, baseURL: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}
                placeholder="http://localhost:8000/api/v1"
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                API Key (Optional):
              </label>
              <input
                type="password"
                value={config.apiKey || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}
                placeholder="Enter API key"
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                Session ID:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={config.sessionId || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, sessionId: e.target.value }))}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '13px'
                  }}
                  placeholder="Session ID"
                />
                <button
                  onClick={createSession}
                  disabled={isLoading}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  New
                </button>
              </div>
            </div>

            <button
              onClick={saveConfig}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {isLoading ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        marginTop: '16px', 
        paddingTop: '12px', 
        borderTop: '1px solid #e2e8f0',
        fontSize: '11px',
        color: '#64748b',
        textAlign: 'center'
      }}>
        VisaMate AI Assistant v1.0.0
      </div>
    </div>
  );
};

// Initialize the popup
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<VisaMatePopup />);
} 