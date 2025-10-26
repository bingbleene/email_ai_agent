# 📧 TÓM TẮT DỰ ÁN - AI EMAIL ASSISTANT

## 🎯 DỰ ÁN LÀ GÌ?

**AI Email Assistant** là một ứng dụng web thông minh sử dụng **5 AI Agents** để xử lý email tự động:
- ✅ **Phân loại email** (7 loại: Công việc, Cá nhân, Spam, Tài chính, v.v.)
- ✅ **Tóm tắt nội dung** email ngắn gọn
- ✅ **Đánh giá độ quan trọng** (0-100 điểm)
- ✅ **Gợi ý phản hồi** (3 phiên bản: Ngắn, Chuẩn, Chi tiết)
- ✅ **Hẹn giờ gửi email** (UI đã có, backend đang phát triển)

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

### 📊 Sơ đồ tổng quan

```
┌─────────────────────────────────────────────┐
│         NGƯỜI DÙNG (Browser)                │
│              http://localhost:3000           │
└──────────────────┬──────────────────────────┘
                   │
                   │ HTTP/JSON
                   ▼
┌─────────────────────────────────────────────┐
│         FRONTEND - React 18.2.0             │
│  ┌────────────────────────────────────────┐ │
│  │ 🎨 Giao diện chính (App.js)            │ │
│  ├────────────────────────────────────────┤ │
│  │ 📥 Hộp thư đến (UnprocessedInbox)      │ │
│  │   - 15 email mẫu tiếng Việt            │ │
│  │   - Chọn nhiều email bằng checkbox     │ │
│  │   - Xử lý hàng loạt                    │ │
│  ├────────────────────────────────────────┤ │
│  │ ✅ Đã xử lý (ProcessedList)            │ │
│  │   - Lọc theo 7 loại email              │ │
│  │   - Tìm kiếm real-time                 │ │
│  │   - Hiển thị dạng card grid            │ │
│  ├────────────────────────────────────────┤ │
│  │ 🔍 Chi tiết (EmailDetailView)          │ │
│  │   - Format email đầy đủ                │ │
│  │   - 3 nút: Copy / Hẹn giờ / Gửi       │ │
│  │   - Modal chọn thời gian gửi           │ │
│  └────────────────────────────────────────┘ │
└──────────────────┬──────────────────────────┘
                   │
                   │ Axios HTTP Requests
                   ▼
┌─────────────────────────────────────────────┐
│         BACKEND - Flask 3.0                 │
│              http://localhost:5000           │
│  ┌────────────────────────────────────────┐ │
│  │ 🚪 API Endpoints (app.py)              │ │
│  │   POST /api/v1/email/process           │ │
│  │   POST /api/v1/email/batch             │ │
│  │   GET  /api/v1/emails                  │ │
│  │   GET  /api/v1/stats                   │ │
│  └────────────────┬───────────────────────┘ │
│                   │                          │
│                   ▼                          │
│  ┌────────────────────────────────────────┐ │
│  │ 🎭 EmailCoordinator                    │ │
│  │    (Điều phối 5 AI Agents)             │ │
│  └────┬───┬───┬────┬────┬─────────────────┘ │
│       │   │   │    │    │                    │
│  ┌────▼─┐ │   │    │    │                    │
│  │Reader│ │   │    │    │  5 AI AGENTS       │
│  │Agent │ │   │    │    │                    │
│  └──────┘ │   │    │    │                    │
│       ┌───▼──┐│    │    │                    │
│       │Class-││    │    │                    │
│       │ifier ││    │    │                    │
│       └──────┘│    │    │                    │
│          ┌────▼───┐│    │                    │
│          │Summa-  ││    │                    │
│          │rizer   ││    │                    │
│          └────────┘│    │                    │
│             ┌──────▼───┐│                    │
│             │Decision  ││                    │
│             │Agent     ││                    │
│             └──────────┘│                    │
│                ┌────────▼──┐                 │
│                │Reply Agent│                 │
│                └───────────┘                 │
└────────────────┬───┬────────────────────────┘
                 │   │
      ┌──────────▼┐  └──────────────┐
      │  Google   │                 │
      │  Gemini   │         ┌───────▼────────┐
      │  AI API   │         │    MongoDB     │
      │(2.0-flash)│         │   localhost    │
      └───────────┘         │    :27017      │
                            └────────────────┘
```

---

## 🔄 LUỒNG XỬ LÝ EMAIL (FLOW HOẠT ĐỘNG)

