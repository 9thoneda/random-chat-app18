import { useState, useEffect } from 'react';

export default function DebugApp() {
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    addLog('DebugApp mounted');
    
    // Test basic functionality
    try {
      addLog('Testing localStorage...');
      localStorage.setItem('test', 'value');
      localStorage.removeItem('test');
      addLog('✅ localStorage working');
    } catch (e) {
      addLog('❌ localStorage failed: ' + e);
      setError('LocalStorage not available');
    }

    try {
      addLog('Testing Firebase import...');
      import('./firebaseConfig').then(() => {
        addLog('✅ Firebase config loaded');
      }).catch(e => {
        addLog('❌ Firebase config failed: ' + e);
        setError('Firebase configuration error');
      });
    } catch (e) {
      addLog('❌ Firebase import failed: ' + e);
      setError('Firebase import error');
    }

    try {
      addLog('Testing ad service...');
      import('./lib/adService').then(() => {
        addLog('✅ Ad service loaded');
      }).catch(e => {
        addLog('❌ Ad service failed: ' + e);
        setError('Ad service error');
      });
    } catch (e) {
      addLog('❌ Ad service import failed: ' + e);
      setError('Ad service import error');
    }
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace',
      background: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333' }}>🔍 AjnabiCam Debug Screen</h1>
      
      {error && (
        <div style={{ 
          background: '#ffebee', 
          color: '#c62828',
          padding: '10px',
          borderRadius: '5px',
          margin: '10px 0'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ 
        background: 'white',
        padding: '15px',
        borderRadius: '5px',
        margin: '10px 0'
      }}>
        <h3>📋 Debug Logs:</h3>
        {logs.map((log, index) => (
          <div key={index} style={{ 
            padding: '2px 0',
            borderBottom: '1px solid #eee'
          }}>
            {log}
          </div>
        ))}
      </div>

      <div style={{ 
        background: '#e8f5e8',
        padding: '15px',
        borderRadius: '5px',
        margin: '10px 0'
      }}>
        <h3>🛠️ Quick Tests:</h3>
        <button 
          onClick={() => addLog('Manual button click test')}
          style={{ 
            background: '#4caf50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            margin: '5px',
            cursor: 'pointer'
          }}
        >
          Test Button Click
        </button>
        
        <button 
          onClick={() => {
            try {
              const result = JSON.stringify(navigator.userAgent);
              addLog('User Agent: ' + result);
            } catch (e) {
              addLog('Failed to get user agent: ' + e);
            }
          }}
          style={{ 
            background: '#2196f3',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            margin: '5px',
            cursor: 'pointer'
          }}
        >
          Check User Agent
        </button>
      </div>

      <div style={{ 
        background: '#fff3e0',
        padding: '15px',
        borderRadius: '5px',
        margin: '10px 0'
      }}>
        <h3>📱 Environment Info:</h3>
        <p><strong>URL:</strong> {window.location.href}</p>
        <p><strong>Protocol:</strong> {window.location.protocol}</p>
        <p><strong>Host:</strong> {window.location.host}</p>
        <p><strong>User Agent:</strong> {navigator.userAgent.substring(0, 100)}...</p>
      </div>
    </div>
  );
}
