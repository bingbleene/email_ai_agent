# 🏗️ Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Email Assistant                        │
│                    Multi-Agent System                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      User / Client                           │
│                   (Frontend / API)                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Flask REST API                            │
│                  (app.py / routes)                           │
├─────────────────────────────────────────────────────────────┤
│  Endpoints:                                                  │
│  • POST /api/v1/email/process                               │
│  • GET  /api/v1/emails                                       │
│  • GET  /api/v1/stats                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              📧 EmailCoordinator                             │
│              (Main Orchestrator Agent)                       │
└────────┬────────┬────────┬────────┬──────────┬──────────────┘
         │        │        │        │          │
    ┌────▼───┐ ┌─▼──┐  ┌──▼───┐ ┌──▼────┐ ┌──▼─────┐
    │ Reader │ │Class│  │Summa-│ │Decision│ │ Reply  │
    │ Agent  │ │ifier│  │rizer │ │ Agent  │ │ Agent  │
    └────┬───┘ └─┬──┘  └──┬───┘ └──┬────┘ └──┬─────┘
         │       │        │        │          │
         └───────┴────────┴────────┴──────────┘
                     │
        ┌────────────┴─────────────┐
        │                          │
    ┌───▼─────┐             ┌──────▼──────┐
    │  Tools  │             │   OpenAI    │
    │  ├─EmailParser       │   API       │
    │  ├─ImportanceScorer  │  (gpt-4o)   │
    │  └─ToneAnalyzer      │             │
    └─────────┘             └──────┬──────┘
                                   │
                            ┌──────▼──────┐
                            │   MongoDB   │
                            │  Database   │
                            └─────────────┘
```

## Agent Flow Diagram

```
Raw Email Input
    ↓
┌───────────────────────────────────────┐
│ 1️⃣ ReaderAgent                        │
│ ─────────────────────────────────────│
│ • Parse email structure               │
│ • Extract sender, subject, body       │
│ • Clean and normalize text            │
│ • Extract metadata (links, phones)    │
│                                       │
│ Tools: EmailParser                    │
└─────────────┬─────────────────────────┘
              ↓
┌───────────────────────────────────────┐
│ 2️⃣ ClassifierAgent                    │
│ ─────────────────────────────────────│
│ • Analyze content                     │
│ • Classify into category              │
│   (Work/Personal/Spam/etc)            │
│ • Calculate confidence                │
│                                       │
│ AI: OpenAI GPT-4o-mini                │
└─────────────┬─────────────────────────┘
              ↓
┌───────────────────────────────────────┐
│ 3️⃣ SummarizerAgent                    │
│ ─────────────────────────────────────│
│ • Create 1-2 sentence summary         │
│ • Extract key points                  │
│ • Identify action items               │
│                                       │
│ AI: OpenAI GPT-4o-mini                │
└─────────────┬─────────────────────────┘
              ↓
┌───────────────────────────────────────┐
│ 4️⃣ DecisionAgent                      │
│ ─────────────────────────────────────│
│ • Calculate importance score (0-100)  │
│ • Analyze tone (formal/casual/urgent) │
│ • Suggest actions:                    │
│   - highlight, delete, reply, etc     │
│                                       │
│ Tools: ImportanceScorer, ToneAnalyzer │
└─────────────┬─────────────────────────┘
              ↓
┌───────────────────────────────────────┐
│ 5️⃣ ReplyAgent (Optional)              │
│ ─────────────────────────────────────│
│ • Check if reply needed               │
│ • Generate 3 reply versions:          │
│   - Brief (1-2 sentences)             │
│   - Standard (3-4 sentences)          │
│   - Detailed (5-6 sentences)          │
│ • Match tone to original email        │
│                                       │
│ AI: OpenAI GPT-4o-mini                │
└─────────────┬─────────────────────────┘
              ↓
┌───────────────────────────────────────┐
│ 💾 Save to MongoDB                    │
│ ─────────────────────────────────────│
│ Collections:                          │
│ • users: User information             │
│ • emails: Processed emails            │
└─────────────┬─────────────────────────┘
              ↓
    Processed Email Output