### **Bước 1: Người dùng chọn email**
```
Frontend (Hộp thư đến)
  │
  ├─ Hiển thị 15 email mẫu tiếng Việt
  ├─ User tích checkbox chọn email
  ├─ Click nút "Xử lý email đã chọn"
  └─ Gửi request đến Backend
```

### **Bước 2: Backend nhận request**
```
POST /api/v1/email/process
  │
  ├─ Validate input (sender, subject, body)
  ├─ Rate limit check (10 email/phút)
  └─ Gọi EmailCoordinator.process()
```

### **Bước 3: EmailCoordinator điều phối 5 AI Agents**

#### **🤖 Agent 1: ReaderAgent** (Đọc & Phân tích)
```
Input: Email thô
  │
  ├─ Parse sender (email, tên)
  ├─ Clean subject (xóa ký tự lạ)
  ├─ Clean body (xóa HTML, khoảng trắng thừa)
  ├─ Đếm số từ (word_count)
  ├─ Kiểm tra có link không (has_links)
  ├─ Kiểm tra có số điện thoại (has_phone)
  └─ Output: Email đã parse

Tools: EmailParser
```

**Ví dụ Output:**
```json
{
  "sender": "sep@uit.edu.vn",
  "subject": "KHẨN: Phê duyệt ngân sách quý 4",
  "body": "Chào bạn, Tôi cần bạn phê duyệt...",
  "word_count": 45,
  "has_links": false,
  "has_phone": false
}
```

---

#### **🤖 Agent 2: ClassifierAgent** (Phân loại)
```
Input: Email đã parse
  │
  ├─ Gửi đến Google Gemini AI
  │   Prompt: "Classify this email into categories..."
  │
  ├─ AI phân tích nội dung
  ├─ Trả về category (Work/Personal/Spam/etc)
  ├─ Tính confidence (0.0 - 1.0)
  │
  └─ Fallback: Nếu AI lỗi → Dùng keyword matching

Categories: 7 loại
  - Work (Công việc)
  - Personal (Cá nhân)
  - Newsletter (Bản tin)
  - Spam (Rác)
  - Financial (Tài chính)
  - Support (Hỗ trợ)
  - Announcement (Công bố)
```

**Ví dụ Output:**
```json
{
  "category": "Work",
  "confidence": 0.95
}
```

---

#### **🤖 Agent 3: SummarizerAgent** (Tóm tắt)
```
Input: Email đã parse
  │
  ├─ Gửi đến Google Gemini AI
  │   Prompt: "Summarize this email in 2-3 sentences..."
  │
  ├─ AI tạo tóm tắt ngắn gọn
  ├─ Trích xuất key_points (điểm chính)
  ├─ Trích xuất action_items (hành động cần làm)
  │
  └─ Output: Summary + Key Points + Action Items
```

**Ví dụ Output:**
```json
{
  "summary": "Sếp yêu cầu phê duyệt ngân sách Q4 trước 5h chiều nay",
  "key_points": [
    "Phê duyệt ngân sách Q4",
    "Deadline: 5h chiều hôm nay",
    "Xem tài liệu đính kèm"
  ],
  "action_items": [
    "Xem tài liệu đính kèm",
    "Phê duyệt hoặc phản hồi"
  ]
}
```

---

#### **🤖 Agent 4: DecisionAgent** (Quyết định độ quan trọng)
```
Input: Email + Category + Summary
  │
  ├─ Tool 1: ImportanceScorer
  │   Tính điểm dựa trên 5 yếu tố:
  │   ├─ Category (30 điểm)
  │   │   Work/Financial: 25-30
  │   │   Personal: 15-20
  │   │   Spam: 0-5
  │   │
  │   ├─ Subject keywords (20 điểm)
  │   │   "URGENT", "ASAP": +20
  │   │   "Important": +15
  │   │
  │   ├─ Sender (25 điểm)
  │   │   Boss/Official: +25
  │   │   Known: +15
  │   │   Unknown: +5
  │   │
  │   ├─ Body content (15 điểm)
  │   │   Has action items: +15
  │   │   Has questions: +10
  │   │
  │   └─ Metadata (10 điểm)
  │       Has phone: +5
  │       Has links: +3
  │
  ├─ Tool 2: ToneAnalyzer
  │   Phân tích giọng điệu:
  │   ├─ Formality: formal / casual
  │   ├─ Urgency: urgent / normal / relaxed
  │   ├─ Sentiment: positive / neutral / negative
  │   └─ Other: grateful / apologetic
  │
  └─ Output: Score + Tone + Suggested Actions
```

