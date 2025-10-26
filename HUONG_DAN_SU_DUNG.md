# Hướng Dẫn Sử Dụng - AI Email Assistant (Phiên bản tiếng Việt)

## 🎯 Tổng quan giao diện mới

Giao diện đã được thiết kế lại hoàn toàn theo đúng yêu cầu của bạn với 3 bước rõ ràng:

### Quy trình làm việc
1. **Hộp thư** → Xem email chưa xử lý, chọn nhiều email để xử lý
2. **Đã xử lý** → Xem danh sách email đã phân loại
3. **Chi tiết** → Xem đầy đủ thông tin + phản hồi gợi ý

---

## 🚀 Khởi động hệ thống

### Bước 1: Chạy Backend
```powershell
cd d:\DownloadLT\UIT\jib\my_ai_agent\backend
python run.py
```
✅ Backend sẽ chạy tại http://localhost:5000

### Bước 2: Chạy Frontend
```powershell
cd d:\DownloadLT\UIT\jib\my_ai_agent\frontend
npm start
```
✅ Frontend sẽ mở tại http://localhost:3000

---

## 📧 Bước 1: Hộp thư đến (Inbox)

### Màn hình hiển thị
- **Tiêu đề**: "Hộp thư đến" với số lượng email chưa xử lý
- **Bảng danh sách email** với các cột:
  - ☐ Checkbox để chọn
  - 👤 Người gửi
  - 📄 Tiêu đề
  - 📝 Nội dung (preview)
  - 🕒 Thời gian nhận

### Chức năng

#### ✅ Chọn email
- Click vào **bất kỳ đâu trên hàng** để chọn/bỏ chọn email
- Hoặc click vào **checkbox** riêng lẻ
- Click nút **"Chọn tất cả"** để chọn toàn bộ

#### 🔄 Xử lý email đã chọn
1. Chọn một hoặc nhiều email bằng checkbox
2. Click nút **"Xử lý email đã chọn"** màu tím
3. Hệ thống sẽ hiển thị popup **"Đang xử lý email..."**
4. AI sẽ phân tích từng email:
   - Phân loại (công việc, cá nhân, spam, etc.)
   - Tóm tắt nội dung
   - Đánh giá độ quan trọng
   - Tạo phản hồi gợi ý
5. Sau khi xử lý xong:
   - Thông báo **"Đã xử lý thành công X/Y email!"**
   - Email được chuyển sang tab **"Đã xử lý"**
   - Tự động chuyển sang màn hình **"Đã xử lý"**

#### 🔄 Làm mới danh sách
- Click nút **"Làm mới"** ở góc trên bên phải

### Email mẫu có sẵn (Tiếng Việt)
Hệ thống tự động tải 5 email mẫu bằng tiếng Việt:
1. 👔 **sep@uit.edu.vn** - "KHẨN: Phê duyệt ngân sách quý 4" (Công việc)
2. ☕ **nguyenvana@gmail.com** - "Hẹn cafe cuối tuần này nhé?" (Cá nhân)
3. 📰 **newsletter@techviet.vn** - "Bản tin công nghệ tuần này" (Thông báo)
4. 💳 **billing@techcombank.vn** - "Thông báo: Đến hạn thanh toán thẻ tín dụng" (Tài chính)
5. 📦 **support@shopee.vn** - "Đơn hàng của bạn đang được giao" (Hỗ trợ)

---

## ✅ Bước 2: Danh sách email đã xử lý

### Màn hình hiển thị
- **Tiêu đề**: "Email đã xử lý" với tổng số email
- **Thanh tìm kiếm**: Tìm theo người gửi, tiêu đề, tóm tắt
- **Bộ lọc theo loại**: 8 danh mục với màu sắc riêng
- **Danh sách card**: Hiển thị dạng lưới

### Bộ lọc theo danh mục
Click vào chip để lọc theo loại:
- 🔵 **Công việc** (Work) - Màu xanh dương #1976d2
- 🟣 **Cá nhân** (Personal) - Màu tím #7b1fa2
- 🟠 **Thông báo** (Newsletter) - Màu cam #f57c00
- 🔴 **Spam** - Màu đỏ #c62828
- 🟢 **Tài chính** (Financial) - Màu xanh lá #2e7d32
- 🔴 **Hỗ trợ** (Support) - Màu hồng #c2185b
- 🟡 **Công bố** (Announcement) - Màu lục lam #00695c
- ⚫ **Tất cả** - Hiển thị tất cả email

