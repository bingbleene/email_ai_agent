/**
 * EmailForm Component
 * Form for inputting email to process
 */
import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';

const EmailForm = ({ onSubmit, isProcessing }) => {
  const [formData, setFormData] = useState({
    sender: '',
    subject: '',
    body: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.subject || formData.body) {
      onSubmit(formData);
    }
  };

  const handleClear = () => {
    setFormData({ sender: '', subject: '', body: '' });
  };

  // Sample emails for quick testing
  const loadSample = (type) => {
    const samples = {
      urgent: {
        sender: 'boss@company.com',
        subject: 'URGENT: Budget Approval Needed',
        body: 'Hi team,\n\nWe need to finalize the Q4 budget by end of day today. This is critical for our planning.\n\nPlease review and send your approval ASAP. The deadline cannot be extended as we have a board meeting tomorrow morning.\n\nThanks,\nSarah Johnson\nCEO',
      },
      personal: {
        sender: 'friend@gmail.com',
        subject: 'Coffee this weekend?',
        body: 'Hey!\n\nHope you\'re doing well! Want to grab coffee on Saturday? There\'s a new café downtown I\'ve been wanting to try.\n\nLet me know if you\'re free!\n\nCheers',
      },
      newsletter: {
        sender: 'newsletter@techcrunch.com',
        subject: 'TechCrunch Daily: Top tech news',
        body: 'Here\'s your daily dose of tech news:\n\n1. AI startup raises $100M Series B\n2. New iPhone features leaked\n3. Tesla stock surges 15%\n\nRead more on our website.\nUnsubscribe anytime.',
      },
    };
    setFormData(samples[type]);
  };

  return (
    <div className="email-form-container">
      <div className="form-header">
        <h2>📧 Process New Email</h2>
        <p>Enter email details to analyze and classify</p>
      </div>

      {/* Sample Email Buttons */}
      <div className="sample-buttons">
        <button onClick={() => loadSample('urgent')} className="btn-sample">
          Load Urgent Email
        </button>
        <button onClick={() => loadSample('personal')} className="btn-sample">
          Load Personal Email
        </button>
        <button onClick={() => loadSample('newsletter')} className="btn-sample">
          Load Newsletter
        </button>
      </div>

      <form onSubmit={handleSubmit} className="email-form">
        <div className="form-group">
          <label htmlFor="sender">From (Sender Email)</label>
          <input
            type="email"
            id="sender"
            name="sender"
            value={formData.sender}
            onChange={handleChange}
            placeholder="sender@example.com"
            disabled={isProcessing}
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">
            Subject <span className="required">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Email subject"
            required={!formData.body}
            disabled={isProcessing}
          />
        </div>

        <div className="form-group">
          <label htmlFor="body">
            Email Body <span className="required">*</span>
          </label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            placeholder="Email content..."
            rows="8"
            required={!formData.subject}
            disabled={isProcessing}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleClear}
            className="btn-secondary"
            disabled={isProcessing}
          >
            Clear
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isProcessing || (!formData.subject && !formData.body)}
          >
            {isProcessing ? (
              <>
                <Loader className="spin" size={18} />
                Processing...
              </>
            ) : (
              <>
                <Send size={18} />
                Process Email
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailForm;
