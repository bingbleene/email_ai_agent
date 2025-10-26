/**
 * EmailDetailView Component - Redesigned
 * Hiển thị đầy đủ thông tin email đã được AI xử lý
 */
import React, { useState } from 'react';
import { 
  ArrowLeft, Copy, Check, Mail, Tag, FileText, 
  ChevronDown, ChevronUp, Clock, User, Send 
} from 'lucide-react';
import '../styles/EmailDetailView.css';

const EmailDetailView = ({ email, onBack }) => {
  const [copiedReply, setCopiedReply] = useState(false);
  const [showRawContent, setShowRawContent] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Debug: Log email data to see what we receive
  React.useEffect(() => {
    console.log('📧 Email Detail Data:', email);
    console.log('📝 Suggested Reply:', email.suggested_reply);
    console.log('💬 Reply:', email.reply);
  }, [email]);

  // Get category label and color
  const getCategoryInfo = (category) => {
    const categories = {
      Work: { label: 'Công việc', color: '#1976d2' },
      Personal: { label: 'Cá nhân', color: '#7b1fa2' },
      Newsletter: { label: 'Thông báo', color: '#f57c00' },
      Spam: { label: 'Spam', color: '#c62828' },
      Financial: { label: 'Tài chính', color: '#2e7d32' },
      Support: { label: 'Hỗ trợ', color: '#c2185b' },
      Announcement: { label: 'Công bố', color: '#00695c' }
    };
    return categories[category] || { label: category, color: '#6c757d' };
  };

  // Handle copy reply to clipboard
  const handleCopyReply = (replyText) => {
    navigator.clipboard.writeText(replyText || 'Không có phản hồi gợi ý');
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2000);
  };

  // Get reply text from email object
  const getReplyText = () => {
    // Try multiple fields to find reply
    const replyFields = [
      email.suggested_reply,
      email.reply,
      email.suggestedReply
    ];

    for (const field of replyFields) {
      if (!field) continue;

      // If field is an object with versions
      if (typeof field === 'object' && !Array.isArray(field)) {
        // Try standard first, then detailed, then brief
        if (field.standard && typeof field.standard === 'string') {
          return field.standard;
        }
        if (field.detailed && typeof field.detailed === 'string') {
          return field.detailed;
        }
        if (field.brief && typeof field.brief === 'string') {
          return field.brief;
        }
      }
      
      // If it's a plain string
      if (typeof field === 'string' && field.trim().length > 0) {
        return field;
      }
    }
    
    // If no reply found, generate a default one
    return `Kính gửi ${email.sender},

Cảm ơn bạn đã gửi email. Tôi đã nhận được tin nhắn của bạn về "${email.subject}".

Tôi sẽ xem xét và phản hồi sớm nhất có thể.

Trân trọng`;
  };

  // Format reply as full email
  const formatFullReply = () => {
    const replyText = getReplyText();
    return `Đến: ${email.sender}
Chủ đề: Re: ${email.subject}

${replyText}`;
  };

  // Handle copy full email reply
  const handleCopyFullReply = () => {
    navigator.clipboard.writeText(formatFullReply());
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2000);
  };

  // Handle schedule send
  const handleScheduleSend = () => {
    setShowScheduleModal(true);
  };

  const handleConfirmSchedule = () => {
    alert('Tính năng hẹn giờ gửi đang được phát triển!\n\nEmail sẽ được gửi vào thời gian bạn đã chọn.');
    setShowScheduleModal(false);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Không rõ';
    
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const categoryInfo = getCategoryInfo(email.category);

  return (
    <div className="email-detail-view">
      {/* Back Button */}
      <button className="btn-back-detail" onClick={onBack}>
        <ArrowLeft size={20} />
        Quay lại danh sách
      </button>

      {/* Email Header Card */}
      <div className="detail-card email-header-card">
        <div className="card-title-row">
          <h2>Chi tiết Email</h2>
          <div 
            className="category-badge-large"
            style={{ 
              background: `${categoryInfo.color}15`,
              color: categoryInfo.color,
              borderColor: categoryInfo.color
            }}
          >
            <Tag size={16} />
            {categoryInfo.label}
          </div>
        </div>

        {/* Email Title */}
        <h3 className="email-title">{email.subject}</h3>

        {/* Email Meta Info */}
        <div className="email-meta-grid">
          <div className="meta-item">
            <User size={18} className="meta-icon" />
            <div>
              <div className="meta-label">Người gửi</div>
              <div className="meta-value">{email.sender}</div>
            </div>
          </div>
          
          <div className="meta-item">
            <Clock size={18} className="meta-icon" />
            <div>
              <div className="meta-label">Thời gian nhận</div>
              <div className="meta-value">{formatDate(email.received_at)}</div>
            </div>
          </div>
          
          <div className="meta-item">
            <Mail size={18} className="meta-icon" />
            <div>
              <div className="meta-label">Trạng thái</div>
              <div className="meta-value status-processed">
                <Check size={14} />
                Đã xử lý
              </div>
            </div>
          </div>
          
          {email.processed_at && (
            <div className="meta-item">
              <Clock size={18} className="meta-icon" />
              <div>
                <div className="meta-label">Xử lý lúc</div>
                <div className="meta-value">{formatDate(email.processed_at)}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category & Summary Card */}
      <div className="detail-card summary-card">
        <h3 className="card-title">
          <FileText size={22} />
          Tóm tắt nội dung
        </h3>
        
        <div className="summary-content">
          {email.summary || 'Không có tóm tắt'}
        </div>

        {/* Email Importance (if available) */}
        {email.importance_score && (
          <div className="importance-section">
            <div className="importance-label">Độ quan trọng</div>
            <div className="importance-display-horizontal">
              <div className="importance-bar-container">
                <div 
                  className="importance-bar-fill"
                  style={{ 
                    width: `${email.importance_score}%`,
                    background: email.importance_score >= 70 ? '#dc3545' : 
                                email.importance_score >= 50 ? '#fd7e14' :
                                email.importance_score >= 30 ? '#ffc107' : '#28a745'
                  }}
                />
              </div>
              <div className="importance-score-text">
                {email.importance_score}/100
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Reply Card */}
      <div className="detail-card reply-card">
        <div className="card-title-row">
          <h3 className="card-title">
            <Mail size={22} />
            Phản hồi gợi ý
          </h3>
        </div>

        {/* Email Format Reply */}
        <div className="email-reply-format">
          <div className="reply-field">
            <label>Đến:</label>
            <div className="reply-value">{email.sender}</div>
          </div>
          <div className="reply-field">
            <label>Chủ đề:</label>
            <div className="reply-value">Re: {email.subject}</div>
          </div>
          <div className="reply-divider"></div>
          <div className="reply-body">
            {getReplyText()}
          </div>
          
          {/* Show all reply versions if available */}
          {email.suggested_reply && typeof email.suggested_reply === 'object' && (
            <div className="reply-versions-note">
              <small>
                💡 Phiên bản: 
                {email.suggested_reply.brief && ' Ngắn gọn'}
                {email.suggested_reply.standard && ' • Chuẩn'}
                {email.suggested_reply.detailed && ' • Chi tiết'}
              </small>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="reply-actions">
          <button 
            className={`btn-copy-reply ${copiedReply ? 'copied' : ''}`}
            onClick={handleCopyFullReply}
          >
            {copiedReply ? (
              <>
                <Check size={18} />
                Đã sao chép!
              </>
            ) : (
              <>
                <Copy size={18} />
                Sao chép email
              </>
            )}
          </button>
          
          <button 
            className="btn-schedule-send"
            onClick={handleScheduleSend}
          >
            <Clock size={18} />
            Hẹn giờ gửi
          </button>
          
          <button 
            className="btn-send-now"
            onClick={() => alert('Tính năng gửi email trực tiếp đang được phát triển!')}
          >
            <Send size={18} />
            Gửi ngay
          </button>
        </div>

        <div className="reply-hint">
          💡 Sao chép toàn bộ nội dung email để dán vào Gmail/Outlook, hoặc hẹn giờ gửi tự động
        </div>
      </div>

      {/* Raw Content Card (Collapsible) */}
      <div className="detail-card raw-content-card">
        <button 
          className="raw-content-toggle"
          onClick={() => setShowRawContent(!showRawContent)}
        >
          <div className="toggle-title">
            <FileText size={22} />
            <span>Nội dung gốc</span>
          </div>
          {showRawContent ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showRawContent && (
          <div className="raw-content-body">
            {email.body || email.raw_content || 'Không có nội dung'}
          </div>
        )}
      </div>

      {/* Additional Info (if available) */}
      {(email.tone || email.sentiment || email.key_points) && (
        <div className="detail-card additional-info-card">
          <h3 className="card-title">Thông tin bổ sung</h3>
          
          <div className="info-grid">
            {email.tone && (
              <div className="info-item">
                <div className="info-item-label">Giọng điệu</div>
                <div className="info-item-value">{email.tone}</div>
              </div>
            )}
            
            {email.sentiment && (
              <div className="info-item">
                <div className="info-item-label">Cảm xúc</div>
                <div className="info-item-value">{email.sentiment}</div>
              </div>
            )}
          </div>

          {email.key_points && email.key_points.length > 0 && (
            <div className="key-points-section">
              <div className="key-points-label">Điểm chính</div>
              <ul className="key-points-list">
                {email.key_points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Schedule Send Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Hẹn giờ gửi email</h3>
            <p>Chọn thời gian bạn muốn gửi email này</p>
            
            <div className="schedule-form">
              <div className="form-group">
                <label>Ngày gửi</label>
                <input 
                  type="date" 
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="form-group">
                <label>Giờ gửi</label>
                <input 
                  type="time" 
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowScheduleModal(false)}
              >
                Hủy
              </button>
              <button 
                className="btn-confirm"
                onClick={handleConfirmSchedule}
              >
                <Clock size={18} />
                Xác nhận hẹn giờ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailDetailView;