### Thông tin trên mỗi card
- 🏷️ **Badge loại email**: Màu sắc theo danh mục
- ✅ **Badge trạng thái**: "Đã xử lý" màu xanh
- 👤 **Người gửi**: Avatar + email address
- 📄 **Tiêu đề**: Tối đa 2 dòng
- 📝 **Tóm tắt**: AI-generated summary (3 dòng)
- 🕒 **Thời gian**: Ngày giờ xử lý
- 👁️ **Nút "Xem chi tiết"**: Màu tím

### Chức năng
#### 🔍 Tìm kiếm
- Gõ từ khóa vào ô tìm kiếm
- Tìm trong: người gửi, tiêu đề, tóm tắt
- Kết quả lọc ngay lập tức

#### 👁️ Xem chi tiết
- Click nút **"Xem chi tiết"** trên bất kỳ card nào
- Chuyển sang màn hình chi tiết email

### Thống kê tóm tắt
Hiển thị ở cuối trang:
- 📊 **Tổng số email**: Tổng email đã xử lý
- 👀 **Đang hiển thị**: Số email sau khi lọc
- 📁 **Danh mục**: Số loại email khác nhau

---

## 🔍 Bước 3: Trang chi tiết email

### Nút "Quay lại danh sách"
- Nút màu xám ở trên cùng
- Click để trở về danh sách đã xử lý

### 1. Thông tin email (Card đầu tiên)

#### Tiêu đề
- 📧 **"Chi tiết Email"**
- 🏷️ **Badge loại email**: Hiển thị màu sắc theo danh mục

#### Tiêu đề email
- Font chữ lớn, đậm
- Hiển thị đầy đủ subject

#### Thông tin meta (Grid 2x2 hoặc 2x1)
- 👤 **Người gửi**: Email address
- 🕒 **Thời gian nhận**: Ngày giờ nhận email
- 📧 **Trạng thái**: Badge "Đã xử lý" màu xanh
- 🕒 **Xử lý lúc**: Ngày giờ xử lý (nếu có)

### 2. Tóm tắt nội dung (Card thứ hai)

#### Tóm tắt
- 📝 **"Tóm tắt nội dung"**
- Background màu xám nhạt
- Border trái màu tím
- Nội dung: AI-generated summary

#### Độ quan trọng (nếu có)
- 📊 **"Độ quan trọng"**
- Thanh progress bar ngang:
  - 🔴 Đỏ: 70-100 (Critical)
  - 🟠 Cam: 50-69 (High)
  - 🟡 Vàng: 30-49 (Medium)
  - 🟢 Xanh: 0-29 (Low)
- Hiển thị số điểm: **92/100**

### 3. Phản hồi gợi ý (Card thứ ba) ⭐ **MỚI**

#### Format email đầy đủ
Phản hồi được hiển thị dưới dạng email hoàn chỉnh:

```
┌─────────────────────────────────┐
│ Đến: nguoigui@example.com       │
├─────────────────────────────────┤
│ Chủ đề: Re: Tiêu đề email gốc   │
├─────────────────────────────────┤
│                                 │
│ Nội dung phản hồi được AI       │
│ soạn sẵn, bạn có thể sao chép   │
│ và dán trực tiếp vào Gmail      │
│ hoặc Outlook để gửi.            │
│                                 │
└─────────────────────────────────┘
```

#### 3 nút thao tác chính

**📋 Sao chép email** (Màu xám)
- Sao chép toàn bộ: Đến + Chủ đề + Nội dung
- Format sẵn để dán vào Gmail/Outlook
- Thông báo: "Đã sao chép!" khi thành công
- Tự động reset sau 2 giây

**⏰ Hẹn giờ gửi** (Màu vàng)
- Mở popup chọn thời gian gửi
- **Chọn ngày**: Datepicker với ngày tối thiểu là hôm nay
- **Chọn giờ**: Time picker (format 24h)
- Click **"Xác nhận hẹn giờ"** để lưu lịch gửi
- Click **"Hủy"** hoặc click ngoài popup để đóng
- Email sẽ tự động gửi vào thời gian đã hẹn

**📨 Gửi ngay** (Màu tím)
- Gửi email phản hồi ngay lập tức
- *(Tính năng đang phát triển - hiện tại hiển thị thông báo)*

#### Gợi ý sử dụng
- 💡 **Workflow 1**: Sao chép → Dán vào Gmail → Chỉnh sửa → Gửi thủ công
- 💡 **Workflow 2**: Hẹn giờ gửi → Chọn thời gian → Hệ thống tự động gửi
- 💡 **Workflow 3**: Gửi ngay → Email được gửi tức thì (sắp có)

### 4. Nội dung gốc (Card thu gọn/mở rộng)

#### Nút toggle
- 📄 **"Nội dung gốc"**
- ⬇️ Icon mũi tên: Xuống khi đóng, Lên khi mở
- Click để mở/đóng

