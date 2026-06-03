import React, { useState } from 'react';
import { FiCopy, FiCheck, FiTerminal, FiGlobe, FiCode, FiArrowLeft } from 'react-icons/fi';

const WebhookDocs = ({ onBack, backendUrl }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [apiKey, setApiKey] = useState('crm-wh-a7f3e9d2b1c84056f0e7a2d9b3c1f8e4');

  const webhookUrl = `${backendUrl}/api/leads`;

  const curlCode = `curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -H "X-CRM-API-KEY: ${apiKey}" \\
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "source": "Portfolio Website",
    "message": "I am interested in your consulting services."
  }'`;

  const jsCode = `fetch("${webhookUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-CRM-API-KEY": "${apiKey}"
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    source: "Contact Page Form",
    message: "Hi, please contact me as soon as possible!"
  })
})
.then(response => response.json())
.then(data => console.log("Lead captured:", data))
.catch(error => console.error("Error sending lead:", error));

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onBack} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
          <FiArrowLeft /> Back to Leads
        </button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Website Integration (Webhooks)</h2>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div className="docs-header">
          <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: '0.5rem', fontWeight: '500' }}>
            Sync leads from any landing page, newsletter popup, or HTML form directly into your CRM database.
          </p>
          <p style={{ fontSize: '0.9rem' }}>
            Send a <code>POST</code> request to the URL listed below with the following JSON request body.
          </p>
        </div>

        <div className="form-group" style={{ margin: '1.5rem 0' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Lead Intake Webhook URL</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              readOnly
              value={webhookUrl}
              className="input-field"
              style={{ background: 'rgba(0,0,0,0.3)', fontFamily: 'monospace', fontSize: '0.9rem' }}
            />
            <button
              onClick={() => copyToClipboard(webhookUrl, 0)}
              className="btn btn-primary"
              style={{ whiteSpace: 'nowrap' }}
            >
              {copiedIndex === 0 ? <FiCheck /> : <FiCopy />} Copy URL
            </button>
          </div>
        </div>

        <div className="form-group" style={{ margin: '1.5rem 0' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Your Webhook API Key</label>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Paste your <code>WEBHOOK_API_KEY</code> from <code>backend/.env</code> — the code snippets below will update automatically.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your WEBHOOK_API_KEY here..."
              className="input-field"
              style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
            />
            <button
              onClick={() => copyToClipboard(apiKey, 3)}
              className="btn btn-secondary"
              style={{ whiteSpace: 'nowrap' }}
            >
              {copiedIndex === 3 ? <FiCheck /> : <FiCopy />} Copy Key
            </button>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Payload Structure (JSON)</h4>
          <table className="crm-table" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
            <thead>
              <tr>
                <th style={{ background: 'rgba(0,0,0,0.2)' }}>Field</th>
                <th style={{ background: 'rgba(0,0,0,0.2)' }}>Type</th>
                <th style={{ background: 'rgba(0,0,0,0.2)' }}>Requirement</th>
                <th style={{ background: 'rgba(0,0,0,0.2)' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>name</code></td>
                <td>String</td>
                <td style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Required</td>
                <td>Name of the prospective client / customer.</td>
              </tr>
              <tr>
                <td><code>email</code></td>
                <td>String</td>
                <td style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Required</td>
                <td>Valid email address for follow-up communications.</td>
              </tr>
              <tr>
                <td><code>source</code></td>
                <td>String</td>
                <td>Optional</td>
                <td>Identifies which form/site page submitted the lead (e.g. <i>"Homepage Form"</i>). Default is <i>"Website"</i>.</td>
              </tr>
              <tr>
                <td><code>message</code></td>
                <td>String</td>
                <td>Optional</td>
                <td>Client's message. Stored automatically as the first timeline note.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }} className="docs-grid-responsive">
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 'bold', color: 'var(--info)' }}>
            <FiTerminal /> <span>cURL (Terminal Test)</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Run this command directly in your command line terminal to simulate a website submission:
          </p>
          <div className="code-block-wrapper">
            <button onClick={() => copyToClipboard(curlCode, 1)} className="copy-btn">
              {copiedIndex === 1 ? 'Copied!' : 'Copy'}
            </button>
            <pre>{curlCode}</pre>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            <FiCode /> <span>JavaScript Fetch API</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Use this code snippet in your frontend JavaScript forms to push submissions:
          </p>
          <div className="code-block-wrapper">
            <button onClick={() => copyToClipboard(jsCode, 2)} className="copy-btn">
              {copiedIndex === 2 ? 'Copied!' : 'Copy'}
            </button>
            <pre>{jsCode}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookDocs;
