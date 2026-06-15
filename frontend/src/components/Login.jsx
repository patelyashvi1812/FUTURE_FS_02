import React, { useState } from 'react';
import { FiMail, FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = ({ onLoginSuccess, backendUrl }) => {
  const [isSetup, setIsSetup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupMessage, setSetupMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSetupMessage('');
    setLoading(true);

    const endpoint = isSetup ? '/api/auth/register' : '/api/auth/login';
    const payload = isSetup ? { email, password, name } : { email, password };

    try {
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (isSetup) {
        setSetupMessage('Account created successfully! You can now login.');
        setIsSetup(false);
        setPassword('');
      } else {
        localStorage.setItem('crm_token', data.token);
        localStorage.setItem('crm_user', JSON.stringify(data.user));
        onLoginSuccess(data.token, data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="glass-card login-card fade-in">
        <div className="login-header">
          <div className="nav-brand" style={{ justifyContent: 'center', marginBottom: '0.5rem', fontSize: '2rem' }}>
            CRM Dashboard
          </div>
          <p>{isSetup ? 'Create a new account' : 'Sign in to access lead management'}</p>
        </div>

        {error && <div className="login-error">{error}</div>}
        {setupMessage && (
          <div className="login-error" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', color: 'var(--success)' }}>
            {setupMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSetup && (
            <div className="form-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="input-field"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem', paddingRight: '3rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: showPassword ? 'var(--primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.25rem',
                  borderRadius: '4px',
                  transition: 'color 0.2s ease',
                  fontSize: '1rem',
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }} disabled={loading}>
            {loading ? 'Processing...' : isSetup ? 'Register' : 'Login to Dashboard'}
            <FiArrowRight style={{ marginLeft: '0.5rem' }} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <button
            onClick={() => {
              setIsSetup(!isSetup);
              setError('');
              setSetupMessage('');
            }}
            className="btn btn-secondary btn-sm"
            style={{ border: 'none', background: 'transparent', color: 'var(--primary)' }}
          >
            {isSetup ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