#### Khi mở ra
- Background xám nhạt
- Border xám
- Hiển thị toàn bộ body email gốc
- Có scrollbar nếu quá dài (max-height: 400px)

### 5. Thông tin bổ sung (Card cuối - nếu có)

#### Hiển thị thêm (nếu backend trả về)
- 🎭 **Giọng điệu** (tone): Formal, Casual, Urgent, etc.
- 😊 **Cảm xúc** (sentiment): Positive, Neutral, Negative
- 📌 **Điểm chính** (key_points): Danh sách bullet points

---

## 🎨 Màu sắc phân loại email

Hệ thống sử dụng 7 màu để phân biệt các loại email:

| Loại | Tên tiếng Việt | Màu | Mã màu |
|------|----------------|-----|--------|
| Work | Công việc | 🔵 Xanh dương | #1976d2 |
| Personal | Cá nhân | 🟣 Tím | #7b1fa2 |
| Newsletter | Thông báo | 🟠 Cam | #f57c00 |
| Spam | Spam | 🔴 Đỏ | #c62828 |
| Financial | Tài chính | 🟢 Xanh lá | #2e7d32 |
| Support | Hỗ trợ | 🔴 Hồng | #c2185b |
| Announcement | Công bố | 🟡 Lục lam | #00695c |

---

## 📊 Bước 4: Thống kê (Bonus)

Tab **"Thống kê"** hiển thị:
- 📈 Số lượng email theo danh mục
- 📊 Điểm quan trọng trung bình
- 📉 Phân bố theo giọng điệu
- 📅 Lịch sử xử lý

---

## 🔧 Trạng thái và Feedback

### Trạng thái hiển thị

| Trạng thái | Mô tả | Giao diện |
|------------|-------|-----------|
| Đang tải | Lấy danh sách email | Loading spinner |
| Đang xử lý | AI đang phân tích | Popup "Đang xử lý email..." |
| Thành công | Xử lý hoàn tất | Alert "Đã xử lý thành công X/Y email!" |
| Lỗi | Có lỗi xảy ra | Alert "Lỗi khi xử lý email: ..." |

### Feedback người dùng
- ✅ **Checkbox** chuyển màu khi chọn
- 🎯 **Hàng được chọn** có background màu xanh nhạt
- 🔄 **Nút xử lý** hiển thị spinner khi đang xử lý
- ✔️ **Thông báo** khi xử lý thành công
- ❌ **Thông báo lỗi** nếu có vấn đề

---

## 💡 Tips sử dụng

### Tối ưu trải nghiệm
1. **Chọn nhiều email cùng lúc**: Xử lý hàng loạt tiết kiệm thời gian
2. **Dùng bộ lọc**: Nhanh chóng tìm email theo loại
3. **Dùng tìm kiếm**: Gõ từ khóa để lọc email
4. **Sao chép email đầy đủ**: Format sẵn (Đến/Chủ đề/Nội dung) để dán vào Gmail/Outlook
5. **Hẹn giờ gửi**: Lên lịch email quan trọng vào thời điểm phù hợp

### Kịch bản sử dụng
1. ✅ **Sáng đầu ngày**: Chọn tất cả email mới → Xử lý
2. ✅ **Lọc email Công việc**: Xem email quan trọng, hẹn giờ gửi phản hồi
3. ✅ **Lọc email Spam**: Xác nhận spam, xóa nếu cần
4. ✅ **Xem chi tiết email quan trọng**: Copy reply format và gửi
5. ✅ **Hẹn giờ email**: Lên lịch gửi vào 8h sáng hôm sau cho email công việc

### Tính năng mới (v2.0) ⭐
- ✅ **Email tiếng Việt**: Tất cả email mẫu đã được chuyển sang tiếng Việt
- ✅ **Format email đầy đủ**: Hiển thị Đến/Chủ đề/Nội dung trong reply
- ✅ **3 nút thao tác**: Sao chép / Hẹn giờ gửi / Gửi ngay
- ✅ **Hẹn giờ gửi**: Popup chọn ngày giờ với datepicker
- ✅ **Fix UI bị khuất**: Bảng email có thể scroll ngang, header cố định

---

## 🐛 Xử lý sự cố

### Backend không chạy
```powershell
# Kiểm tra MongoDB
services.msc → Tìm MongoDB Server → Đảm bảo Status: Running

# Kiểm tra Gemini API key
# File .env: GEMINI_API_KEY=AIzaSyBvgG0MpPJg7EMNUOBRXLmTynKQiVX5Tt4

# Cài đặt lại dependencies
pip install -r requirements.txt
```

### Frontend lỗi
```powershell
# Cài đặt lại dependencies
npm install

# Xóa cache
npm cache clean --force

# Kiểm tra backend có chạy không
# Backend phải chạy trước ở http://localhost:5000
```

