/**
 * ProcessedList Component
 * Displays list of processed emails with category, summary, and status
 */
import React, { useState } from 'react';
import { CheckCircle, Search, Filter, Eye } from 'lucide-react';
import '../styles/ProcessedList.css';

const ProcessedList = ({ emails, onViewDetail }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = [
    { value: 'All', label: 'Tất cả', color: '#6c757d' },
    { value: 'Work', label: 'Công việc', color: '#1976d2' },
    { value: 'Personal', label: 'Cá nhân', color: '#7b1fa2' },
    { value: 'Newsletter', label: 'Thông báo', color: '#f57c00' },
    { value: 'Spam', label: 'Spam', color: '#c62828' },
    { value: 'Financial', label: 'Tài chính', color: '#2e7d32' },
    { value: 'Support', label: 'Hỗ trợ', color: '#c2185b' },
    { value: 'Announcement', label: 'Công bố', color: '#00695c' }
  ];

  // Get category label and color
  const getCategoryInfo = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat || { label: category, color: '#6c757d' };
  };

  // Filter emails based on search and category
  const filteredEmails = emails.filter(email => {
    const matchesSearch = 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (email.summary && email.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'All' || email.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="processed-list">
      {/* Header */}
      <div className="processed-header-section">
        <div className="header-title">
          <CheckCircle size={32} />
          <div>
            <h2>Email đã xử lý</h2>
            <p>{emails.length} email đã được phân loại và phân tích</p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="filter-section">
        {/* Search Box */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo người gửi, tiêu đề hoặc tóm tắt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <Filter size={18} />
          <span>Lọc theo loại:</span>
          <div className="filter-chips">
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`filter-chip ${filterCategory === cat.value ? 'active' : ''}`}
                style={{
                  borderColor: filterCategory === cat.value ? cat.color : '#dee2e6',
                  background: filterCategory === cat.value ? cat.color : 'white',
                  color: filterCategory === cat.value ? 'white' : '#495057'
                }}
                onClick={() => setFilterCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email Cards */}
      <div className="processed-cards-container">
        {filteredEmails.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={64} />
            <h3>Không tìm thấy email</h3>
            <p>Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          filteredEmails.map((email) => {
            const categoryInfo = getCategoryInfo(email.category);
            
            return (
              <div key={email.id} className="processed-card">
                {/* Card Header */}
                <div className="card-header-row">
                  <div 
                    className="category-badge"
                    style={{ 
                      background: `${categoryInfo.color}15`,
                      color: categoryInfo.color,
                      borderColor: categoryInfo.color
                    }}
                  >
                    {categoryInfo.label}
                  </div>
                  <div className="status-badge">
                    <CheckCircle size={14} />
                    Đã xử lý
                  </div>
                </div>

                {/* Sender */}
                <div className="card-sender">
                  <div className="sender-avatar-small">
                    {email.sender.charAt(0).toUpperCase()}
                  </div>
                  <span>{email.sender}</span>
                </div>

                {/* Subject */}
                <h3 className="card-subject">{email.subject}</h3>

                {/* Summary */}
                {email.summary && (
                  <p className="card-summary">{email.summary}</p>
                )}

                {/* Footer */}
                <div className="card-footer-row">
                  <span className="card-date">
                    {formatDate(email.processed_at || email.received_at)}
                  </span>
                  <button 
                    className="btn-view-detail"
                    onClick={() => onViewDetail(email)}
                  >
                    <Eye size={16} />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      {emails.length > 0 && (
        <div className="summary-stats">
          <div className="stat-item">
            <div className="stat-number">{emails.length}</div>
            <div className="stat-label">Tổng số email</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{filteredEmails.length}</div>
            <div className="stat-label">Đang hiển thị</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {new Set(emails.map(e => e.category)).size}
            </div>
            <div className="stat-label">Danh mục</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessedList;
