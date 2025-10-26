# AI Email Assistant - Project Overview

**A sophisticated multi-agent AI system for intelligent email processing, classification, and response generation.**

## 🎯 Project Vision

The AI Email Assistant is a full-stack application that leverages OpenAI's GPT-4o-mini and a multi-agent architecture to transform how users interact with emails. It automatically categorizes, summarizes, scores importance, and generates contextual replies for incoming emails.

## 📋 Table of Contents

1. [Key Features](#key-features)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [AI Agents System](#ai-agents-system)
6. [API Endpoints](#api-endpoints)
7. [Data Flow](#data-flow)
8. [Getting Started](#getting-started)
9. [Configuration](#configuration)
10. [Screenshots & Examples](#screenshots--examples)

---

## 🌟 Key Features

### Backend Intelligence
- **7 Email Categories**: Work, Personal, Spam, Newsletter, Announcement, Support, Financial
- **0-100 Importance Scoring**: Multi-factor algorithm analyzing category, sender, subject, body, metadata
- **Smart Summarization**: Extract key points and action items automatically
- **Tone Analysis**: Detect formality, urgency, sentiment, gratitude, apologetic tones
- **Reply Generation**: Create 3 versions (brief, standard, detailed) with appropriate tone
- **Batch Processing**: Handle multiple emails in one request
- **MongoDB Storage**: Track and query processed emails
- **Rate Limiting**: Prevent API abuse (10 req/min processing, 100 req/day)

### Frontend Experience
- **Responsive Design**: Works on desktop, tablet, mobile
- **Real-time Processing**: Live feedback during AI analysis
- **Sample Templates**: Pre-loaded urgent, personal, and newsletter emails
- **Advanced Filtering**: Search, category filter, importance filter
- **Statistics Dashboard**: Visual analytics with charts
- **Copy-to-Clipboard**: Easy reply copying
- **Health Monitoring**: Backend status indicator
- **User Session Management**: Persistent user ID across sessions

---

## 🏗 Architecture Overview

### Multi-Agent System

The application uses a **coordinated multi-agent architecture** where specialized AI agents work together:

```
Email Input
    ↓
EmailCoordinator (Orchestrator)
    ↓
┌─────────────┬──────────────┬───────────────┬──────────────┬─────────────┐
│ ReaderAgent │ ClassifierA. │ SummarizerA.  │ DecisionA.   │ ReplyAgent  │
└─────────────┴──────────────┴───────────────┴──────────────┴─────────────┘
    ↓                ↓                ↓               ↓              ↓
Parse Email    Categorize       Summarize      Score Import.   Generate
  Metadata      (7 types)       Key Points     (0-100 pts)     3 Replies
    ↓                ↓                ↓               ↓              ↓
    └────────────────┴────────────────┴───────────────┴──────────────┘
                                    ↓
                            MongoDB Storage
                                    ↓
                            JSON Response
```

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│  - EmailForm         - EmailResult      - EmailList        │
│  - Statistics        - API Service      - UI Styles         │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/JSON
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (Flask)                         │
│  - REST API          - 5 AI Agents      - 3 Tools           │
│  - EmailCoordinator  - Rate Limiter     - Error Handler     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────┬───────────────────────┬───────────────────────┐
│  MongoDB    │    OpenAI API         │    In-Memory Cache    │
│  (Storage)  │    (AI Models)        │    (Rate Limiting)    │
└─────────────┴───────────────────────┴───────────────────────┘
```

---

## 💻 Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.8+ | Core language |
| **Flask** | 3.0.0 | Web framework |
| **OpenAI API** | 1.12.0 | AI model integration (GPT-4o-mini) |
| **PyMongo** | 4.6.1 | MongoDB driver |
| **Flask-CORS** | 4.0.0 | Cross-origin requests |
| **Flask-Limiter** | 3.5.0 | Rate limiting |
| **python-dotenv** | 1.0.0 | Environment management |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **Axios** | 1.6.0 | HTTP client |
| **Lucide React** | 0.263.1 | Icon library |
| **React Scripts** | 5.0.1 | Build tooling |
| **CSS3** | - | Styling |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **MongoDB** | Document database for email storage |
| **OpenAI API** | GPT-4o-mini for AI capabilities |
| **Local/Cloud** | Deployment options |

---

## 📁 Project Structure

```
my_ai_agent/
├── backend/                        # Python Flask backend
│   ├── agents/                     # AI Agent modules
│   │   ├── __init__.py
│   │   ├── base_agent.py          # Abstract base agent class
│   │   ├── email_coordinator.py   # Main orchestrator (200+ lines)
│   │   ├── reader_agent.py        # Email parsing agent
│   │   ├── classifier_agent.py    # Category classification
│   │   ├── summarizer_agent.py    # Summary generation
│   │   ├── decision_agent.py      # Importance scoring
│   │   └── reply_agent.py         # Reply generation
│   │
│   ├── tools/                      # Utility tools for agents
│   │   ├── __init__.py
│   │   ├── base_tool.py           # Abstract tool class
│   │   ├── email_parser.py        # Parse email metadata
│   │   ├── importance_scorer.py   # Calculate importance score
│   │   └── tone_analyzer.py       # Analyze email tone
│   │
│   ├── utils/                      # Helper utilities
│   │   ├── __init__.py
│   │   ├── openai_client.py       # OpenAI API wrapper
│   │   ├── db.py                  # MongoDB operations
│   │   ├── errors.py              # Custom exceptions
│   │   ├── rate_limiter.py        # Rate limiting setup
│   │   └── json_encoder.py        # JSON serialization
│   │
│   ├── data/                       # Configuration data
│   │   ├── email_categories.json  # Category definitions + keywords
│   │   └── tone_templates.json    # Reply templates by tone
│   │
│   ├── app.py                      # Flask application (8 endpoints)
│   ├── run.py                      # Development server entry
│   ├── requirements.txt            # Python dependencies
│   ├── test_api.py                 # API test script
│   ├── .env                        # Environment variables
│   ├── .env.example                # Environment template
│   ├── README.md                   # Backend documentation
│   ├── QUICKSTART.md               # 5-minute setup guide
│   └── ARCHITECTURE.md             # System architecture docs
│
├── frontend/                       # React frontend
│   ├── public/
│   │   └── index.html              # HTML template
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmailForm.js       # Email input form (150+ lines)
│   │   │   ├── EmailResult.js     # AI results display (250+ lines)
│   │   │   ├── EmailList.js       # Email list view (200+ lines)
│   │   │   └── Statistics.js      # Analytics dashboard (120+ lines)
│   │   │
│   │   ├── services/
│   │   │   └── api.js             # API client with axios (160+ lines)
│   │   │
│   │   ├── styles/
│   │   │   ├── App.css            # Main app styles
│   │   │   ├── EmailForm.css      # Form component styles
│   │   │   ├── EmailResult.css    # Result display styles
│   │   │   ├── EmailList.css      # List view styles
│   │   │   └── Statistics.css     # Stats dashboard styles
│   │   │
│   │   ├── App.js                 # Main React component
│   │   └── index.js               # React entry point
│   │
│   ├── package.json                # Node dependencies
│   ├── .env                        # Frontend environment
│   ├── .gitignore                  # Git ignore rules
│   └── README.md                   # Frontend documentation
│
├── SETUP_GUIDE.md                  # Complete setup instructions
└── PROJECT_OVERVIEW.md             # This file

Total: 40+ files, 3500+ lines of code
```

---

## 🤖 AI Agents System

### 1. EmailCoordinator (Orchestrator)
**Role**: Manages the entire email processing pipeline

**Responsibilities**:
- Coordinate all 5 specialist agents
- Handle errors and fallbacks
- Save results to MongoDB
- Generate comprehensive JSON response
- Verbose logging for debugging

**Tools Used**: None (manages other agents)

**Output**: Complete email analysis object

---

### 2. ReaderAgent
**Role**: Parse and extract email metadata

**Responsibilities**:
- Clean subject and body text
- Extract sender information
- Count words and links
- Extract phone numbers
- Generate metadata

**Tools Used**: `EmailParser`

**Output**:
```json
{
  "sender": "john@example.com",
  "subject": "Project Update",
  "body": "Cleaned email content...",
  "word_count": 150,
  "has_links": true,
  "has_phone": false
}
```

---

### 3. ClassifierAgent
**Role**: Categorize email into 7 types

**Responsibilities**:
- Use OpenAI to classify email
- Fallback to keyword matching
- Confidence scoring
- Handle edge cases

**Tools Used**: OpenAI GPT-4o-mini

**Output**:
```json
{
  "category": "Work",
  "confidence": 0.95
}
```

**Categories**:
- **Work**: Business, meetings, projects
- **Personal**: Family, friends, informal
- **Spam**: Advertising, phishing, junk
- **Newsletter**: Subscriptions, updates
- **Announcement**: Public notices
- **Support**: Customer service, help
- **Financial**: Bills, invoices, banking

---

### 4. SummarizerAgent
**Role**: Generate concise summary with key points

**Responsibilities**:
- Create 2-3 sentence summary
- Extract 3-5 key points
- Identify action items
- Handle long emails (truncate if needed)

**Tools Used**: OpenAI GPT-4o-mini

**Output**:
```json
{
  "summary": "Brief description of email...",
  "key_points": [
    "Point 1",
    "Point 2",
    "Point 3"
  ],
  "action_items": [
    "Action 1",
    "Action 2"
  ]
}
```

---

### 5. DecisionAgent
**Role**: Score importance and suggest actions

**Responsibilities**:
- Calculate 0-100 importance score
- Analyze email tone
- Suggest appropriate actions
- Determine if reply needed

**Tools Used**: `ImportanceScorer`, `ToneAnalyzer`

**Importance Scoring Algorithm**:
```python
Total Score (0-100):
├─ Category Weight: 30 points
│  ├─ Work/Support: 30 pts
│  ├─ Personal: 20 pts
│  ├─ Financial: 25 pts
│  ├─ Announcement: 15 pts
│  └─ Others: 5-10 pts
│
├─ Sender Weight: 25 points
│  ├─ Known important: 25 pts
│  └─ Unknown: 10 pts
│
├─ Subject Weight: 20 points
│  ├─ Urgent keywords: 20 pts
│  ├─ Action keywords: 15 pts
│  └─ Normal: 10 pts
│
├─ Body Weight: 15 points
│  ├─ Has action items: 15 pts
│  ├─ Has questions: 12 pts
│  └─ Normal: 8 pts
│
└─ Metadata Weight: 10 points
   ├─ Has phone: +5 pts
   ├─ Has links: +3 pts
   └─ Word count: +2 pts
```

**Tone Analysis**:
- Formal vs Casual
- Urgent vs Relaxed
- Positive vs Negative sentiment
- Grateful, Apologetic indicators

**Output**:
```json
{
  "importance_score": 75,
  "is_important": true,
  "tone": "formal",
  "suggested_action": ["reply", "flag", "calendar"]
}
```

---

### 6. ReplyAgent
**Role**: Generate suggested email replies

**Responsibilities**:
- Create 3 reply versions (brief, standard, detailed)
- Match original email tone
- Include appropriate greeting/closing
- Handle different email types

**Tools Used**: OpenAI GPT-4o-mini

**Reply Versions**:
1. **Brief** (50-100 words): Quick acknowledgment
2. **Standard** (100-200 words): Professional response
3. **Detailed** (200-300 words): Comprehensive reply

**Output**:
```json
{
  "suggested_reply": {
    "brief": "Short reply...",
    "standard": "Standard reply...",
    "detailed": "Detailed reply..."
  }
}
```

---

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| GET | `/` | Welcome message | - |
| GET | `/health` | System health check | - |
| POST | `/email/process` | Process single email | 10/min |
| POST | `/email/batch` | Process multiple emails | 10/min |
| GET | `/emails?user_id=<id>` | Get user's emails | 20/min |
| GET | `/emails/<email_id>?user_id=<id>` | Get specific email | 20/min |
| DELETE | `/emails/<email_id>?user_id=<id>` | Delete email | 10/min |
| GET | `/stats?user_id=<id>` | Get email statistics | 20/min |

### Example Request:

```bash
curl -X POST http://localhost:5000/api/v1/email/process \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "sender": "manager@company.com",
    "subject": "Urgent: Project Deadline",
    "body": "We need to discuss the project timeline..."
  }'
```

### Example Response:

```json
{
  "success": true,
  "data": {
    "email_id": "email_1234567890",
    "user_id": "user_123",
    "sender": "manager@company.com",
    "subject": "Urgent: Project Deadline",
    "category": "Work",
    "importance_score": 85,
    "is_important": true,
    "summary": "Manager requests urgent discussion about project timeline...",
    "key_points": [
      "Project deadline approaching",
      "Team meeting needed",
      "Action items required"
    ],
    "action_items": [
      "Schedule meeting",
      "Review timeline"
    ],
    "tone": "formal",
    "suggested_action": ["reply", "flag", "calendar"],
    "suggested_reply": {
      "brief": "I'll review the timeline and schedule a meeting...",
      "standard": "Thank you for bringing this to my attention...",
      "detailed": "Dear [Manager], I appreciate your concern..."
    },
    "processed_at": "2024-01-15T10:30:00"
  }
}
```

---

## 🔄 Data Flow

### Complete Processing Pipeline:

```
1. USER SUBMITS EMAIL
   └─> Frontend EmailForm component
       └─> Validation & sanitization
           └─> POST /api/v1/email/process

2. BACKEND RECEIVES REQUEST
   └─> Flask app.py endpoint
       └─> Rate limiter check (10/min)
           └─> EmailCoordinator.process()

3. AI AGENT ORCHESTRATION
   └─> ReaderAgent
       ├─> EmailParser tool
       └─> Extract metadata
   
   └─> ClassifierAgent
       ├─> OpenAI API call
       ├─> Keyword fallback
       └─> Return category
   
   └─> SummarizerAgent
       ├─> OpenAI API call
       └─> Extract key points
   
   └─> DecisionAgent
       ├─> ImportanceScorer tool (5 factors)
       ├─> ToneAnalyzer tool
       └─> Calculate score 0-100
   
   └─> ReplyAgent
       ├─> OpenAI API call
       └─> Generate 3 versions

4. DATABASE STORAGE
   └─> MongoDB.save_email()
       ├─> Create indexes (user_id, category, is_important)
       └─> Return email_id

5. RESPONSE GENERATION
   └─> JSON serialization
       └─> Return to frontend

6. FRONTEND DISPLAY
   └─> EmailResult component
       ├─> Category badges
       ├─> Importance meter
       ├─> Summary display
       ├─> Key points list
       ├─> Action items
       └─> Reply suggestions

7. USER ACTIONS
   ├─> Copy reply to clipboard
   ├─> View in email list
   └─> Check statistics
```

---

## 🚀 Getting Started

### Fastest Way (< 5 minutes):

1. **Clone/Navigate to project**:
   ```powershell
   cd d:\DownloadLT\UIT\jib\my_ai_agent
   ```

2. **Backend setup**:
   ```powershell
   cd backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

3. **Configure .env**:
   ```env
   OPENAI_API_KEY=your_key_here
   ```

4. **Start backend**:
   ```powershell
   python run.py
   ```

5. **Frontend setup** (new terminal):
   ```powershell
   cd frontend
   npm install
   npm start
   ```

6. **Open browser**: http://localhost:3000

### Detailed Setup:
See `SETUP_GUIDE.md` for comprehensive instructions.

---

## ⚙️ Configuration

### Backend Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...                          # Your OpenAI API key

# Optional - MongoDB
MONGODB_URI=mongodb://localhost:27017/         # MongoDB connection
MONGODB_DB=email_assistant                     # Database name

# Optional - Development
FLASK_ENV=development                          # Environment mode
DEBUG=True                                     # Debug logging
PORT=5000                                      # Server port
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### Customization Options

**Add Custom Categories**:
Edit `backend/data/email_categories.json`:
```json
{
  "YourCategory": {
    "keywords": ["keyword1", "keyword2"],
    "description": "Description here"
  }
}
```

**Adjust Importance Weights**:
Edit `backend/tools/importance_scorer.py`:
```python
self.category_weight = 30  # Change weights
self.sender_weight = 25
# ... etc
```

**Modify Reply Templates**:
Edit `backend/data/tone_templates.json`:
```json
{
  "your_tone": {
    "greeting": "Hello,",
    "closing": "Best regards,",
    "style": "description"
  }
}
```

---

## 📸 Screenshots & Examples

### Example 1: Urgent Work Email

**Input**:
```
From: boss@company.com
Subject: URGENT: Client Meeting Tomorrow
Body: We have an important client meeting tomorrow at 9 AM.
Please prepare the presentation slides and financial reports.
This is critical for closing the deal.
```

**AI Analysis**:
- **Category**: Work
- **Importance**: 88/100 (Critical)
- **Tone**: Formal, Urgent
- **Key Points**:
  - Client meeting scheduled for tomorrow 9 AM
  - Presentation slides needed
  - Financial reports required
- **Action Items**:
  - Prepare presentation slides
  - Compile financial reports
- **Suggested Actions**: reply, flag, calendar

**Generated Reply (Standard)**:
```
Dear [Boss],

Thank you for the heads up regarding tomorrow's client meeting.
I will ensure the presentation slides and financial reports are
ready before 9 AM. I understand the importance of this meeting
for closing the deal.

Is there any specific data or format you'd like me to focus on
for the financial reports?

Best regards,
[Your Name]
```

---

### Example 2: Personal Friend Email

**Input**:
```
From: friend@gmail.com
Subject: Weekend Plans?
Body: Hey! Want to grab coffee this weekend? I found a new
cafe downtown that has amazing pastries. Let me know if you're free!
```

**AI Analysis**:
- **Category**: Personal
- **Importance**: 42/100 (Medium)
- **Tone**: Casual, Friendly
- **Key Points**:
  - Invitation for weekend coffee
  - New cafe downtown
  - Has great pastries
- **Action Items**:
  - Check weekend schedule
  - Respond with availability

**Generated Reply (Brief)**:
```
Hey! That sounds great! I'm free on Saturday afternoon.
What time works for you? 😊
```

---

### Example 3: Newsletter

**Input**:
```
From: newsletter@techblog.com
Subject: Weekly Tech Updates - January 2024
Body: This week in tech: New AI releases, smartphone updates,
and software development trends. Click here to read more...
[Unsubscribe]
```

**AI Analysis**:
- **Category**: Newsletter
- **Importance**: 18/100 (Low)
- **Tone**: Promotional, Informative
- **Key Points**:
  - Weekly technology updates
  - AI releases covered
  - Software development trends
- **Suggested Actions**: read, archive

---

## 📊 Performance Metrics

### Processing Time
- **Average**: 3-5 seconds per email
- **Breakdown**:
  - Email parsing: <0.1s
  - Classification: 0.8-1.2s
  - Summarization: 1-2s
  - Importance scoring: 0.2-0.5s
  - Reply generation: 1-2s

### API Usage
- **OpenAI API Calls**: 3 per email
  - Classification: 1 call
  - Summarization: 1 call
  - Reply generation: 1 call

- **Estimated Costs** (GPT-4o-mini):
  - Per email: $0.0015 - $0.003
  - Per 1000 emails: $1.50 - $3.00

### Rate Limits
- **Processing**: 10 requests/minute
- **Queries**: 20 requests/minute
- **Daily**: 100 processing requests

---

## 🎓 Learning Resources

### For Developers

**Understanding Multi-Agent Systems**:
- Read `backend/ARCHITECTURE.md` for detailed diagrams
- Study `email_coordinator.py` for orchestration patterns
- Explore `base_agent.py` for agent abstraction

**OpenAI Integration**:
- Review `openai_client.py` for API wrapper
- See prompt engineering in `classifier_agent.py`
- Check JSON parsing in `summarizer_agent.py`

**React Best Practices**:
- Study component structure in `src/components/`
- Learn API integration from `services/api.js`
- Explore state management in `App.js`

---

## 🔒 Security Considerations

### Current Implementation
- ✅ API key in environment variables
- ✅ Input validation and sanitization
- ✅ Rate limiting enabled
- ✅ CORS configured
- ✅ Error handling without sensitive data exposure

### Production Recommendations
- 🔐 Add user authentication (JWT tokens)
- 🔐 Implement API key rotation
- 🔐 Use HTTPS/SSL certificates
- 🔐 Add request signing
- 🔐 Enable MongoDB authentication
- 🔐 Set up proper firewall rules
- 🔐 Add logging and monitoring
- 🔐 Implement email content encryption

---

## 🚀 Deployment Options

### Backend
- **Heroku**: Easy deployment with Procfile
- **AWS EC2**: Full control, scalable
- **Google Cloud Run**: Serverless, auto-scaling
- **DigitalOcean**: Simple VPS hosting
- **Railway**: Modern platform, quick setup

### Frontend
- **Vercel**: Optimized for React, free tier
- **Netlify**: Continuous deployment
- **GitHub Pages**: Free static hosting
- **AWS S3 + CloudFront**: Enterprise-grade CDN
- **Firebase Hosting**: Google's platform

### Database
- **MongoDB Atlas**: Cloud-hosted, free tier available
- **Self-hosted MongoDB**: Full control
- **DocumentDB (AWS)**: MongoDB-compatible

---

## 📈 Future Enhancements

### Planned Features
- [ ] Email threading and conversation tracking
- [ ] Attachment handling (PDF, images)
- [ ] Calendar integration for meeting scheduling
- [ ] Email templates library
- [ ] Multi-language support
- [ ] Voice-to-email transcription
- [ ] Priority inbox with auto-sorting
- [ ] Smart notifications
- [ ] Email scheduling
- [ ] Team collaboration features

### AI Improvements
- [ ] Fine-tuned models for specific industries
- [ ] Sentiment analysis visualization
- [ ] Personality-based reply customization
- [ ] Email writing style learning
- [ ] Spam detection enhancement
- [ ] Phishing detection

---

## 🤝 Contributing

Contributions welcome! Focus areas:
- Adding new AI agents
- Improving importance scoring algorithm
- Enhancing UI/UX
- Writing tests
- Documentation improvements
- Performance optimization

---

## 📝 License

MIT License - Feel free to use, modify, and distribute.

---

## 📞 Support

For questions or issues:
1. Check `SETUP_GUIDE.md` for common problems
2. Review `backend/README.md` for API details
3. Read `backend/ARCHITECTURE.md` for system design
4. Check `frontend/README.md` for UI guidance

---

## 🎉 Acknowledgments

- **OpenAI**: GPT-4o-mini model
- **MongoDB**: Database platform
- **React**: Frontend framework
- **Flask**: Backend framework
- **Lucide**: Icon library

---

**Built with ❤️ using AI and Modern Web Technologies**

Version: 1.0.0  
Last Updated: January 2024  
Author: AI Email Assistant Team
