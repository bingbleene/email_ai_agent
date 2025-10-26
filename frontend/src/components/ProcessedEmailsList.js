/**
 * ProcessedEmailsList Component
 * Displays categorized and processed emails
 */
import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Filter, Search } from 'lucide-react';
import '../styles/ProcessedEmailsList.css';

const ProcessedEmailsList = ({ processedEmails, onSelectEmail }) => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Work', 'Personal', 'Newsletter', 'Spam', 'Financial', 'Support', 'Announcement'];

  const getCategoryColor = (category) => {
    const colors = {
      Work: '#3B82F6',
      Personal: '#10B981',
      Spam: '#EF4444',
      Newsletter: '#8B5CF6',
      Announcement: '#F59E0B',
      Support: '#06B6D4',
      Financial: '#F97316',
    };
    return colors[category] || '#6B7280';
  };

  const getImportanceLevel = (score) => {
    if (score >= 70) return { level: 'Critical', color: '#DC2626', icon: '🔴' };
    if (score >= 50) return { level: 'High', color: '#EA580C', icon: '🟠' };
    if (score >= 30) return { level: 'Medium', color: '#CA8A04', icon: '🟡' };
    return { level: 'Low', color: '#65A30D', icon: '🟢' };
  };

  // Filter emails
  const filteredEmails = processedEmails.filter((email) => {
    const matchesCategory = filterCategory === 'All' || email.category === filterCategory;
    const matchesSearch = !searchQuery ||
      email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort by importance (highest first)
  const sortedEmails = [...filteredEmails].sort((a, b) => b.importance_score - a.importance_score);

  return (
    <div className="processed-emails-list">
      <div className="list-header">
        <h2>
          <CheckCircle size={24} color="#10B981" />
          Processed Emails ({sortedEmails.length})
        </h2>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filters">
          <Filter size={18} />
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Email Grid */}
      {sortedEmails.length === 0 ? (
        <div className="no-results">
          <AlertCircle size={48} color="#9CA3AF" />
          <p>No emails found</p>
          <small>Try adjusting your filters</small>
        </div>
      ) : (
        <div className="processed-grid">
          {sortedEmails.map((email, index) => {
            const importance = getImportanceLevel(email.importance_score);
            return (
              <div
                key={email.email_id || index}
                className="processed-card"
                onClick={() => onSelectEmail(email)}
              >
                <div className="card-header">
                  <div className="category-badge" style={{ backgroundColor: getCategoryColor(email.category) }}>
                    {email.category}
                  </div>
                  <div className="importance-badge" style={{ color: importance.color }}>
                    {importance.icon} {importance.level}
                  </div>
                </div>

                <div className="card-body">
                  <div className="email-sender">{email.sender}</div>
                  <div className="email-subject">{email.subject || '(No subject)'}</div>
                  <div className="email-summary">{email.summary}</div>
                </div>

                <div className="card-footer">
                  <div className="score-bar">
                    <div className="score-label">Importance: {email.importance_score}/100</div>
                    <div className="score-track">
                      <div
                        className="score-fill"
                        style={{
                          width: `${email.importance_score}%`,
                          backgroundColor: importance.color
                        }}
                      />
                    </div>
                  </div>
                  <div className="tone-badge">{email.tone}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProcessedEmailsList;
