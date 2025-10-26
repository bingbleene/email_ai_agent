/**
 * InboxManager Component
 * Manages email inbox with batch processing
 */
import React, { useState } from 'react';
import { Mail, Upload, Plus, Trash2, Send } from 'lucide-react';
import '../styles/InboxManager.css';

const InboxManager = ({ onProcessBatch }) => {
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState({
    sender: '',
    subject: '',
    body: ''
  });

  // Sample emails for quick testing
  const sampleEmails = [
    {
      sender: 'boss@company.com',
      subject: 'URGENT: Budget Approval Needed',
      body: 'We need to finalize the Q4 budget by end of day. Board meeting tomorrow requires these numbers. Please review and approve ASAP.'
    },
    {
      sender: 'friend@gmail.com',
      subject: 'Coffee this weekend?',
      body: 'Hey! Want to grab coffee on Saturday? I found a new cafe downtown that has amazing pastries.'
    },
    {
      sender: 'newsletter@techcrunch.com',
      subject: 'TechCrunch Daily: Top tech news',
      body: 'Here\'s your daily dose of tech news:\n1. AI startup raises $100M Series B\n2. New iPhone features leaked\n3. Tesla stock surges 15%'
    },
    {
      sender: 'bank@vietcombank.com.vn',
      subject: 'Your credit card payment is due',
      body: 'Dear customer, your credit card payment of $500 is due on October 25, 2025. Please pay before the deadline to avoid late fees.'
    },
    {
      sender: 'support@shopee.vn',
      subject: 'Your order has been shipped',
      body: 'Good news! Your order #12345 has been shipped and will arrive in 2-3 business days. Track your package here.'
    }
  ];

  const handleAddEmail = () => {
    if (currentEmail.sender && (currentEmail.subject || currentEmail.body)) {
      setEmails([...emails, { ...currentEmail, id: Date.now() }]);
      setCurrentEmail({ sender: '', subject: '', body: '' });
    } else {
      alert('Please fill in at least sender and subject or body');
    }
  };

  const handleLoadSamples = () => {
    setEmails(sampleEmails.map((email, idx) => ({ ...email, id: Date.now() + idx })));
  };

  const handleRemoveEmail = (id) => {
    setEmails(emails.filter(email => email.id !== id));
  };

  const handleProcessAll = () => {
    if (emails.length === 0) {
      alert('No emails to process. Add some emails first!');
      return;
    }
    onProcessBatch(emails);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data)) {
          const formattedEmails = data.map((email, idx) => ({
            id: Date.now() + idx,
            sender: email.sender || email.from || '',
            subject: email.subject || '',
            body: email.body || email.content || ''
          }));
          setEmails([...emails, ...formattedEmails]);
        } else {
          alert('Invalid JSON format. Expected an array of emails.');
        }
      } catch (err) {
        alert('Failed to parse JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="inbox-manager">
      <div className="inbox-header">
        <h2>
          <Mail size={24} />
          Email Inbox Manager
        </h2>
        <div className="inbox-stats">
          <span className="stat-badge">{emails.length} emails ready</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button onClick={handleLoadSamples} className="btn-secondary">
          <Upload size={18} />
          Load Sample Emails
        </button>
        <label className="btn-secondary file-upload-btn">
          <Upload size={18} />
          Upload JSON File
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Add Email Form */}
      <div className="add-email-form">
        <h3>Add Email Manually</h3>
        <div className="form-row">
          <input
            type="email"
            placeholder="Sender email (e.g., john@example.com)"
            value={currentEmail.sender}
            onChange={(e) => setCurrentEmail({ ...currentEmail, sender: e.target.value })}
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Subject"
            value={currentEmail.subject}
            onChange={(e) => setCurrentEmail({ ...currentEmail, subject: e.target.value })}
          />
        </div>
        <div className="form-row">
          <textarea
            placeholder="Email body"
            rows="3"
            value={currentEmail.body}
            onChange={(e) => setCurrentEmail({ ...currentEmail, body: e.target.value })}
          />
        </div>
        <button onClick={handleAddEmail} className="btn-primary">
          <Plus size={18} />
          Add to Inbox
        </button>
      </div>

      {/* Email List */}
      <div className="inbox-list">
        <div className="inbox-list-header">
          <h3>Inbox ({emails.length} emails)</h3>
          {emails.length > 0 && (
            <button onClick={() => setEmails([])} className="btn-clear-all">
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>

        {emails.length === 0 ? (
          <div className="empty-inbox">
            <Mail size={48} color="#9CA3AF" />
            <p>No emails in inbox</p>
            <small>Add emails manually or load sample emails to get started</small>
          </div>
        ) : (
          <div className="email-items">
            {emails.map((email, index) => (
              <div key={email.id} className="email-item">
                <div className="email-item-number">{index + 1}</div>
                <div className="email-item-content">
                  <div className="email-item-sender">{email.sender}</div>
                  <div className="email-item-subject">{email.subject || '(No subject)'}</div>
                  <div className="email-item-preview">
                    {email.body.substring(0, 80)}...
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveEmail(email.id)}
                  className="btn-remove"
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Process Button */}
      {emails.length > 0 && (
        <div className="process-section">
          <button onClick={handleProcessAll} className="btn-process-all">
            <Send size={20} />
            Process All {emails.length} Emails with AI
          </button>
          <p className="process-note">
            This will analyze all emails using AI agents for classification, summarization, and reply generation
          </p>
        </div>
      )}
    </div>
  );
};

export default InboxManager;
