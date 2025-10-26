# AI Email Assistant - Batch Processing UI Guide

## 🎯 New UI Overview

The UI has been completely redesigned for batch email processing with an inbox-style workflow.

### Workflow
1. **Inbox** → Add multiple emails (manual input, sample load, or JSON upload)
2. **Process All** → AI agents process all emails in batch
3. **Processed List** → View categorized emails with filtering and search
4. **Email Detail** → See full analysis and suggested replies

---

## 🚀 Quick Start

### 1. Start Backend
```powershell
cd d:\DownloadLT\UIT\jib\my_ai_agent\backend
python run.py
```
Backend will run on http://localhost:5000

### 2. Start Frontend
```powershell
cd d:\DownloadLT\UIT\jib\my_ai_agent\frontend
npm start
```
Frontend will open at http://localhost:3000

---

## 📧 Using the Inbox Manager

### Option 1: Load Sample Emails
1. Go to **Inbox** tab
2. Click **"Load Sample Emails"** button
3. 5 diverse sample emails will be loaded:
   - Boss (Urgent Budget - Work)
   - Friend (Coffee Meetup - Personal)
   - Newsletter (Tech News)
   - Bank (Payment Due - Financial)
   - Shopee (Shipping Update - Support)

### Option 2: Add Email Manually
1. Fill in the form:
   - **Sender**: Email address (e.g., john@example.com)
   - **Subject**: Email subject line
   - **Body**: Full email content
2. Click **"Add Email"**
3. Repeat for multiple emails

### Option 3: Upload JSON File
1. Click **"Upload JSON"** button
2. Select a JSON file with this format:
```json
[
  {
    "sender": "sender@example.com",
    "subject": "Email Subject",
    "body": "Email body content..."
  },
  {
    "sender": "another@example.com",
    "subject": "Another Subject",
    "body": "More content..."
  }
]
```

### Process Emails
- Once emails are added, click **"Process All Emails"**
- Processing progress will be shown
- Each email takes ~2-3 seconds to process
- 500ms delay between emails to avoid rate limiting

---

## 📊 Processed Emails List

### Category Filters
Click category chips to filter:
- **All** - Show all processed emails
- **Work** - Professional/business emails
- **Personal** - Personal correspondence
- **Newsletter** - Newsletters and updates
- **Spam** - Unwanted emails
- **Financial** - Banking, payments, invoices
- **Support** - Customer support tickets
- **Announcement** - Announcements and notifications

### Search
- Type in search box to filter by sender, subject, or summary
- Real-time filtering as you type

### Email Cards
Each card shows:
- **Category Badge** - Color-coded category
- **Importance Badge** - Critical/High/Medium/Low with icon
- **Sender** - Email sender address
- **Subject** - Email subject (2 lines max)
- **Summary** - AI-generated summary (3 lines max)
- **Score Bar** - Visual importance score (0-100)

### Importance Levels
- **Critical (70-100)**: 🔴 Red badge
- **High (50-69)**: 🟠 Orange badge
- **Medium (30-49)**: 🟡 Yellow badge
- **Low (0-29)**: 🟢 Green badge

---

## 🔍 Email Detail View

### Email Information
- **From**: Sender email address
- **Subject**: Full subject line
- **Category**: Color-coded category pill
- **Tone**: Detected tone (Formal, Casual, Urgent, etc.)
- **Body**: Full email content

### Importance Score
- **Large Score Display**: Big number (e.g., 92/100)
- **Level**: Critical/High/Medium/Low
- **Color-Coded Bar**: Visual representation
- **Important Badge**: Shows if email is marked important

### AI Summary
- **Summary Text**: Concise overview of email
- **Key Points**: Bullet-point highlights
- **Action Items**: Checkboxes for tasks
- **Suggested Actions**: Quick action tags

### Reply Suggestions
Three AI-generated reply versions:

1. **Brief Reply**
   - Short and concise
   - ~2-3 sentences
   - Quick response

2. **Standard Reply** ⭐ (Recommended)
   - Balanced length
   - Professional tone
   - Most commonly used

3. **Detailed Reply**
   - Comprehensive response
   - Addresses all points
   - Formal and thorough

**Copy Buttons**: Click to copy any reply to clipboard
- Shows "Copied!" confirmation
- Paste directly into your email client

---