### Lỗi thường gặp
- **"Vui lòng chọn ít nhất một email"**: Bạn chưa chọn email nào
- **"Lỗi khi xử lý email"**: Kiểm tra backend terminal
- **Email không chuyển sang "Đã xử lý"**: Kiểm tra response từ backend
- **Xử lý chậm**: Mỗi email mất 2-3 giây, đợi một chút
- **Bảng email bị khuất**: ✅ **ĐÃ FIX** - Bảng giờ có scroll ngang, header cố định
- **Không thấy nút hẹn giờ**: Đảm bảo đã vào trang chi tiết email
- **Popup hẹn giờ không mở**: Kiểm tra console browser (F12) xem có lỗi không

---

## 📱 Responsive Design

Giao diện tối ưu cho mọi thiết bị:
- 💻 **Desktop (1024px+)**: Bảng đầy đủ, grid 3 cột
- 📱 **Tablet (768-1024px)**: Grid 2 cột
- 📱 **Mobile (<768px)**: Cột đơn, bảng chuyển thành cards

---

## 🎯 Điểm khác biệt so với thiết kế cũ

### ✅ Thiết kế mới (v2.0)
- **2 danh sách riêng biệt**: Chưa xử lý vs Đã xử lý
- **Checkbox**: Chọn nhiều email cùng lúc
- **Thời gian nhận**: Hiển thị rõ ràng
- **Trạng thái rõ ràng**: "Đã xử lý" badge
- **Giao diện tiếng Việt**: Toàn bộ UI và data
- **Email mẫu tiếng Việt**: 5 email với địa chỉ .vn
- **Format email đầy đủ**: Reply có Đến/Chủ đề/Nội dung
- **3 nút thao tác**: Sao chép / Hẹn giờ / Gửi ngay
- **Hẹn giờ gửi**: Popup chọn ngày giờ
- **Fix scroll**: Bảng có scroll ngang, header cố định
- **Workflow thực tế**: Giống email client thật

### ❌ Thiết kế cũ (v1.0)
- Chỉ có thể thêm email thủ công
- Không có checkbox, xử lý từng email
- Không có thời gian nhận
- Không phân biệt processed/unprocessed
- Giao diện tiếng Anh
- Email mẫu tiếng Anh
- Reply chỉ có nội dung text
- Chỉ có 1 nút copy
- Không có tính năng hẹn giờ
- Workflow phức tạp

---

## 🚀 Bắt đầu ngay!

1. ✅ Khởi động backend và frontend
2. ✅ Vào tab **"Hộp thư"** (5 email tiếng Việt đã có sẵn)
3. ✅ Chọn tất cả email → Click **"Xử lý email đã chọn"**
4. ✅ Đợi AI xử lý (~ 10-15 giây cho 5 email)
5. ✅ Xem kết quả trong tab **"Đã xử lý"**
6. ✅ Click **"Xem chi tiết"** bất kỳ email nào
7. ✅ **MỚI**: Xem format email đầy đủ (Đến/Chủ đề/Nội dung)
8. ✅ **MỚI**: Click **"Sao chép email"** để copy toàn bộ
9. ✅ **MỚI**: Click **"Hẹn giờ gửi"** để lên lịch gửi email
10. ✅ Dán vào Gmail/Outlook và gửi!

---

## 📝 Ghi chú kỹ thuật

### Phiên bản 2.0 (Mới nhất) ⭐
- **Ngôn ngữ**: Tiếng Việt hoàn toàn (UI + Data)
- **Email mẫu**: 5 email tiếng Việt với địa chỉ .vn
- **Format reply**: Đầy đủ Đến/Chủ đề/Nội dung
- **Nút thao tác**: 3 nút (Copy/Schedule/Send)
- **Hẹn giờ gửi**: Popup với datepicker + timepicker
- **Fix UI**: Scroll ngang, header cố định

### Kỹ thuật
- **AI Model**: Google Gemini 2.0 Flash
- **Thời gian xử lý**: ~2-3 giây/email
- **Delay giữa các email**: 500ms (tránh rate limiting)
- **Số danh mục**: 7 categories
- **Database**: MongoDB (lưu lịch sử)
- **Icons**: Lucide React (Send, Copy, Clock)

---

## 🎉 Chúc bạn sử dụng hiệu quả!

Hệ thống AI Email Assistant giờ đây đã có giao diện quản lý email thực tế, giúp bạn xử lý email hàng loạt một cách nhanh chóng và hiệu quả!

**Có câu hỏi?** Kiểm tra phần "Xử lý sự cố" ở trên hoặc xem log trong backend terminal.