**Ví dụ Output:**
```json
{
  "importance_score": 92,
  "is_important": true,
  "tone": "formal",
  "urgency": "urgent",
  "sentiment": "neutral",
  "suggested_action": ["reply", "flag", "calendar"]
}
```

**Thang điểm:**
- 80-100: 🔴 Critical (Cực kỳ quan trọng)
- 60-79: 🟠 High (Quan trọng)
- 40-59: 🟡 Medium (Trung bình)
- 0-39: 🟢 Low (Thấp)

---

#### **🤖 Agent 5: ReplyAgent** (Gợi ý phản hồi)
```
Input: Email + Category + Summary + Tone
  │
  ├─ Gửi đến Google Gemini AI
  │   Prompt: "Generate 3 reply versions..."
  │   Include: Original email + Tone + Category
  │
  ├─ AI tạo 3 phiên bản reply:
  │   ├─ Brief (50-100 từ)
  │   │   - Ngắn gọn, trả lời nhanh
  │   │
  │   ├─ Standard (100-200 từ)
  │   │   - Chuẩn mực, chuyên nghiệp
  │   │
  │   └─ Detailed (200-300 từ)
  │       - Chi tiết, đầy đủ thông tin
  │
  └─ Output: 3 versions of reply
```

**Ví dụ Output:**
```json
{
  "suggested_reply": {
    "brief": "Cảm ơn anh/chị. Em sẽ xem xét và phản hồi trong 1 giờ.",
    
    "standard": "Kính gửi anh/chị,\n\nCảm ơn anh/chị đã gửi đề xuất ngân sách Q4. Em sẽ xem xét kỹ tài liệu và phản hồi trước 5h chiều hôm nay.\n\nTrân trọng,\n[Tên bạn]",
    
    "detailed": "Kính gửi anh/chị,\n\nCảm ơn anh/chị đã gửi đề xuất ngân sách Q4. Em nhận thấy đây là vấn đề khẩn cấp và sẽ ưu tiên xem xét.\n\nEm sẽ:\n1. Xem xét tài liệu đính kèm trong 30 phút\n2. Phân tích các khoản chi\n3. Phản hồi kết quả phê duyệt trước 5h chiều\n\nNếu có bất kỳ câu hỏi nào, em sẽ liên hệ ngay với anh/chị.\n\nTrân trọng,\n[Tên bạn]"
  }
}
```

---

### **Bước 4: Lưu vào MongoDB**
```
MongoDB.save_email()
  │
  ├─ Database: email_assistant
  ├─ Collection: emails
  │
  └─ Document structure:
      {
        email_id: "email_123456",
        user_id: "user_789",
        sender: "sep@uit.edu.vn",
        subject: "KHẨN: Phê duyệt ngân sách quý 4",
        body: "...",
        category: "Work",
        importance_score: 92,
        summary: "...",
        key_points: [...],
        action_items: [...],
        suggested_reply: {...},
        processed_at: "2025-10-19T10:30:00Z"
      }
```

---

### **Bước 5: Trả về Frontend**
```
Backend Response (JSON)
  │
  └─> {
        "success": true,
        "data": {
          "email_id": "...",
          "category": "Work",
          "importance_score": 92,
          "summary": "...",
          "suggested_reply": {...}
        }
      }
```

---

### **Bước 6: Frontend hiển thị kết quả**

#### **Tab "Đã xử lý"**
```
ProcessedList Component
  │
  ├─ Hiển thị card với:
  │   ├─ 🏷️ Badge category (màu xanh = Work)
  │   ├─ ✅ Badge "Đã xử lý"
  │   ├─ 👤 Người gửi: sep@uit.edu.vn
  │   ├─ 📧 Tiêu đề: KHẨN: Phê duyệt...
  │   ├─ 📝 Tóm tắt: "Sếp yêu cầu..."
  │   ├─ 📊 Thanh importance: 92/100 (màu đỏ)
  │   └─ 👁️ Nút "Xem chi tiết"
  │
  └─ Có thể lọc theo:
      - 7 loại category
      - Tìm kiếm (sender/subject/summary)
```

---