```

## Data Flow

### Input (Raw Email)
```json
{
  "user_id": "user123",
  "sender": "boss@company.com",
  "subject": "URGENT: Project Deadline",
  "body": "We need to finish this ASAP..."
}
```

### After ReaderAgent
```json
{
  "parsed_email": {
    "sender": {
      "name": "Boss",
      "email": "boss@company.com"
    },
    "subject": "Project Deadline",
    "body": "We need to finish this ASAP...",
    "metadata": {
      "has_links": false,
      "has_question": false,
      "word_count": 25
    }
  }
}
```

### After ClassifierAgent
```json
{
  "category": "Work",
  "confidence": 0.95,
  "reasoning": "Contains work-related keywords and business email address"
}
```

### After SummarizerAgent
```json
{
  "summary": "Boss requests urgent completion of project ASAP.",
  "key_points": ["Project deadline", "Urgent completion needed"],
  "action_items": ["Complete project", "Respond to boss"]
}
```

### After DecisionAgent
```json
{
  "is_important": true,
  "importance_score": 85,
  "importance_level": "Critical",
  "tone": "urgent",
  "formality": "formal",
  "suggested_actions": ["reply_asap", "highlight", "flag", "calendar_reminder"]
}
```

### After ReplyAgent
```json
{
  "suggested_reply": {
    "brief": "Understood. I'll prioritize this.",
    "standard": "Thank you for the reminder. I'll make this my top priority...",
    "detailed": "Dear [Boss Name], Thank you for the update on the project deadline..."
  }
}
```

### Final Output (Stored in MongoDB)
```json
{
  "email_id": "67890abc",
  "user_id": "user123",
  "sender": "boss@company.com",
  "subject": "URGENT: Project Deadline",
  "body": "We need to finish this ASAP...",
  "category": "Work",
  "summary": "Boss requests urgent completion of project ASAP.",
  "key_points": ["Project deadline", "Urgent completion needed"],
  "action_items": ["Complete project", "Respond to boss"],
  "is_important": true,
  "importance_score": 85,
  "tone": "urgent",
  "suggested_actions": ["reply_asap", "highlight", "flag"],
  "suggested_reply": {...},
  "created_at": "2025-10-19T10:00:00Z"
}
```

## Technology Stack

### Backend
- **Framework**: Flask 3.0
- **AI**: OpenAI API (gpt-4o-mini)
- **Database**: MongoDB
- **Rate Limiting**: Flask-Limiter + Redis (optional)
- **CORS**: Flask-CORS

### AI Components
- **LLM**: GPT-4o-mini for classification, summarization, reply generation
- **NLP Tools**: Custom EmailParser, ToneAnalyzer, ImportanceScorer

### Database Schema

**users collection:**
```javascript
{
  _id: ObjectId,
  user_id: String (unique),
  created_at: DateTime,
  last_active: DateTime
}
```

**emails collection:**
```javascript
{
  _id: ObjectId,
  email_id: String (unique),
  user_id: String (indexed),
  sender: String,
  subject: String,
  body: String,
  received_date: DateTime,
  category: String (indexed),
  summary: String,
  key_points: Array<String>,
  action_items: Array<String>,
  is_important: Boolean (indexed),
  importance_score: Number,
  tone: String,
  suggested_actions: Array<String>,
  suggested_reply: Object,
  created_at: DateTime (indexed),
  updated_at: DateTime
}
```

## Security Considerations

1. **API Key Protection**
   - OpenAI key in environment variables
   - Never commit .env to git

2. **Rate Limiting**
   - 10 emails/minute per user
   - 100 emails/day per user
   - Prevent API abuse

3. **Input Validation**
   - Email format validation
   - Content sanitization
   - SQL injection prevention (MongoDB)

4. **User Isolation**
   - Each user can only access their emails
   - user_id validation on all queries

## Performance Optimization

1. **Database Indexing**
   - user_id + created_at
   - category
   - is_important

2. **Caching** (Future)
   - Redis for rate limiting
   - Cache frequent queries

3. **Batch Processing**
   - Process up to 10 emails at once
   - Async processing (future enhancement)

## Scalability

Current: Single server
- Handles ~1000 emails/day
- ~10 concurrent users

Future enhancements:
- Load balancing
- Message queue (Celery)
- Distributed caching
- Microservices architecture

---

**Last Updated**: October 2025
