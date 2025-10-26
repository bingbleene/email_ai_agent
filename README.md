# AI Email Assistant 📧🤖

**Hệ thống AI Agent thông minh xử lý và tóm tắt email**

## 🎯 Tính năng

- ✅ **Tự động phân loại email** (Work, Personal, Spam, Newsletter, etc.)
- 📝 **Tóm tắt nội dung** ngắn gọn với key points
- ⚠️ **Đánh dấu email quan trọng** dựa trên importance scoring
- 💬 **Gợi ý phản hồi** phù hợp với tone và ngữ cảnh
- 🎨 **Phân tích tone** (formal, casual, urgent, apologetic, etc.)
- 🔍 **Trích xuất action items** từ email
- 📊 **Thống kê email** theo category và importance

## 🏗️ Kiến trúc Multi-Agent

```
EmailCoordinator (Main Orchestrator)
├── ReaderAgent: Parse email structure
├── ClassifierAgent: Phân loại (Work/Personal/Spam/...)
├── SummarizerAgent: Tóm tắt nội dung
├── DecisionAgent: Quyết định actions (highlight/delete/reply)
└── ReplyAgent: Tạo gợi ý phản hồi
```

## 📦 Công nghệ sử dụng

**Backend:**
- Python 3.10+
- Flask (REST API)
- OpenAI API (gpt-4o-mini)
- MongoDB (Database)
- Flask-Limiter (Rate limiting)

**AI Tools:**
- EmailParser: Parse email structure
- ImportanceScorer: Tính điểm quan trọng
- ToneAnalyzer: Phân tích tone

## 🚀 Cài đặt

### 1. Prerequisites

- Python 3.10 hoặc cao hơn
- MongoDB (local hoặc MongoDB Atlas)
- OpenAI API key

### 2. Backend Setup

```bash
cd backend

# Tạo virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Tạo file .env từ template
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux

# Sửa file .env và thêm OpenAI API key
```

### 3. Cấu hình .env

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=email_assistant
PORT=5000
```

### 4. Chạy Backend

```bash
python run.py
```

Backend sẽ chạy tại: `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /api/v1/health
```

### Process Single Email
```
POST /api/v1/email/process
Content-Type: application/json

{
  "user_id": "user123",
  "sender": "john@example.com",
  "subject": "Meeting tomorrow",
  "body": "Hi, let's meet tomorrow at 10am to discuss the project."
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "success": true,
    "email_id": "67890abc",
    "category": "Work",
    "summary": "Meeting request for tomorrow at 10am to discuss project.",
    "key_points": ["Meeting tomorrow", "10am", "Project discussion"],
    "action_items": ["Confirm meeting time", "Prepare project materials"],
    "is_important": true,
    "importance_score": 75,
    "importance_level": "High",
    "tone": "formal",
    "suggested_actions": ["needs_reply", "calendar_reminder"],
    "suggested_reply": {
      "brief": "Thanks! I'll be there at 10am.",
      "standard": "Hi John, thank you for the invitation...",
      "detailed": "Dear John, I appreciate the meeting request..."
    }
  }
}
```

### Get All Emails
```
GET /api/v1/emails?user_id=user123&category=Work&is_important=true
```

### Get Email Statistics
```
GET /api/v1/stats?user_id=user123
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "total": 150,
    "important": 25,
    "by_category": {
      "Work": 80,
      "Personal": 40,
      "Newsletter": 20,
      "Spam": 10
    }
  }
}
```

## 🧪 Test API với cURL

```bash
# Health check
curl http://localhost:5000/api/v1/health

# Process email
curl -X POST http://localhost:5000/api/v1/email/process \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "sender": "boss@company.com",
    "subject": "URGENT: Project deadline",
    "body": "We need to finish this ASAP. Meeting tomorrow at 9am."
  }'

# Get emails
curl "http://localhost:5000/api/v1/emails?user_id=test_user"

# Get stats
curl "http://localhost:5000/api/v1/stats?user_id=test_user"
```

## 🎨 Ví dụ Flow xử lý

```
Input Email:
  From: boss@company.com
  Subject: URGENT: Budget Approval Needed
  Body: Please review and approve the Q4 budget by end of day.

Processing Flow:
1. ReaderAgent → Parse: sender, subject, body
2. ClassifierAgent → Category: "Work" (confidence: 0.95)
3. SummarizerAgent → Summary: "Boss requests Q4 budget approval by EOD"
4. DecisionAgent → 
   - Important: YES (score: 85/100)
   - Tone: urgent + formal
   - Actions: [reply_asap, highlight, flag]
5. ReplyAgent → Generate reply suggestions

Output:
  Category: Work
  Important: Yes (Critical - 85/100)
  Summary: Boss requests Q4 budget approval by EOD
  Actions: Reply ASAP, Highlight, Add to calendar
  Suggested Reply: "I will review and respond within 2 hours..."
```

## 📊 Email Categories

- **Work**: Công việc, meetings, projects
- **Personal**: Bạn bè, gia đình
- **Spam**: Quảng cáo, unwanted
- **Newsletter**: Bản tin, subscriptions
- **Announcement**: Thông báo quan trọng
- **Support**: Customer support, help requests
- **Financial**: Hóa đơn, thanh toán

## 🛠️ Importance Scoring System

Score tính dựa trên:
- Category weight (0-30 points)
- Sender importance (0-25 points)
- Subject keywords (0-20 points)
- Body content (0-15 points)
- Metadata (0-10 points)

**Levels:**
- **Critical**: 70-100 points
- **High**: 50-69 points
- **Medium**: 30-49 points
- **Low**: 0-29 points

## 🎭 Tone Detection

**Supported tones:**
- Formal (professional, business)
- Casual (friendly, informal)
- Urgent (time-sensitive)
- Grateful (expressing thanks)
- Apologetic (expressing sorry)
- Inquisitive (asking questions)
- Positive/Negative sentiment

## 🔧 Troubleshooting

**Error: "OPENAI_API_KEY not found"**
```bash
# Đảm bảo file .env có API key
OPENAI_API_KEY=sk-your-key-here
```

**Error: "MongoDB connection failed"**
```bash
# Kiểm tra MongoDB đang chạy
# Windows: check Services
# macOS: brew services list
# Linux: sudo systemctl status mongod

# Hoặc dùng MongoDB Atlas (cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

**Error: "Rate limit exceeded"**
- Đợi vài phút và thử lại
- Hoặc tắt rate limiting trong development

## 📝 TODO / Future Improvements

- [ ] Frontend React UI
- [ ] Gmail API integration
- [ ] Email threading support
- [ ] Smart folder organization
- [ ] Email scheduling
- [ ] Template management
- [ ] Multi-language support
- [ ] Attachment analysis
- [ ] Spam filtering ML model

## 👨‍💻 Developer

Developed as a Multi-Agent AI System project

## 📄 License

MIT License

---

**Happy Email Processing! 📧✨**