#### **Tab "Chi tiết"**
```
EmailDetailView Component
  │
  ├─ 📧 Thông tin email
  │   ├─ Tiêu đề
  │   ├─ Người gửi
  │   ├─ Thời gian nhận
  │   ├─ Loại email (badge)
  │   └─ Trạng thái "Đã xử lý"
  │
  ├─ 📝 Tóm tắt nội dung
  │   ├─ Summary text
  │   └─ Thanh độ quan trọng 92/100
  │
  ├─ 💬 Phản hồi gợi ý (FORMAT ĐẦY ĐỦ)
  │   │
  │   ├─ ┌─────────────────────────────┐
  │   │   │ Đến: sep@uit.edu.vn         │
  │   │   ├─────────────────────────────┤
  │   │   │ Chủ đề: Re: KHẨN: Phê duyệt │
  │   │   ├─────────────────────────────┤
  │   │   │                             │
  │   │   │ Kính gửi anh/chị,           │
  │   │   │                             │
  │   │   │ Cảm ơn anh/chị đã gửi...    │
  │   │   │                             │
  │   │   └─────────────────────────────┘
  │   │
  │   └─ 3 NÚT THAO TÁC:
  │       ├─ 📋 Sao chép email (xám)
  │       │   → Copy format đầy đủ
  │       │
  │       ├─ ⏰ Hẹn giờ gửi (vàng)
  │       │   → Mở modal chọn ngày/giờ
  │       │   → Chọn thời gian
  │       │   → Lên lịch gửi
  │       │
  │       └─ 📨 Gửi ngay (tím)
  │           → Gửi email tức thì
  │
  └─ 📄 Nội dung gốc (có thể mở/đóng)
```

---

## 🎯 TỔNG KẾT FLOW HOẠT ĐỘNG

```
1. User chọn email → Click "Xử lý"
         ↓
2. Frontend gửi POST request
         ↓
3. Backend nhận → EmailCoordinator
         ↓
4. ReaderAgent → Parse email
         ↓
5. ClassifierAgent → Phân loại (Work/Personal/...)
         ↓
6. SummarizerAgent → Tóm tắt + Key points
         ↓
7. DecisionAgent → Tính điểm (0-100) + Tone
         ↓
8. ReplyAgent → Tạo 3 phiên bản reply
         ↓
9. Lưu MongoDB
         ↓
10. Trả JSON về Frontend
         ↓
11. Frontend hiển thị card trong "Đã xử lý"
         ↓
12. User click "Xem chi tiết"
         ↓
13. Hiển thị đầy đủ: Summary + Reply format + 3 nút
         ↓
14. User copy email hoặc hẹn giờ gửi
```

**⏱️ Thời gian xử lý**: ~2-3 giây/email

---

## 📂 CẤU TRÚC CODE

### **Backend (Python + Flask)**
```
backend/
├── agents/                    # 5 AI Agents
│   ├── email_coordinator.py  # Điều phối chính
│   ├── reader_agent.py       # Đọc email
│   ├── classifier_agent.py   # Phân loại
│   ├── summarizer_agent.py   # Tóm tắt
│   ├── decision_agent.py     # Đánh giá
│   └── reply_agent.py        # Gợi ý reply
│
├── tools/                     # Công cụ hỗ trợ
│   ├── email_parser.py       # Parse email
│   ├── importance_scorer.py  # Tính điểm
│   └── tone_analyzer.py      # Phân tích tone
│
├── utils/                     # Tiện ích
│   ├── openai_client.py      # Gọi Gemini API
│   ├── db.py                 # MongoDB
│   └── rate_limiter.py       # Rate limiting
│
└── app.py                     # Flask API (8 endpoints)
```

### **Frontend (React)**
```
frontend/src/
├── components/
│   ├── UnprocessedInbox.js   # Hộp thư đến
│   ├── ProcessedList.js      # Đã xử lý
│   ├── EmailDetailView.js    # Chi tiết
│   └── Statistics.js         # Thống kê
│
├── services/
│   └── api.js                # Axios HTTP client
│
├── styles/
│   ├── App.css
│   ├── UnprocessedInbox.css
│   ├── ProcessedList.css
│   └── EmailDetailView.css
│
└── App.js                     # Main component
```

---

## 🔑 CÔNG NGHỆ SỬ DỤNG

### **Backend**
- **Python 3.8+**: Ngôn ngữ lập trình
- **Flask 3.0**: Web framework
- **Google Generative AI 0.8.5**: Thư viện Gemini API
- **PyMongo 4.6.1**: MongoDB driver
- **Flask-CORS**: Xử lý CORS

### **Frontend**
- **React 18.2.0**: UI framework
- **Axios 1.6.0**: HTTP client
- **Lucide React 0.263.1**: Icon library

### **AI & Database**
- **Google Gemini 2.0 Flash**: AI model
- **MongoDB**: NoSQL database