## 📈 Statistics Tab

View analytics across all processed emails:
- Email count by category
- Average importance scores
- Tone distribution
- Processing history

---

## 🎨 UI Components

### New Components Created
1. **InboxManager.js** (~220 lines)
   - Email input form
   - Sample email loader
   - JSON file upload
   - Email list with remove buttons
   - Batch processing trigger

2. **ProcessedEmailsList.js** (~150 lines)
   - Category filtering
   - Search functionality
   - Grid-based card layout
   - Importance badges and score bars

3. **EmailDetailView.js** (~250 lines)
   - Full email display
   - Importance score visualization
   - AI analysis (summary, key points, actions)
   - 3 reply versions with copy buttons

### CSS Styling
- **InboxManager.css**: Purple gradient theme, form styling
- **ProcessedEmailsList.css**: Green theme, card grid, badges
- **EmailDetailView.css**: Detail cards, score display, replies

---

## 🔧 Technical Details

### State Management
- `activeView`: Current view (inbox/processed/detail/stats)
- `processedEmails`: Array of processed email results
- `selectedEmail`: Currently viewed email in detail
- `processing`: Boolean for batch processing state
- `processProgress`: {current, total} for progress tracking

### API Integration
- **Single Email**: `POST /api/v1/email/process`
- **Batch Processing**: Loop through emails with 500ms delay
- **Response Format**: {success, status, data}

### Backend Processing
Each email is analyzed by 5 AI agents:
1. **Reader Agent**: Extracts key information
2. **Classifier Agent**: Categorizes email
3. **Summarizer Agent**: Creates summary
4. **Decision Agent**: Scores importance
5. **Reply Agent**: Generates 3 reply versions

---

## 🐛 Troubleshooting

### Backend Issues
```powershell
# Check if MongoDB is running
# Open Services (services.msc) → MongoDB Server → Status: Running

# Verify Gemini API key
# Check .env file: GEMINI_API_KEY=AIzaSyBvgG0MpPJg7EMNUOBRXLmTynKQiVX5Tt4

# Check Python dependencies
pip install -r requirements.txt
```

### Frontend Issues
```powershell
# Reinstall dependencies
npm install

# Clear cache
npm cache clean --force

# Check API connection
# Backend should be running on http://localhost:5000
```

### Common Errors
- **"Processing failed"**: Check backend terminal for errors
- **Empty processed list**: Ensure backend returned success: true
- **Slow processing**: Normal - each email takes 2-3 seconds
- **Rate limiting**: 500ms delay between emails built-in

---

## 💡 Tips & Best Practices

### For Best Results
1. **Email Quality**: Provide realistic email content
2. **Batch Size**: Process 5-10 emails at a time for optimal performance
3. **Categories**: Use diverse email types for better categorization
4. **Monitoring**: Watch backend terminal for processing logs

### Sample Email Types to Test
- ✅ Urgent work requests
- ✅ Personal invitations
- ✅ Newsletter subscriptions
- ✅ Financial notifications
- ✅ Customer support tickets
- ✅ Spam/promotional emails
- ✅ Announcements

### Reply Selection
- **Brief**: Quick acknowledgments, simple questions
- **Standard**: Most professional correspondence
- **Detailed**: Complex topics, formal responses

---

## 📱 Responsive Design

The UI is fully responsive:
- **Desktop (1024px+)**: 3-column grid for processed emails
- **Tablet (768-1024px)**: 2-column grid
- **Mobile (<768px)**: Single column, stacked layout

---

## 🎯 Next Steps

1. ✅ Load sample emails to test the system
2. ✅ Process emails and view categorization
3. ✅ Explore detail view and copy replies
4. ✅ Try manual email input
5. ✅ Upload custom JSON file with your emails
6. ✅ Check statistics for insights

---

## 📝 Notes

- **AI Model**: Google Gemini 2.0 Flash
- **Processing Time**: ~2-3 seconds per email
- **Categories**: 7 predefined categories
- **Importance Levels**: 4 levels (Critical/High/Medium/Low)
- **Reply Versions**: 3 variations (Brief/Standard/Detailed)

---

## 🚀 Enjoy Your AI Email Assistant!

The new batch processing interface makes managing multiple emails efficient and intuitive. Load samples, process, and see AI-powered categorization and replies in action!
