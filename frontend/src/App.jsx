import React, { useState, useEffect } from 'react';
import { FiLogOut, FiTerminal, FiDatabase, FiGrid } from 'react-icons/fi';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WebhookDocs from './components/WebhookDocs';

// Set Backend Endpoint dynamically
const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://lead-crm-backend-eta.vercel.app';

function App() {
  const [token, setToken] = useState(localStorage.getItem('crm_token'));
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'docs'

  useEffect(() => {
    const storedUser = localStorage.getItem('crm_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
  }, [token]);

  const handleLoginSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    setToken(null);
    setUser(null);
    setView('dashboard');
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="navbar">
        <div className="nav-brand" onClick={() => setView('dashboard')}>
          <FiDatabase style={{ marginRight: '0.2rem' }} />
          <span>LeadFlow CRM</span>
        </div>

        {token && (
          <div className="nav-actions">
            <button
              className={`btn btn-secondary btn-sm ${view === 'docs' ? 'btn-primary' : ''}`}
              onClick={() => setView(view === 'dashboard' ? 'docs' : 'dashboard')}
            >
              {view === 'dashboard' ? (
                <>
                  <FiTerminal /> Webhook API
                </>
              ) : (
                <>
                  <FiGrid /> Dashboard
                </>
              )}
            </button>

            <span className="nav-user">
              Hi, {user ? user.name : 'Admin'}
            </span>

            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </header>

      {/* Main Core Body */}
      <main className="main-content">
        {!token ? (
          <Login onLoginSuccess={handleLoginSuccess} backendUrl={BACKEND_URL} />
        ) : view === 'dashboard' ? (
          <Dashboard
            token={token}
            onLogout={handleLogout}
            onShowDocs={() => setView('docs')}
            backendUrl={BACKEND_URL}
          />
        ) : (
          <WebhookDocs
            onBack={() => setView('dashboard')}
            backendUrl={BACKEND_URL}
          />
        )}
      </main>
    </div>
  );
}

export default App;