---

## 💡 TÍNH NĂNG NỔI BẬT (v2.0)

### ✅ Đã hoàn thành
1. **15 email mẫu tiếng Việt**: Đa dạng tình huống
2. **UI hoàn toàn tiếng Việt**: Dễ sử dụng
3. **Format email đầy đủ**: Đến/Chủ đề/Nội dung
4. **3 nút thao tác**: Copy/Hẹn giờ/Gửi
5. **Modal hẹn giờ**: Chọn ngày và giờ
6. **Fix scroll**: Bảng có scroll ngang, header cố định
7. **Xử lý hàng loạt**: Chọn nhiều email cùng lúc
8. **Lọc & tìm kiếm**: 7 loại + search real-time
9. **Thống kê**: Biểu đồ phân tích

### 🚧 Đang phát triển
- Backend cho "Hẹn giờ gửi"
- Backend cho "Gửi ngay"
- Tích hợp Gmail/Outlook API

---

## 🚀 CÁCH CHẠY ỨNG DỤNG

### **Bước 1: Chạy Backend**
```powershell
cd d:\DownloadLT\UIT\jib\my_ai_agent\backend
python run.py
```
✅ Backend: http://localhost:5000

### **Bước 2: Chạy Frontend**
```powershell
cd d:\DownloadLT\UIT\jib\my_ai_agent\frontend
npm start
```
✅ Frontend: http://localhost:3000

### **Bước 3: Sử dụng**
1. Mở http://localhost:3000
2. Vào tab "Hộp thư" (15 email có sẵn)
3. Chọn email → Click "Xử lý"
4. Xem kết quả trong "Đã xử lý"
5. Click "Xem chi tiết" → Copy/Hẹn giờ/Gửi

---

## 📊 THỐNG KÊ DỰ ÁN

- **📁 Tổng số file**: 40+ files
- **📝 Dòng code**: 3,500+ lines
- **🤖 AI Agents**: 5 agents
- **🔧 Tools**: 3 tools
- **🌐 API Endpoints**: 8 endpoints
- **📧 Email categories**: 7 loại
- **⭐ Tính năng**: 15+ features
- **🎨 Components**: 8 React components
- **⏱️ Thời gian xử lý**: 2-3s/email

---

## 🎓 ĐIỂM MẠNH DỰ ÁN

1. **🏗️ Kiến trúc Multi-Agent**: Phân chia rõ ràng, dễ mở rộng
2. **🤖 AI thông minh**: Sử dụng Gemini 2.0 Flash mới nhất
3. **🎨 UI/UX hiện đại**: Responsive, tiếng Việt, dễ sử dụng
4. **📊 Phân tích chi tiết**: 5 yếu tố tính điểm quan trọng
5. **💬 Gợi ý reply**: 3 phiên bản phù hợp nhiều tình huống
6. **🔒 Bảo mật**: API key trong .env, rate limiting
7. **📱 Responsive**: Desktop, tablet, mobile
8. **🚀 Performance**: Xử lý nhanh, cache kết quả

---

## 🎯 ỨNG DỤNG THỰC TẾ

### **Ai nên dùng?**
- ✅ Người nhận nhiều email mỗi ngày (>50 emails)
- ✅ Nhân viên văn phòng cần quản lý email
- ✅ Freelancer cần ưu tiên email khách hàng
- ✅ Quản lý dự án cần theo dõi email team
- ✅ Người muốn tiết kiệm thời gian đọc email

### **Lợi ích:**
- ⏰ Tiết kiệm 70% thời gian đọc email
- 🎯 Ưu tiên email quan trọng
- 💬 Phản hồi nhanh với gợi ý AI
- 📊 Theo dõi thống kê email
- 🧹 Lọc spam tự động

---

## 📞 HỖ TRỢ

**Tài liệu:**
- `HUONG_DAN_SU_DUNG.md` - Hướng dẫn chi tiết
- `SETUP_GUIDE.md` - Cài đặt từ đầu
- `ARCHITECTURE.md` - Kiến trúc hệ thống
- `PROJECT_OVERVIEW.md` - Tổng quan dự án

**Gặp lỗi?**
1. Kiểm tra backend terminal (lỗi Python)
2. Kiểm tra frontend console (F12)
3. Xem MongoDB đã chạy chưa
4. Kiểm tra Gemini API key

---

**🎉 Chúc bạn sử dụng hiệu quả!**

_Version 2.0 - October 2025_
_AI Email Assistant Team_
