import React, { useState } from 'react';
import { FiX, FiCheckSquare, FiSquare, FiPlus, FiTrash2, FiClock } from 'react-icons/fi';

const LeadDetails = ({ lead, onClose, onUpdateLead, onDeleteLead, token, backendUrl }) => {
  const [newNote, setNewNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNote, setFollowUpNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [submittingFollowUp, setSubmittingFollowUp] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`${backendUrl}/api/leads/${lead._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status');
      const updatedLead = await response.json();
      onUpdateLead(updatedLead);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmittingNote(true);
    try {
      const response = await fetch(`${backendUrl}/api/leads/${lead._id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newNote })
      });
      if (!response.ok) throw new Error('Failed to add note');
      const updatedLead = await response.json();
      onUpdateLead(updatedLead);
      setNewNote('');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleAddFollowUp = async (e) => {
    e.preventDefault();
    if (!followUpDate || !followUpNote.trim()) return;

    setSubmittingFollowUp(true);
    try {
      const response = await fetch(`${backendUrl}/api/leads/${lead._id}/followups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date: followUpDate, note: followUpNote })
      });
      if (!response.ok) throw new Error('Failed to create follow-up task');
      const updatedLead = await response.json();
      onUpdateLead(updatedLead);
      setFollowUpDate('');
      setFollowUpNote('');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingFollowUp(false);
    }
  };

  const handleToggleFollowUp = async (followupId) => {
    try {
      const response = await fetch(`${backendUrl}/api/leads/${lead._id}/followups/${followupId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to update follow-up state');
      const updatedLead = await response.json();
      onUpdateLead(updatedLead);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete lead ${lead.name}?`)) return;
    
    try {
      const response = await fetch(`${backendUrl}/api/leads/${lead._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete lead');
      onDeleteLead(lead._id);
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const isOverdue = (dateString, completed) => {
    if (completed) return false;
    return new Date(dateString) < new Date();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h3>Lead Details</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {lead._id}</span>
          </div>
          <button className="drawer-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="drawer-body">
          {/* Metadata Card */}
          <div className="glass-card" style={{ padding: '1rem', background: '#f9f9f9', marginBottom: '1.5rem', border: '1px solid #e0e0e0' }}>
            <div className="lead-meta-info">
              <div className="meta-item">
                <label>Name</label>
                <p style={{ fontWeight: 'bold' }}>{lead.name}</p>
              </div>
              <div className="meta-item">
                <label>Email</label>
                <p><a href={`mailto:${lead.email}`} style={{ color: '#0a0a0a', textDecoration: 'underline', textUnderlineOffset: '3px' }}>{lead.email}</a></p>
              </div>
              <div className="meta-item" style={{ marginTop: '0.75rem' }}>
                <label>Source</label>
                <p style={{ color: '#444444' }}>{lead.source}</p>
              </div>
              <div className="meta-item" style={{ marginTop: '0.75rem' }}>
                <label>Received Date</label>
                <p style={{ fontSize: '0.85rem' }}>{formatDate(lead.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Status Actions */}
          <div className="lead-status-action">
            <label>Update Client Status</label>
            <div className="status-btn-group">
              <button
                className={`btn btn-sm ${lead.status === 'New' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleStatusChange('New')}
              >
                New
              </button>
              <button
                className={`btn btn-sm ${lead.status === 'Contacted' ? 'btn-primary' : 'btn-secondary'}`}
                style={lead.status === 'Contacted' ? { background: '#555555', borderColor: '#555555', color: 'white' } : {}}
                onClick={() => handleStatusChange('Contacted')}
              >
                Contacted
              </button>
              <button
                className={`btn btn-sm ${lead.status === 'Converted' ? 'btn-primary' : 'btn-secondary'}`}
                style={lead.status === 'Converted' ? { background: '#0a0a0a', borderColor: '#0a0a0a', color: 'white' } : {}}
                onClick={() => handleStatusChange('Converted')}
              >
                Converted
              </button>
            </div>
          </div>

          {/* Follow ups checklist */}
          <div className="section-title">
            <FiCheckSquare style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
            <span>Follow-ups</span>
          </div>

          <div className="followups-list">
            {lead.followUps && lead.followUps.length > 0 ? (
              lead.followUps.map((item) => (
                <div key={item._id} className={`followup-item ${item.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    className="followup-checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleFollowUp(item._id)}
                  />
                  <div className="followup-body">
                    <span className="followup-note">{item.note}</span>
                    <span className="followup-date">
                      <FiClock style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
                      {new Date(item.date).toLocaleDateString()}
                      {isOverdue(item.date, item.completed) && (
                        <span className="badge-overdue">Overdue</span>
                      )}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: '0.5rem' }}>
                No follow-ups scheduled.
              </p>
            )}
          </div>

          {/* Schedule Followup Form */}
          <form onSubmit={handleAddFollowUp} className="add-item-form glass-card" style={{ padding: '1rem', background: '#f5f5f5', border: '1px solid #e0e0e0', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              Schedule New Follow-up
            </span>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <input
                type="date"
                className="input-field"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <input
                type="text"
                placeholder="Follow-up objective / task..."
                className="input-field"
                value={followUpNote}
                onChange={(e) => setFollowUpNote(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm" style={{ width: '100%' }} disabled={submittingFollowUp}>
              <FiPlus /> {submittingFollowUp ? 'Scheduling...' : 'Add Follow-up'}
            </button>
          </form>

          {/* Notes History */}
          <div className="section-title">Notes & Log History</div>

          <div className="notes-timeline">
            {lead.notes && lead.notes.length > 0 ? (
              lead.notes.slice().reverse().map((note) => (
                <div key={note._id} className="note-item">
                  <div className="note-header">
                    <span>Admin Entry</span>
                    <span>{formatDate(note.createdAt)}</span>
                  </div>
                  <p className="note-content">{note.content}</p>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: '0.5rem' }}>
                No interaction logs recorded.
              </p>
            )}
          </div>

          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="add-item-form" style={{ marginBottom: '2rem' }}>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <textarea
                placeholder="Type interactions details, email replies, call logs..."
                rows="3"
                className="textarea-field"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }} disabled={submittingNote}>
              <FiPlus /> {submittingNote ? 'Saving...' : 'Add Note Entry'}
            </button>
          </form>

          {/* Delete Action */}
          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <button className="btn btn-danger" style={{ width: '100%' }} onClick={handleDelete}>
              <FiTrash2 /> Delete Lead Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
