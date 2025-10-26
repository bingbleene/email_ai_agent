/**
 * EmailList Component
 * Displays list of processed emails with filtering
 */
import React, { useState, useEffect } from 'react';
import { emailApi } from '../services/api';
import {
  Mail,
  Filter,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  Loader,
} from 'lucide-react';

const EmailList = ({ userId, refresh }) => {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEmail, setExpandedEmail] = useState(null);

  // Categories for filtering
  const categories = [
    'All',
    'Work',
    'Personal',
    'Newsletter',
    'Announcement',
    'Support',
    'Financial',
    'Spam',
  ];

  // Load emails
  useEffect(() => {
    loadEmails();
  }, [userId, refresh]);

  // Apply filters
  useEffect(() => {
    let filtered = [...emails];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((email) => email.category === selectedCategory);
    }

    // Filter by importance
    if (showImportantOnly) {
      filtered = filtered.filter((email) => email.is_important);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (email) =>
          email.subject?.toLowerCase().includes(query) ||
          email.sender?.toLowerCase().includes(query) ||
          email.summary?.toLowerCase().includes(query)
      );
    }

    setFilteredEmails(filtered);
  }, [emails, selectedCategory, showImportantOnly, searchQuery]);

  const loadEmails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailApi.getEmails(userId);
      setEmails(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load emails');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (emailId) => {
    if (window.confirm('Are you sure you want to delete this email?')) {
      try {
        await emailApi.deleteEmail(emailId, userId);
        setEmails(emails.filter((e) => e.email_id !== emailId));
      } catch (err) {
        alert('Failed to delete email: ' + err.message);
      }
    }
  };

  const toggleExpand = (emailId) => {
    setExpandedEmail(expandedEmail === emailId ? null : emailId);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Work: '#3B82F6',
      Personal: '#10B981',
      Spam: '#EF4444',
      Newsletter: '#8B5CF6',
      Announcement: '#F59E0B',
      Support: '#06B6D4',
      Financial: '#F59E0B',
    };
    return colors[category] || '#6B7280';
  };

  if (loading) {
    return (
      <div className="email-list-loading">
        <Loader className="spin" size={32} />
        <p>Loading emails...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="email-list-error">
        <p>❌ {error}</p>
        <button onClick={loadEmails} className="btn-secondary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="email-list-container">
      <div className="list-header">
        <h2>
          <Mail size={24} />
          Processed Emails ({filteredEmails.length})
        </h2>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <Filter size={18} />
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showImportantOnly}
            onChange={(e) => setShowImportantOnly(e.target.checked)}
          />
          Important Only
        </label>
      </div>

      {/* Email List */}
      {filteredEmails.length === 0 ? (
        <div className="no-emails">
          <Mail size={48} color="#9CA3AF" />
          <p>No emails found</p>
          <small>Try adjusting your filters or process a new email</small>
        </div>
      ) : (
        <div className="emails-grid">
          {filteredEmails.map((email) => (
            <div key={email.email_id} className="email-card">
              <div className="email-card-header">
                <div className="email-info">
                  <div className="email-meta">
                    <span
                      className="category-dot"
                      style={{ backgroundColor: getCategoryColor(email.category) }}
                    />
                    <strong>{email.subject || 'No subject'}</strong>
                    {email.is_important && <span className="important-badge">⚠️</span>}
                  </div>
                  <small className="sender">From: {email.sender}</small>
                </div>
                <div className="email-actions">
                  <button
                    onClick={() => toggleExpand(email.email_id)}
                    className="btn-icon"
                    title={expandedEmail === email.email_id ? 'Collapse' : 'Expand'}
                  >
                    {expandedEmail === email.email_id ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(email.email_id)}
                    className="btn-icon delete"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="email-card-body">
                <p className="summary">{email.summary}</p>
                <div className="email-tags">
                  <span className="tag category">{email.category}</span>
                  <span className="tag tone">{email.tone}</span>
                  <span className="tag score">Score: {email.importance_score}</span>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedEmail === email.email_id && (
                <div className="email-details">
                  <div className="detail-section">
                    <strong>Body:</strong>
                    <p>{email.body?.substring(0, 200)}...</p>
                  </div>

                  {email.key_points && email.key_points.length > 0 && (
                    <div className="detail-section">
                      <strong>Key Points:</strong>
                      <ul>
                        {email.key_points.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {email.action_items && email.action_items.length > 0 && (
                    <div className="detail-section">
                      <strong>Action Items:</strong>
                      <ul>
                        {email.action_items.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {email.suggested_action && email.suggested_action.length > 0 && (
                    <div className="detail-section">
                      <strong>Suggested Actions:</strong>
                      <div className="action-tags-small">
                        {email.suggested_action.map((action, idx) => (
                          <span key={idx} className="action-tag-small">
                            {action.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailList;
