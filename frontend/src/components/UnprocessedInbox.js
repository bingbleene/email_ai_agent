/**
 * UnprocessedInbox Component
 * Displays list of unprocessed emails with checkboxes for batch selection
 */
import React, { useState } from 'react';
import { Mail, RefreshCw, Inbox, CheckSquare, Square, Clock } from 'lucide-react';
import '../styles/UnprocessedInbox.css';

const UnprocessedInbox = ({ emails, onProcessSelected, processing, onRefresh, onAddEmail }) => {
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Toggle individual email selection
  const toggleEmailSelection = (emailId) => {
    setSelectedEmails(prev => {
      if (prev.includes(emailId)) {
        return prev.filter(id => id !== emailId);
      } else {
        return [...prev, emailId];
      }
    });
  };

  // Toggle select all emails
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmails([]);
      setSelectAll(false);
    } else {
      setSelectedEmails(emails.map(email => email.id));
      setSelectAll(true);
    }
  };

  // Handle process selected emails
  const handleProcess = () => {
    if (selectedEmails.length === 0) {
      alert('Vui lòng chọn ít nhất một email để xử lý');
      return;
    }
    
    const emailsToProcess = emails.filter(email => selectedEmails.includes(email.id));
    onProcessSelected(emailsToProcess);
    setSelectedEmails([]);
    setSelectAll(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Vừa xong';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div className="unprocessed-inbox">
      {/* Header */}
      <div className="inbox-header-section">
        <div className="header-title">
          <Inbox size={32} />
          <div>
            <h2>Hộp thư đến</h2>
            <p>{emails.length} email chưa xử lý</p>
          </div>
        </div>
        <button 
          className="btn-refresh" 
          onClick={onRefresh}
          disabled={processing}
        >
          <RefreshCw size={18} />
          Làm mới
        </button>
      </div>

      {/* Toolbar */}
      <div className="inbox-toolbar">
        <div className="toolbar-left">
          <button 
            className="btn-checkbox-all"
            onClick={toggleSelectAll}
          >
            {selectAll ? <CheckSquare size={20} /> : <Square size={20} />}
            <span>Chọn tất cả</span>
          </button>
          <div className="selected-count">
            {selectedEmails.length > 0 && (
              <span>{selectedEmails.length} email đã chọn</span>
            )}
          </div>
        </div>
        
        <div className="toolbar-right">
          <button 
            className="btn-process-selected"
            onClick={handleProcess}
            disabled={processing || selectedEmails.length === 0}
          >
            {processing ? (
              <>
                <div className="spinner-small"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                <Mail size={18} />
                Xử lý email đã chọn
              </>
            )}
          </button>
        </div>
      </div>

      {/* Email List */}
      <div className="email-list-container">
        {emails.length === 0 ? (
          <div className="empty-inbox">
            <Inbox size={64} />
            <h3>Hộp thư trống</h3>
            <p>Không có email nào cần xử lý</p>
            <button className="btn-add-email" onClick={onAddEmail}>
              <Mail size={18} />
              Thêm email mới
            </button>
          </div>
        ) : (
          <table className="email-table">
            <thead>
              <tr>
                <th className="col-checkbox"></th>
                <th className="col-sender">Người gửi</th>
                <th className="col-subject">Tiêu đề</th>
                <th className="col-preview">Nội dung</th>
                <th className="col-time">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => (
                <tr 
                  key={email.id}
                  className={`email-row ${selectedEmails.includes(email.id) ? 'selected' : ''}`}
                  onClick={() => toggleEmailSelection(email.id)}
                >
                  <td className="col-checkbox">
                    <button 
                      className="checkbox-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEmailSelection(email.id);
                      }}
                    >
                      {selectedEmails.includes(email.id) ? (
                        <CheckSquare size={20} className="checkbox-checked" />
                      ) : (
                        <Square size={20} className="checkbox-unchecked" />
                      )}
                    </button>
                  </td>
                  <td className="col-sender">
                    <div className="sender-info">
                      <div className="sender-avatar">
                        {email.sender.charAt(0).toUpperCase()}
                      </div>
                      <span className="sender-email">{email.sender}</span>
                    </div>
                  </td>
                  <td className="col-subject">
                    <span className="subject-text">{email.subject}</span>
                  </td>
                  <td className="col-preview">
                    <span className="preview-text">
                      {email.body.substring(0, 80)}...
                    </span>
                  </td>
                  <td className="col-time">
                    <div className="time-info">
                      <Clock size={14} />
                      <span>{formatDate(email.received_at)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Processing Indicator */}
      {processing && (
        <div className="processing-overlay">
          <div className="processing-modal">
            <div className="spinner-large"></div>
            <h3>Đang xử lý email...</h3>
            <p>Hệ thống AI đang phân tích và phân loại email của bạn</p>
            <small>Vui lòng chờ trong giây lát</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnprocessedInbox;
