import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiUser, FiInfo, FiTrendingUp, FiCheckCircle, FiFileText, FiPlus, FiX } from 'react-icons/fi';
import LeadDetails from './LeadDetails';

// ── Add Lead Modal ────────────────────────────────────────────────────────────
const AddLeadModal = ({ onClose, onAdded, token, backendUrl }) => {
  const [form, setForm] = useState({ name: '', email: '', source: '', status: 'New', note: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/leads/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add lead');
      onAdded(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%', maxWidth: '480px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.25s ease',
          zIndex: 1100
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add New Lead</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Manually enter a client's details
            </p>
          </div>
          <button onClick={onClose} className="drawer-close-btn"><FiX /></button>
        </div>

        {error && (
          <div className="login-error" style={{ marginBottom: '1rem' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input name="name" type="text" className="input-field" placeholder="e.g. Mitul Aghara"
              value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input name="email" type="email" className="input-field" placeholder="e.g. mitul@company.com"
              value={form.email} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Source / Channel</label>
              <input name="source" type="text" className="input-field" placeholder="e.g. Referral, LinkedIn"
                value={form.source} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Initial Status</label>
              <select name="status" className="select-field" value={form.status} onChange={handleChange}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Initial Note (optional)</label>
            <textarea name="note" rows="3" className="textarea-field"
              placeholder="Any context about this lead..."
              value={form.note} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
              <FiPlus /> {loading ? 'Adding Lead...' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = ({ token, onLogout, onShowDocs, backendUrl }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedLead, setSelectedLead] = useState(null);
  const [sources, setSources] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ status: statusFilter, source: sourceFilter, search, sort: sortOrder });
      const response = await fetch(`${backendUrl}/api/leads?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to retrieve leads');
      const data = await response.json();
      setLeads(data);
      if (statusFilter === 'all' && sourceFilter === 'all' && search === '') {
        setSources([...new Set(data.map(lead => lead.source || 'Website'))]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, [statusFilter, sourceFilter, sortOrder, token]);

  const handleSearchSubmit = (e) => { e.preventDefault(); fetchLeads(); };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'New': return <span className="badge badge-new">New</span>;
      case 'Contacted': return <span className="badge badge-contacted">Contacted</span>;
      case 'Converted': return <span className="badge badge-converted">Converted</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;

  const handleUpdateLead = (updatedLead) => {
    setLeads(prev => prev.map(l => l._id === updatedLead._id ? updatedLead : l));
    setSelectedLead(updatedLead);
  };

  const handleDeleteLead = (deletedId) => {
    setLeads(prev => prev.filter(l => l._id !== deletedId));
    setSelectedLead(null);
  };

  const handleLeadAdded = (newLead) => {
    setLeads(prev => [newLead, ...prev]);
  };

  return (
    <div className="fade-in">
      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="glass-card metric-card">
          <div className="metric-icon indigo"><FiUser /></div>
          <div className="metric-info"><h3>Total Leads</h3><p>{totalLeads}</p></div>
        </div>
        <div className="glass-card metric-card">
          <div className="metric-icon amber"><FiInfo /></div>
          <div className="metric-info"><h3>New</h3><p>{newLeads}</p></div>
        </div>
        <div className="glass-card metric-card">
          <div className="metric-icon" style={{ background: 'rgba(14,165,233,0.1)', color: 'var(--info)' }}><FiTrendingUp /></div>
          <div className="metric-info"><h3>Contacted</h3><p>{contactedLeads}</p></div>
        </div>
        <div className="glass-card metric-card">
          <div className="metric-icon emerald"><FiCheckCircle /></div>
          <div className="metric-info"><h3>Converted</h3><p>{convertedLeads}</p></div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div className="filter-bar">
          <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search leads by name or email..."
              className="input-field" value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit" style={{ display: 'none' }}>Search</button>
          </form>

          <div className="filter-selectors">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiFilter style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }} />
              <select className="select-field" value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)} style={{ minWidth: '130px' }}>
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
              </select>
            </div>
            <select className="select-field" value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)} style={{ minWidth: '140px' }}>
              <option value="all">All Sources</option>
              {sources.map(src => <option key={src} value={src}>{src}</option>)}
            </select>
            <select className="select-field" value={sortOrder}
              onChange={e => setSortOrder(e.target.value)} style={{ minWidth: '130px' }}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>

            {/* ── Add Lead Button ── */}
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
              style={{ whiteSpace: 'nowrap' }}
            >
              <FiPlus /> Add Lead
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading database leads...
          </div>
        ) : leads.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <FiFileText style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>No leads found</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Add a lead manually or connect your website webhook.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                <FiPlus /> Add Lead Manually
              </button>
              <button className="btn btn-secondary" onClick={onShowDocs}>
                Integrate Website Webhook
              </button>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Client Details</th>
                  <th>Source Channel</th>
                  <th>Status</th>
                  <th>Received Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead._id} onClick={() => setSelectedLead(lead)}>
                    <td>
                      <div className="lead-name-cell">{lead.name}</div>
                      <div className="lead-email-cell">{lead.email}</div>
                    </td>
                    <td><span className="lead-source-cell">{lead.source}</span></td>
                    <td>{renderStatusBadge(lead.status)}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-secondary btn-sm"
                        onClick={e => { e.stopPropagation(); setSelectedLead(lead); }}>
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onAdded={handleLeadAdded}
          token={token}
          backendUrl={backendUrl}
        />
      )}

      {/* Lead Details Drawer */}
      {selectedLead && (
        <LeadDetails
          lead={selectedLead}
          token={token}
          backendUrl={backendUrl}
          onClose={() => setSelectedLead(null)}
          onUpdateLead={handleUpdateLead}
          onDeleteLead={handleDeleteLead}
        />
      )}
    </div>
  );
};

export default Dashboard;
