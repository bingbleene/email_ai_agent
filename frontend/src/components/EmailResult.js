/**
 * EmailResult Component
 * Displays the processed email result with all AI analysis
 */
import React from 'react';
import {
  CheckCircle,
  AlertCircle,
  Tag,
  FileText,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  Copy,
  Check,
} from 'lucide-react';

const EmailResult = ({ result }) => {
  const [copiedReply, setCopiedReply] = React.useState(null);

  if (!result || !result.success) {
    return (
      <div className="email-result error">
        <AlertCircle size={48} />
        <h3>Processing Failed</h3>
        <p>{result?.error || 'An error occurred while processing the email.'}</p>
      </div>
    );
  }

  const {
    category,
    classification_confidence,
    summary,
    key_points,
    action_items,
    is_important,
    importance_score,
    importance_level,
    tone,
    formality,
    suggested_actions,
    suggested_reply,
  } = result;

  // Get importance color
  const getImportanceColor = () => {
    if (importance_score >= 70) return 'critical';
    if (importance_score >= 50) return 'high';
    if (importance_score >= 30) return 'medium';
    return 'low';
  };

  // Get category color
  const getCategoryColor = () => {
    const colors = {
      Work: 'blue',
      Personal: 'green',
      Spam: 'red',
      Newsletter: 'purple',
      Announcement: 'orange',
      Support: 'cyan',
      Financial: 'yellow',
    };
    return colors[category] || 'gray';
  };

  // Copy reply to clipboard
  const copyReply = (text, version) => {
    navigator.clipboard.writeText(text);
    setCopiedReply(version);
    setTimeout(() => setCopiedReply(null), 2000);
  };

  return (
    <div className="email-result success">
      <div className="result-header">
        <CheckCircle size={48} color="#10B981" />
        <h2>✅ Email Processed Successfully!</h2>
      </div>

      {/* Category and Importance */}
      <div className="result-grid">
        <div className="result-card">
          <div className="card-header">
            <Tag size={20} />
            <h3>Classification</h3>
          </div>
          <div className="card-content">
            <div className={`category-badge ${getCategoryColor()}`}>
              {category}
            </div>
            <p className="confidence">
              Confidence: {(classification_confidence * 100).toFixed(0)}%
            </p>
          </div>
        </div>

        <div className="result-card">
          <div className="card-header">
            <TrendingUp size={20} />
            <h3>Importance</h3>
          </div>
          <div className="card-content">
            <div className={`importance-badge ${getImportanceColor()}`}>
              {importance_level}
            </div>
            <div className="importance-score">
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{ width: `${importance_score}%` }}
                />
              </div>
              <span>{importance_score}/100</span>
            </div>
            {is_important && (
              <p className="important-flag">⚠️ Requires Attention</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="result-card full-width">
        <div className="card-header">
          <FileText size={20} />
          <h3>Summary</h3>
        </div>
        <div className="card-content">
          <p className="summary-text">{summary}</p>
          
          {/* Tone and Formality */}
          <div className="tone-badges">
            <span className="tone-badge">Tone: {tone}</span>
            <span className="tone-badge">Formality: {formality}</span>
          </div>
        </div>
      </div>

      {/* Key Points */}
      {key_points && key_points.length > 0 && (
        <div className="result-card full-width">
          <div className="card-header">
            <Lightbulb size={20} />
            <h3>Key Points</h3>
          </div>
          <div className="card-content">
            <ul className="key-points-list">
              {key_points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Action Items */}
      {action_items && action_items.length > 0 && (
        <div className="result-card full-width">
          <div className="card-header">
            <CheckCircle size={20} />
            <h3>Action Items</h3>
          </div>
          <div className="card-content">
            <ul className="action-items-list">
              {action_items.map((item, index) => (
                <li key={index}>
                  <input type="checkbox" id={`action-${index}`} />
                  <label htmlFor={`action-${index}`}>{item}</label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Suggested Actions */}
      <div className="result-card full-width">
        <div className="card-header">
          <AlertCircle size={20} />
          <h3>Suggested Actions</h3>
        </div>
        <div className="card-content">
          <div className="action-tags">
            {suggested_actions.map((action, index) => (
              <span key={index} className="action-tag">
                {action.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Reply */}
      {suggested_reply && (
        <div className="result-card full-width reply-section">
          <div className="card-header">
            <MessageSquare size={20} />
            <h3>Suggested Replies</h3>
          </div>
          <div className="card-content">
            {/* Brief Reply */}
            <div className="reply-option">
              <div className="reply-header">
                <strong>Brief Reply</strong>
                <button
                  onClick={() => copyReply(suggested_reply.brief, 'brief')}
                  className="btn-copy"
                >
                  {copiedReply === 'brief' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className="reply-text">{suggested_reply.brief}</p>
            </div>

            {/* Standard Reply */}
            <div className="reply-option">
              <div className="reply-header">
                <strong>Standard Reply</strong>
                <button
                  onClick={() => copyReply(suggested_reply.standard, 'standard')}
                  className="btn-copy"
                >
                  {copiedReply === 'standard' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className="reply-text">{suggested_reply.standard}</p>
            </div>

            {/* Detailed Reply */}
            <div className="reply-option">
              <div className="reply-header">
                <strong>Detailed Reply</strong>
                <button
                  onClick={() => copyReply(suggested_reply.detailed, 'detailed')}
                  className="btn-copy"
                >
                  {copiedReply === 'detailed' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className="reply-text">{suggested_reply.detailed}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailResult;
