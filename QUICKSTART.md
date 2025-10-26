# 🚀 Quick Start Guide

## Setup trong 5 phút!

### Bước 1: Cài đặt Dependencies

```powershell
cd backend

# Tạo virtual environment
python -m venv venv

# Activate
.\venv\Scripts\activate

# Install packages
pip install -r requirements.txt
```

### Bước 2: Cấu hình Environment

1. Mở file `.env`
2. Thêm OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

💡 **Lấy API key**: https://platform.openai.com/api-keys

### Bước 3: MongoDB Setup

**Option A: Local MongoDB**
```powershell
# Download MongoDB: https://www.mongodb.com/try/download/community
# Install và chạy MongoDB service
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
```env
# Trong file .env, thay đổi:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

💡 **Free tier**: https://www.mongodb.com/cloud/atlas/register

### Bước 4: Chạy Server

```powershell
python run.py
```

✅ Server chạy tại: `http://localhost:5000`

### Bước 5: Test!

**Option A: Dùng test script**
```powershell
# Mở terminal mới
cd backend
.\venv\Scripts\activate
python test_api.py
```

**Option B: Test bằng cURL**
```powershell
# Health check
curl http://localhost:5000/api/v1/health

# Process email
curl -X POST http://localhost:5000/api/v1/email/process `
  -H "Content-Type: application/json" `
  -d '{\"user_id\":\"test\",\"sender\":\"boss@company.com\",\"subject\":\"URGENT: Meeting\",\"body\":\"We need to meet ASAP.\"}'
```

**Option C: Test bằng Postman**
1. Import collection: `backend/postman_collection.json` (nếu có)
2. Chạy requests

---

## 🎯 Test Email Examples

### Example 1: Urgent Work Email
```json
{
  "user_id": "user123",
  "sender": "boss@company.com",
  "subject": "URGENT: Budget Approval Needed",
  "body": "Please approve the Q4 budget by EOD. This is critical for tomorrow's board meeting."
}
```

Expected Output:
- Category: **Work**
- Important: **Yes (Critical)**
- Actions: reply_asap, highlight, calendar_reminder
- Tone: urgent + formal

### Example 2: Personal Email
```json
{
  "user_id": "user123",
  "sender": "friend@gmail.com",
  "subject": "Coffee this weekend?",
  "body": "Hey! Want to grab coffee on Saturday? Let me know!"
}
```

Expected Output:
- Category: **Personal**
- Important: **No (Low)**
- Actions: review
- Tone: casual + inquisitive

### Example 3: Newsletter
```json
{
  "user_id": "user123",
  "sender": "newsletter@techcrunch.com",
  "subject": "Daily Tech News",
  "body": "Here's today's top stories... Unsubscribe anytime."
}
```

Expected Output:
- Category: **Newsletter**
- Important: **No**
- Actions: read_later, archive

---

## 📊 Kiểm tra kết quả

### View trong MongoDB

```javascript
// MongoDB Compass hoặc mongosh
use email_assistant

// Xem tất cả emails
db.emails.find().pretty()

// Xem emails quan trọng
db.emails.find({is_important: true}).pretty()

// Xem theo category
db.emails.find({category: "Work"}).pretty()
```

### View qua API

```powershell
# Get all emails
curl "http://localhost:5000/api/v1/emails?user_id=test"

# Filter by category
curl "http://localhost:5000/api/v1/emails?user_id=test&category=Work"

# Only important
curl "http://localhost:5000/api/v1/emails?user_id=test&is_important=true"

# Get stats
curl "http://localhost:5000/api/v1/stats?user_id=test"
```

---

## 🐛 Common Issues

### Error: "OPENAI_API_KEY not set"
✅ **Fix**: Thêm API key vào file `.env`

### Error: "MongoDB connection failed"
✅ **Fix**: 
- Đảm bảo MongoDB đang chạy
- Hoặc dùng MongoDB Atlas
- Check MONGODB_URI trong `.env`

### Error: "Module not found"
✅ **Fix**: 
```powershell
pip install -r requirements.txt
```

### Server không start
✅ **Fix**:
```powershell
# Check port 5000 có bị chiếm không
netstat -ano | findstr :5000

# Đổi port trong .env
PORT=5001
```

---

## 🎨 Next Steps

1. ✅ Test các email khác nhau
2. ✅ Xem kết quả trong MongoDB
3. ✅ Thử các API endpoints
4. 🔜 Tích hợp Frontend (coming soon)
5. 🔜 Connect Gmail API

---

**Need help?** Check README.md for detailed documentation!

Happy coding! 🚀
