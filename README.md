# 📧 AI Email Assistant - Multi-Agent System

**Hệ thống AI thông minh với 5 agents xử lý email tự động**

> Phân loại • Tóm tắt • Đánh giá độ quan trọng • Gợi ý phản hồi • Hẹn giờ gửi

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-latest-green.svg)](https://www.mongodb.com/)

---

## 📑 Mục lục

- [Tổng quan dự án](#-tổng-quan-dự-án)
- [Tính năng chính](#-tính-năng-chính)
- [Kiến trúc hệ thống](#️-kiến-trúc-hệ-thống)
- [Cài đặt và chạy](#-cài-đặt-và-chạy)
- [Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Tổng quan dự án

### Dự án là gì?

AI Email Assistant là ứng dụng web sử dụng **kiến trúc Multi-Agent** với 5 AI agents chuyên biệt để xử lý email tự động:

1. **ReaderAgent** - Đọc và phân tích cấu trúc email
2. **ClassifierAgent** - Phân loại 7 loại email (Work, Personal, Spam...)
3. **SummarizerAgent** - Tóm tắt nội dung ngắn gọn
4. **DecisionAgent** - Đánh giá độ quan trọng (0-100 điểm)
5. **ReplyAgent** - Gợi ý 3 phiên bản phản hồi

### Thống kê dự án

- **📁 Tổng số file**: 40+ files
- **📝 Dòng code**: 3,500+ lines
- **🤖 AI Agents**: 5 agents
- **🔧 Tools**: 3 tools
- **🌐 API Endpoints**: 8 endpoints
- **📧 Email categories**: 7 loại
- **⭐ Tính năng**: 15+ features
- **⏱️ Thời gian xử lý**: 2-3s/email

---

## � Tính năng chính

## 🌟 Tính năng chính

### Backend Intelligence
- ✅ **7 loại phân loại**: Work, Personal, Spam, Financial, Newsletter, Support, Announcement
- 📝 **Tóm tắt thông minh**: Key points và action items tự động
- 📊 **Importance scoring 0-100**: Thuật toán 5 yếu tố
- 💬 **Gợi ý phản hồi**: 3 phiên bản (Brief, Standard, Detailed)
- 🎨 **Phân tích tone**: Formal, Casual, Urgent, Grateful, Apologetic
- 🔍 **Trích xuất action items**: Tự động từ email

### Frontend Experience (v2.0)
- 🎨 **Giao diện tiếng Việt**: Dễ sử dụng, hiện đại
- � **Inbox management**: Chọn nhiều email, xử lý hàng loạt
- ✅ **3-step workflow**: Hộp thư → Đã xử lý → Chi tiết
- 📧 **Format email đầy đủ**: Đến/Chủ đề/Nội dung sẵn sàng copy
- ⏰ **Hẹn giờ gửi**: Chọn thời gian gửi email (UI ready)
- 🔍 **Tìm kiếm & lọc**: 7 categories + real-time search
- 📊 **Thống kê**: Visual analytics với biểu đồ
- 📱 **Responsive**: Desktop, tablet, mobile

---

## 🏗️ Kiến trúc hệ thống

### Sơ đồ tổng quan

```
┌─────────────────────────────────────┐
│    NGƯỜI DÙNG (Browser)             │
│    http://localhost:3000            │
└──────────────┬──────────────────────┘
               │ HTTP/JSON
               ▼
┌─────────────────────────────────────┐
│    FRONTEND - React 18.2.0          │
│  ┌────────────────────────────────┐ │
│  │ 📥 Hộp thư (UnprocessedInbox)  │ │
│  │ ✅ Đã xử lý (ProcessedList)    │ │
│  │ 🔍 Chi tiết (EmailDetailView)  │ │
│  │ 📊 Thống kê (Statistics)       │ │
│  └────────────────────────────────┘ │
└──────────────┬──────────────────────┘
               │ Axios Requests
               ▼
┌─────────────────────────────────────┐
│    BACKEND - Flask 3.0              │
│    http://localhost:5000            │
│  ┌────────────────────────────────┐ │
│  │ 🎭 EmailCoordinator            │ │
│  │    (Orchestrator)              │ │
│  └─┬──┬──┬──┬──┬───────────────────┘ │
│    │  │  │  │  │                     │
│  ┌─▼┐┌▼┐┌▼┐┌▼┐┌▼┐   5 AI AGENTS    │
│  │R││C││S││D││R│                    │
│  │e││l││u││e││e│                    │
│  │a││a││m││c││p│                    │
│  │d││s││m││i││l│                    │
│  │e││s││a││s││y│                    │
│  │r││i││r││i││ │                    │
│  │ ││f││i││o││ │                    │
│  │ ││i││z││n││ │                    │
│  │ ││e││e││ ││ │                    │
│  │ ││r││r││ ││ │                    │
│  └─┘└─┘└─┘└─┘└─┘                    │
└─────────┬───┬──────────────────────┘
          │   │
    ┌─────▼┐  └──────────┐
    │Gemini│            │
    │2.0   │     ┌──────▼────┐
    │Flash │     │  MongoDB  │
    └──────┘     │localhost  │
                 │:27017     │
                 └───────────┘
```

### Luồng xử lý email (Flow)

```
1. User chọn email → Click "Xử lý"
         ↓
2. Frontend gửi POST request
         ↓
3. Backend nhận → EmailCoordinator
         ↓
4. ReaderAgent → Parse email metadata
         ↓
5. ClassifierAgent → Phân loại category
         ↓
6. SummarizerAgent → Tóm tắt + Key points
         ↓
7. DecisionAgent → Tính điểm 0-100 + Tone
         ↓
8. ReplyAgent → Tạo 3 phiên bản reply
         ↓
9. Lưu MongoDB
         ↓
10. Trả JSON về Frontend
         ↓
11. Hiển thị trong "Đã xử lý"
         ↓
12. User xem chi tiết + Copy/Hẹn giờ/Gửi
```

**⏱️ Thời gian**: ~2-3 giây/email

### Công nghệ sử dụng

#### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.8+ | Core language |
| **Flask** | 3.0.0 | Web framework |
| **Google Generative AI** | 0.8.5 | Gemini API |
| **PyMongo** | 4.6.1 | MongoDB driver |
| **Flask-CORS** | 4.0.0 | Cross-origin requests |

#### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **Axios** | 1.6.0 | HTTP client |
| **Lucide React** | 0.263.1 | Icon library |

#### AI & Database
- **Google Gemini 2.0 Flash**: AI model
- **MongoDB**: NoSQL database (localhost:27017)

---

## 🚀 Cài đặt và chạy

### Prerequisites (Yêu cầu)

- [ ] **Python 3.8+** installed
- [ ] **Node.js 14+** and npm installed
- [ ] **Google Gemini API key** ready
- [ ] **MongoDB** installed (hoặc MongoDB Atlas)


### Bước 1: Clone Repository

```powershell
git clone https://github.com/bingbleene/email_ai_agent.git
cd email_ai_agent/my_ai_agent
```

### Bước 2: Backend Setup

#### 2.1 Navigate to Backend Directory
```powershell
cd backend
```

#### 2.2 Create Virtual Environment
```powershell
python -m venv venv

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activate (macOS/Linux)
source venv/bin/activate
```

#### 2.3 Install Dependencies
```powershell
pip install -r requirements.txt
```

**Packages installed:**
- Flask 3.0.0
- google-generativeai 0.8.5
- pymongo 4.6.1
- flask-cors 4.0.0
- python-dotenv 1.0.0

#### 2.4 Configure Environment

Create `.env` file in `backend/` directory:

```env
# Required - Gemini API Key
GEMINI_API_KEY=AIzaSyBvgG0MpPJg7EMNUOBRXLmTynKQiVX5Tt4

# Optional - MongoDB
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB=email_assistant

# Optional - Development
FLASK_ENV=development
DEBUG=True
PORT=5000
```

**🔑 Get Gemini API key**: https://makersuite.google.com/app/apikey

#### 2.5 Start MongoDB

**Windows:**
```powershell
# Check if MongoDB service is running
services.msc
# → Find "MongoDB Server" → Start
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Or use MongoDB Atlas** (cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/email_assistant
```

#### 2.6 Run Backend Server
```powershell
python run.py
```

✅ Backend running at: **http://localhost:5000**

### Bước 3: Frontend Setup

#### 3.1 Navigate to Frontend (New Terminal)
```powershell
cd frontend
```

#### 3.2 Install Dependencies
```powershell
npm install
```

**Packages installed:**
- React 18.2.0
- Axios 1.6.0
- Lucide React 0.263.1
- React Scripts 5.0.1

#### 3.3 Verify Environment File
Ensure `.env` exists in `frontend/` with:
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

#### 3.4 Start Frontend Server
```powershell
npm start
```

✅ Frontend opens at: **http://localhost:3000**

### Bước 4: Verify Installation

#### Backend Health Check
Open browser: **http://localhost:5000/health**

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "ai_service": "gemini-2.0-flash",
  "timestamp": "2025-10-26T10:30:00"
}
```

#### Frontend Check
Open **http://localhost:3000** and verify:
- 🎨 Giao diện tiếng Việt
- 📥 Tab "Hộp thư" với 17 email mẫu
- ✅ Tab "Đã xử lý"
- 📊 Tab "Thống kê"
- 🟢 Green health indicator

---

## 📖 Hướng dẫn sử dụng

### 🎮 Workflow 3 bước

```
BƯỚC 1: Hộp thư đến
  ↓ Chọn email (checkbox)
  ↓ Click "Xử lý email đã chọn"
  
BƯỚC 2: AI xử lý (2-3s/email)
  ↓ Phân loại
  ↓ Tóm tắt
  ↓ Đánh giá
  ↓ Gợi ý reply
  
BƯỚC 3: Xem kết quả
  ↓ Tab "Đã xử lý"
  ↓ Lọc theo category
  ↓ Xem chi tiết
  ↓ Copy/Hẹn giờ/Gửi
```

### 📥 1. Hộp thư đến (Inbox)

**Màn hình hiển thị:**
- 17 email mẫu tiếng Việt có sẵn
- Bảng với: Checkbox, Người gửi, Tiêu đề, Nội dung, Thời gian

**Chức năng:**

#### ✅ Chọn email
- Click **bất kỳ đâu** trên hàng để chọn/bỏ chọn
- Click **checkbox** riêng lẻ
- Click **"Chọn tất cả"** để chọn toàn bộ

#### 🔄 Xử lý email
1. Chọn 1 hoặc nhiều email
2. Click nút **"Xử lý email đã chọn"** (màu tím)
3. Popup **"Đang xử lý email..."** hiện ra
4. AI xử lý tuần tự (delay 500ms giữa mỗi email)
5. Thông báo **"Đã xử lý thành công X/Y email!"**
6. Tự động chuyển sang tab **"Đã xử lý"**

#### 🔄 Làm mới
- Click **"Làm mới"** để reload danh sách

### ✅ 2. Danh sách đã xử lý

**Màn hình hiển thị:**
- Hiển thị dạng **card grid**
- Mỗi card hiển thị: Category badge, Tóm tắt, Độ quan trọng, Thời gian

**Chức năng:**

#### 🔍 Lọc theo category
Click vào chip màu:
- 🔵 **Công việc** (Work) - #1976d2
- 🟣 **Cá nhân** (Personal) - #7b1fa2
- 🟠 **Thông báo** (Newsletter) - #f57c00
- 🔴 **Spam** - #c62828
- 🟢 **Tài chính** (Financial) - #2e7d32
- 🔴 **Hỗ trợ** (Support) - #c2185b
- 🟡 **Công bố** (Announcement) - #00695c
- ⚫ **Tất cả** - Hiển thị tất cả

#### 🔍 Tìm kiếm
- Gõ từ khóa vào ô search
- Tìm trong: người gửi, tiêu đề, tóm tắt
- Kết quả lọc real-time

#### 👁️ Xem chi tiết
- Click **"Xem chi tiết"** trên card
- Chuyển sang màn hình chi tiết email

### 🔍 3. Chi tiết email

**Card 1: Thông tin email**
- Tiêu đề đầy đủ
- Category badge màu
- Người gửi
- Thời gian nhận & xử lý
- Trạng thái "Đã xử lý"

**Card 2: Tóm tắt nội dung**
- Summary text (AI-generated)
- Thanh độ quan trọng (0-100)
  - 80-100: 🔴 Critical
  - 60-79: 🟠 High
  - 40-59: 🟡 Medium
  - 0-39: 🟢 Low

**Card 3: Phản hồi gợi ý** ⭐

Format email đầy đủ sẵn sàng copy:
```
┌─────────────────────────────────┐
│ Đến: sender@example.com         │
├─────────────────────────────────┤
│ Chủ đề: Re: Email gốc           │
├─────────────────────────────────┤
│                                 │
│ [Nội dung phản hồi AI tạo]      │
│                                 │
└─────────────────────────────────┘
```

**3 nút thao tác:**

1. **📋 Sao chép email** (màu xám)
   - Copy toàn bộ: Đến + Chủ đề + Nội dung
   - Dán trực tiếp vào Gmail/Outlook

2. **⏰ Hẹn giờ gửi** (màu vàng)
   - Mở popup chọn ngày & giờ
   - Email tự động gửi vào thời gian đã hẹn
   - *(Backend đang phát triển)*

3. **📨 Gửi ngay** (màu tím)
   - Gửi email tức thì
   - *(Backend đang phát triển)*

**Card 4: Nội dung gốc** (thu gọn/mở rộng)
- Click để xem email nguyên bản
- Max-height 400px với scrollbar

**Card 5: Thông tin bổ sung** (nếu có)
- Giọng điệu (tone)
- Cảm xúc (sentiment)
- Điểm chính (key_points)
- Action items

### 📊 4. Thống kê

- Tổng số email đã xử lý
- Phân bố theo category
- Số lượng theo độ quan trọng
- Biểu đồ visual

---

## 📡 API Documentation

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "ai_service": "gemini-2.0-flash",
  "timestamp": "2025-10-26T10:30:00Z"
}
```

#### 2. Process Single Email
```http
POST /email/process
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": "user_123",
  "sender": "boss@company.com",
  "subject": "URGENT: Project deadline",
  "body": "We need to finish this ASAP. Meeting tomorrow at 9am."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "email_id": "67890abc",
    "user_id": "user_123",
    "sender": "boss@company.com",
    "subject": "URGENT: Project deadline",
    "category": "Work",
    "importance_score": 85,
    "is_important": true,
    "summary": "Boss requests urgent project completion with meeting scheduled.",
    "key_points": [
      "Urgent project deadline",
      "Meeting tomorrow 9am",
      "Needs immediate action"
    ],
    "action_items": [
      "Prepare for meeting",
      "Complete pending tasks"
    ],
    "tone": "urgent",
    "suggested_actions": ["reply_asap", "flag", "calendar"],
    "suggested_reply": {
      "brief": "Understood. I'll prioritize this and attend the meeting.",
      "standard": "Thank you for the heads up. I'll make this my top priority...",
      "detailed": "Dear [Boss], Thank you for bringing this to my attention..."
    },
    "processed_at": "2025-10-26T10:35:00Z"
  }
}
```

#### 3. Batch Process
```http
POST /email/batch
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": "user_123",
  "emails": [
    {"sender": "...", "subject": "...", "body": "..."},
    {"sender": "...", "subject": "...", "body": "..."}
  ]
}
```

#### 4. Get All Emails
```http
GET /emails?user_id=user_123&category=Work&is_important=true
```

**Query Parameters:**
- `user_id` (required): User identifier
- `category` (optional): Work, Personal, Spam, etc.
- `is_important` (optional): true/false

#### 5. Get Email by ID
```http
GET /emails/<email_id>?user_id=user_123
```

#### 6. Delete Email
```http
DELETE /emails/<email_id>?user_id=user_123
```

#### 7. Get Statistics
```http
GET /stats?user_id=user_123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "important": 25,
    "by_category": {
      "Work": 80,
      "Personal": 40,
      "Newsletter": 20,
      "Spam": 10
    },
    "by_importance": {
      "critical": 15,
      "high": 35,
      "medium": 60,
      "low": 40
    }
  }
}
```

### Rate Limiting
- **Processing**: 10 requests/minute
- **Queries**: 20 requests/minute
- **Daily**: 100 processing requests

---

## 💡 Mẹo sử dụng

### 🎯 Workflow hiệu quả
1. **Xử lý hàng loạt**: Chọn 5-10 email/lần cho tối ưu
2. **Ưu tiên quan trọng**: Lọc email Critical/High trước
3. **Dùng tìm kiếm**: Tìm nhanh theo từ khóa
4. **Copy format đầy đủ**: Dán trực tiếp vào Gmail/Outlook
5. **Hẹn giờ thông minh**: Email công việc gửi giờ hành chính

### 📧 Email mẫu
Hệ thống có sẵn **17 email mẫu tiếng Việt** để test:
- Email công việc khẩn cấp
- Email cá nhân hẹn cafe
- Newsletter công nghệ
- Thông báo thanh toán
- Đơn hàng đang giao
- Mời phỏng vấn
- Flash sale
- Cảnh báo bảo mật
- Gặp mặt cựu sinh viên
- Chứng chỉ online
- Spam lottery
- Họp sprint review
- Kết quả xét nghiệm
- Sự kiện Google Cloud
- Review code
- **Đề xuất hợp tác** (email dài ~600 từ)
- **Phản hồi đồ án** (email dài ~800 từ)

---

## 🔧 Troubleshooting

### ❌ Backend không chạy

**Problem**: `GEMINI_API_KEY not found`
```powershell
# Check .env file exists in backend/
# Add API key:
GEMINI_API_KEY=AIzaSyBvgG0MpPJg7EMNUOBRXLmTynKQiVX5Tt4
```

**Problem**: `MongoDB connection failed`
```powershell
# Windows: Check Services
services.msc → MongoDB Server → Start

# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Or use MongoDB Atlas (cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

**Problem**: `Module not found`
```powershell
# Reinstall dependencies
pip install -r requirements.txt
```

### ❌ Frontend lỗi

**Problem**: `npm start` fails
```powershell
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problem**: API connection error
```powershell
# Check backend is running at localhost:5000
# Check .env has correct API_URL
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### ❌ Lỗi xử lý email

**Problem**: "Vui lòng chọn ít nhất một email"
- Bạn chưa chọn email nào bằng checkbox

**Problem**: "Lỗi khi xử lý email"
- Kiểm tra backend terminal xem có lỗi Python
- Kiểm tra MongoDB đã chạy
- Kiểm tra Gemini API key valid

**Problem**: Xử lý chậm
- Bình thường: 2-3 giây/email
- Email dài (>500 từ): 4-5 giây
- Batch nhiều email: Có delay 500ms giữa mỗi email

**Problem**: Phản hồi không hiện
- Mở browser console (F12)
- Xem log `📧 Email Detail Data`
- Nếu không có `suggested_reply`, sẽ hiển thị template mặc định

### ❌ UI bị khuất

**Problem**: Table headers hidden
- ✅ **ĐÃ FIX**: Bảng giờ có scroll ngang
- Headers cố định khi scroll (position: sticky)

**Problem**: Buttons không thấy
- Scroll xuống phần "Phản hồi gợi ý"
- 3 nút màu xám/vàng/tím phải hiển thị

---

## � Importance Scoring Algorithm

### 5 yếu tố tính điểm (Tổng 100 điểm)

#### 1. Category Weight (30 điểm)
- Work/Financial: 25-30 điểm
- Personal: 15-20 điểm
- Newsletter: 10-15 điểm
- Spam: 0-5 điểm

#### 2. Sender Weight (25 điểm)
- Boss/Official: 25 điểm
- Known contacts: 15 điểm
- Unknown: 5 điểm

#### 3. Subject Keywords (20 điểm)
- "URGENT", "ASAP", "KHẨN": 20 điểm
- "Important", "Action Required": 15 điểm
- Normal: 10 điểm

#### 4. Body Content (15 điểm)
- Has action items: 15 điểm
- Has questions: 12 điểm
- Normal: 8 điểm

#### 5. Metadata (10 điểm)
- Has phone number: +5 điểm
- Has links: +3 điểm
- Word count >200: +2 điểm

### Thang điểm cuối

- **80-100**: 🔴 **Critical** - Xử lý ngay
- **60-79**: 🟠 **High** - Quan trọng
- **40-59**: 🟡 **Medium** - Trung bình
- **0-39**: 🟢 **Low** - Không khẩn

---

## 🎭 Tone Detection

### Tones hỗ trợ

- **Formal**: Professional, business
- **Casual**: Friendly, informal
- **Urgent**: Time-sensitive, khẩn cấp
- **Grateful**: Expressing thanks
- **Apologetic**: Expressing sorry
- **Inquisitive**: Asking questions
- **Positive/Negative**: Sentiment analysis

---

## � Cấu trúc dự án

```
my_ai_agent/
├── backend/                    # Python Flask backend
│   ├── agents/                 # 5 AI Agents
│   │   ├── email_coordinator.py  # Orchestrator
│   │   ├── reader_agent.py    # Parse email
│   │   ├── classifier_agent.py  # Categorize
│   │   ├── summarizer_agent.py  # Summarize
│   │   ├── decision_agent.py  # Score importance
│   │   └── reply_agent.py     # Generate replies
│   │
│   ├── tools/                  # Support tools
│   │   ├── email_parser.py
│   │   ├── importance_scorer.py
│   │   └── tone_analyzer.py
│   │
│   ├── utils/                  # Utilities
│   │   ├── gemini_client.py   # Gemini API wrapper
│   │   ├── db.py              # MongoDB operations
│   │   └── rate_limiter.py
│   │
│   ├── data/                   # Config data
│   │   ├── email_categories.json
│   │   └── tone_templates.json
│   │
│   ├── app.py                  # Flask app (8 endpoints)
│   ├── run.py                  # Entry point
│   └── requirements.txt        # Python deps
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── UnprocessedInbox.js   # Inbox table
│   │   │   ├── ProcessedList.js      # Processed grid
│   │   │   ├── EmailDetailView.js    # Detail view
│   │   │   └── Statistics.js         # Analytics
│   │   │
│   │   ├── services/
│   │   │   └── api.js          # Axios client
│   │   │
│   │   ├── styles/             # CSS files
│   │   ├── App.js              # Main component
│   │   └── index.js
│   │
│   ├── public/
│   └── package.json            # Node deps
│
├── README.md                   # This file (all-in-one guide)
├── HUONG_DAN_SU_DUNG.md       # Detailed usage guide
├── SETUP_GUIDE.md             # Detailed setup guide
├── TOM_TAT_DU_AN.md           # Project summary
├── ARCHITECTURE.md            # System architecture
└── LICENSE                    # Apache 2.0
```

---

## 🚀 Roadmap & Future Features

### ✅ Đã hoàn thành (v2.0)
- Multi-agent system với 5 agents
- 17 email mẫu tiếng Việt
- UI hoàn toàn tiếng Việt
- Batch processing
- Format reply đầy đủ (Đến/Chủ đề/Nội dung)
- 3 action buttons (Copy/Schedule/Send)
- Modal hẹn giờ gửi (UI)
- Fix scroll table
- Responsive design
- Search & filter (7 categories)
- Statistics dashboard

### � Đang phát triển
- [ ] Backend hẹn giờ gửi (scheduler integration)
- [ ] Backend gửi email trực tiếp (SMTP/Gmail API)
- [ ] Form validation cho schedule modal

### 📋 Kế hoạch tương lai
- [ ] Gmail/Outlook API integration
- [ ] Email threading & conversations
- [ ] Attachment handling (PDF, images)
- [ ] Calendar integration (Google Calendar)
- [ ] Email templates library
- [ ] Multi-language support
- [ ] Voice-to-email transcription
- [ ] Smart notifications
- [ ] Team collaboration features
- [ ] Fine-tuned models cho specific industries
- [ ] Phishing detection
- [ ] Auto-forwarding rules

---

## 💻 Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 18.2.0 |
| | Axios | 1.6.0 |
| | Lucide React | 0.263.1 |
| **Backend** | Flask | 3.0.0 |
| | Python | 3.8+ |
| **AI** | Google Gemini | 2.0 Flash |
| | google-generativeai | 0.8.5 |
| **Database** | MongoDB | Latest |
| | PyMongo | 4.6.1 |
| **Others** | Flask-CORS | 4.0.0 |

---

## 📝 Changelog

### Version 2.0 (October 2025) - Current
- ✅ Complete Vietnamese localization
- ✅ Redesigned UI with inbox workflow
- ✅ 17 Vietnamese email samples (including 2 long ones)
- ✅ Email format reply (To/Subject/Body)
- ✅ 3 action buttons with distinct functions
- ✅ Schedule send modal UI
- ✅ Fixed table scrolling issues
- ✅ Cleaned up duplicate documentation

### Version 1.0 (January 2024)
- Initial release with 5 AI agents
- English UI
- 5 email samples
- Basic processing workflow

---

## 👨‍💻 Contributing

Contributions welcome! Areas to focus:
- Adding new AI agents
- Improving importance scoring
- Enhancing UI/UX
- Writing tests
- Documentation improvements
- Performance optimization

---

## 📄 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI**: AI model integration
- **MongoDB**: Database platform
- **React**: Frontend framework
- **Flask**: Backend framework
- **Lucide**: Icon library

---

## � Support & Contact

**Gặp vấn đề?**
1. Check [Troubleshooting](#-troubleshooting) section
2. Review `HUONG_DAN_SU_DUNG.md` for detailed usage
3. Check `SETUP_GUIDE.md` for installation issues
4. Read `TOM_TAT_DU_AN.md` for project overview
5. See `ARCHITECTURE.md` for system design

**Tài liệu:**
- 📘 README.md - Tổng quan đầy đủ (file này)
- 📗 TOM_TAT_DU_AN.md - Tóm tắt chi tiết + flow hoạt động
- 📙 HUONG_DAN_SU_DUNG.md - Hướng dẫn sử dụng v2.0
- 📕 SETUP_GUIDE.md - Hướng dẫn cài đặt chi tiết
- 📔 ARCHITECTURE.md - Kiến trúc hệ thống

---

<div align="center">

**🎉 Built with ❤️ using AI and Modern Web Technologies**

**Version 2.0 - October 2025**

[![Star this repo](https://img.shields.io/github/stars/bingbleene/email_ai_agent?style=social)](https://github.com/bingbleene/email_ai_agent)

**Happy Email Processing! 📧✨**

</div>
