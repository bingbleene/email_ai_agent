/**
 * Main App Component
 * AI Email Assistant Frontend - Redesigned with Inbox Management
 */
import React, { useState, useEffect } from 'react';
import UnprocessedInbox from './components/UnprocessedInbox';
import ProcessedList from './components/ProcessedList';
import EmailDetailView from './components/EmailDetailView';
import Statistics from './components/Statistics';
import { emailApi } from './services/api';
import { Mail, Activity, Inbox, CheckCircle, BarChart2, Plus } from 'lucide-react';
import './styles/App.css';
import './styles/Statistics.css';

function App() {
  const [userId, setUserId] = useState('');
  const [activeView, setActiveView] = useState('inbox'); // inbox, processed, detail, stats
  const [unprocessedEmails, setUnprocessedEmails] = useState([]);
  const [processedEmails, setProcessedEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddEmailModal, setShowAddEmailModal] = useState(false);

  // Sample unprocessed emails for demo - 15 emails với nhiều tình huống
  const sampleEmails = [
    {
      id: 'sample-1',
      sender: 'sep@uit.edu.vn',
      subject: 'KHẨN: Phê duyệt ngân sách quý 4',
      body: 'Chào bạn,\n\nTôi cần bạn phê duyệt đề xuất ngân sách Q4 trước 5 giờ chiều nay. Vui lòng xem xét tài liệu đính kèm và cho tôi biết nếu có bất kỳ thắc mắc nào.\n\nCảm ơn bạn!',
      received_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    {
      id: 'sample-2',
      sender: 'nguyenvana@gmail.com',
      subject: 'Hẹn cafe cuối tuần này nhé?',
      body: 'Chào bạn!\n\nLâu rồi không gặp. Mình hẹn đi cafe chiều thứ 7 này được không? Khoảng 3 giờ chiều tại Highlands Coffee The Garden nhé.\n\nHy vọng bạn rảnh!',
      received_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
    },
    {
      id: 'sample-3',
      sender: 'newsletter@techviet.vn',
      subject: 'Bản tin công nghệ tuần này - Đột phá AI mới',
      body: 'Bản tin công nghệ hàng tuần của bạn đã đến!\n\nTuần này: Những đột phá mới về AI, ra mắt smartphone flagship, và cập nhật về cloud computing. Đọc ngay để không bỏ lỡ tin tức công nghệ hot nhất!',
      received_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
      id: 'sample-4',
      sender: 'billing@techcombank.vn',
      subject: 'Thông báo: Đến hạn thanh toán thẻ tín dụng',
      body: 'Kính gửi Quý khách,\n\nSố tiền thanh toán tối thiểu của thẻ tín dụng là 2.500.000 VNĐ, đến hạn ngày 25/10/2025. Vui lòng thanh toán đúng hạn để tránh phí phạt.\n\nTrân trọng,\nTechcombank',
      received_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      id: 'sample-5',
      sender: 'support@shopee.vn',
      subject: 'Đơn hàng của bạn đang được giao',
      body: 'Xin chào!\n\nĐơn hàng #SH12345 của bạn đã được giao cho đơn vị vận chuyển và sẽ đến trong 2-3 ngày làm việc. Bạn có thể theo dõi đơn hàng qua link bên dưới.\n\nCảm ơn bạn đã mua sắm tại Shopee!',
      received_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    },
    {
      id: 'sample-6',
      sender: 'hr@fpt.com.vn',
      subject: 'Mời phỏng vấn vòng 2 - Vị trí Senior Developer',
      body: 'Kính gửi ứng viên,\n\nChúng tôi rất vui mừng thông báo bạn đã vượt qua vòng 1. Vòng phỏng vấn 2 sẽ diễn ra vào 9h sáng thứ 5 tuần sau tại văn phòng FPT Tower.\n\nVui lòng xác nhận tham dự.\n\nTrân trọng,\nPhòng Nhân Sự',
      received_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
    },
    {
      id: 'sample-7',
      sender: 'noreply@lazada.vn',
      subject: '🎉 Flash Sale 50% - Chỉ 2 giờ duy nhất!',
      body: 'FLASH SALE SIÊU HỜI! 🔥\n\nGiảm 50% toàn bộ sản phẩm điện tử trong 2 giờ!\n\n⏰ Từ 20:00 - 22:00 tối nay\n💳 Giảm thêm 200K cho đơn từ 1 triệu\n🚚 Freeship toàn quốc\n\nNhanh tay kẻo hết!',
      received_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
    },
    {
      id: 'sample-8',
      sender: 'security@vnpay.vn',
      subject: 'Cảnh báo: Phát hiện đăng nhập bất thường',
      body: 'Kính gửi Quý khách,\n\nHệ thống phát hiện đăng nhập từ địa chỉ IP lạ vào lúc 14:30 hôm nay. Nếu đây không phải là bạn, vui lòng đổi mật khẩu ngay lập tức.\n\nĐịa điểm: Hà Nội\nThiết bị: Windows PC\n\nBảo mật tài khoản của bạn!',
      received_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
    },
    {
      id: 'sample-9',
      sender: 'alumni@uit.edu.vn',
      subject: 'Thông báo: Gặp mặt cựu sinh viên K19 - Ngày 28/10',
      body: 'Thân gửi các bạn cựu sinh viên K19,\n\nKhoa CNTT sẽ tổ chức buổi gặp mặt cựu sinh viên vào ngày 28/10/2025 tại hội trường A.\n\nChương trình:\n- Chia sẻ kinh nghiệm nghề nghiệp\n- Giao lưu và networking\n- Tiệc buffet\n\nMong các bạn sắp xếp tham dự!',
      received_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() // 18 hours ago
    },
    {
      id: 'sample-10',
      sender: 'admin@coursera.org',
      subject: 'Chứng chỉ "AI for Everyone" đã sẵn sàng!',
      body: 'Congratulations!\n\nBạn đã hoàn thành khóa học "AI for Everyone" với điểm số xuất sắc. Chứng chỉ của bạn đã sẵn sàng để tải xuống.\n\n📜 Xem chứng chỉ\n🔗 Chia sẻ lên LinkedIn\n\nChúc mừng thành tích của bạn!',
      received_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
    },
    {
      id: 'sample-11',
      sender: 'lottery@vietlott.vn',
      subject: 'Chúc mừng! Bạn trúng giải may mắn 50 triệu đồng',
      body: 'CHÚC MỪNG QUÝ KHÁCH!\n\nEmail của bạn được chọn ngẫu nhiên trong chương trình quay số may mắn. Bạn đã trúng 50.000.000 VNĐ!\n\nĐể nhận thưởng, vui lòng cung cấp:\n- CMND/CCCD\n- Số tài khoản ngân hàng\n- Phí xử lý: 5.000.000 VNĐ\n\nLiên hệ ngay: 0123456789',
      received_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8 hours ago
    },
    {
      id: 'sample-12',
      sender: 'pmproject@vng.com.vn',
      subject: 'Họp review sprint - Thứ 3 lúc 2PM',
      body: 'Hi team,\n\nChúng ta sẽ có buổi họp review sprint vào thứ 3 tuần này lúc 2PM tại phòng họp 301.\n\nAgenda:\n- Demo tính năng mới\n- Retrospective\n- Planning sprint tiếp theo\n\nChuẩn bị demo của các bạn nhé!\n\nThanks,\nPM',
      received_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000).toISOString() // 1 day 3 hours ago
    },
    {
      id: 'sample-13',
      sender: 'health@medlatec.vn',
      subject: 'Kết quả xét nghiệm sức khỏe định kỳ',
      body: 'Kính gửi Quý khách,\n\nKết quả xét nghiệm sức khỏe định kỳ của bạn đã có. Các chỉ số đều nằm trong giới hạn bình thường.\n\nChi tiết:\n- Huyết áp: 120/80 mmHg (Bình thường)\n- Đường huyết: 95 mg/dL (Bình thường)\n- Cholesterol: 180 mg/dL (Bình thường)\n\nHẹn gặp lại bạn trong đợt khám kế tiếp!',
      received_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000).toISOString() // 2 days 5 hours ago
    },
    {
      id: 'sample-14',
      sender: 'events@googlevn.com',
      subject: 'Mời tham dự: Google Cloud Summit Vietnam 2025',
      body: 'Xin chào,\n\nGoogle Cloud sẽ tổ chức sự kiện Summit Vietnam 2025 vào ngày 15/11 tại JW Marriott Hanoi.\n\nHighlights:\n🎯 Keynote từ Google Cloud Leaders\n🚀 Workshops về AI/ML, Data Analytics\n🤝 Networking với 500+ IT professionals\n🎁 Quà tặng hấp dẫn\n\nĐăng ký miễn phí: [Link]\n\nSố lượng có hạn!',
      received_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
    },
    {
      id: 'sample-15',
      sender: 'tranthib@yahoo.com',
      subject: 'Nhờ review code pull request #234',
      body: 'Chào anh/chị,\n\nEm vừa tạo pull request #234 để implement tính năng email scheduling. Anh/chị có thể review giúp em được không ạ?\n\nChanges:\n- Thêm API endpoint /api/schedule\n- UI modal chọn thời gian\n- Unit tests\n\nEm cảm ơn anh/chị nhiều!\n\nTrân trọng,\nTrần Thị B',
      received_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString() // 7 hours ago
    },
    {
      id: 'sample-16',
      sender: 'ceo@techstartup.vn',
      subject: 'Đề xuất hợp tác chiến lược - Dự án AI Email Assistant',
      body: `Kính gửi Anh/Chị,

Tôi là Nguyễn Văn An, CEO của TechStartup Vietnam. Chúng tôi đã theo dõi dự án AI Email Assistant của team anh/chị và rất ấn tượng với những tính năng thông minh mà hệ thống cung cấp.

SAU KHI NGHIÊN CỨU KỸ CÀNG, chúng tôi nhận thấy có tiềm năng hợp tác rất lớn giữa hai bên. TechStartup hiện đang phục vụ hơn 500 doanh nghiệp SME tại Việt Nam với nền tảng quản lý khách hàng CRM. Khách hàng của chúng tôi đang gặp khó khăn trong việc xử lý hàng trăm email mỗi ngày từ customers, partners và suppliers.

CÁC ĐIỂM NỔI BẬT CỦA ĐỀ XUẤT:

1. TÍCH HỢP TECHNICAL:
   - Tích hợp AI Email Assistant vào CRM platform của chúng tôi
   - API endpoints để xử lý batch emails (lên tới 1000 emails/ngày)
   - Dashboard analytics để track email performance
   - Customizable categories phù hợp với từng ngành nghiệp

2. BUSINESS MODEL:
   - Revenue sharing: 60-40 (60% cho team phát triển AI, 40% cho TechStartup)
   - Subscription-based pricing: 500K-2M VNĐ/tháng tùy package
   - Estimated revenue: 200-500 triệu VNĐ/tháng sau 6 tháng launch
   - Enterprise customers sẽ được tính riêng với giá cao hơn

3. MARKETING & GROWTH:
   - TechStartup có sales team 20 người để approach khách hàng
   - Hiện tại có 500 active customers sẵn sàng dùng thử
   - Network với 50+ doanh nghiệp enterprise (Vingroup, FPT, Viettel...)
   - Budget marketing 200 triệu VNĐ/quý cho campaigns

4. ROADMAP IMPLEMENTATION:
   - Phase 1 (Tháng 1-2): POC với 10 pilot customers
   - Phase 2 (Tháng 3-4): Beta launch cho 50 SME customers
   - Phase 3 (Tháng 5-6): Official launch với full features
   - Phase 4 (Tháng 7-12): Scale to 500+ customers

5. SUPPORT & MAINTENANCE:
   - TechStartup sẽ handle customer support 24/7
   - Team phát triển focus vào improving AI models
   - Monthly meetings để review performance & feedback
   - Quarterly planning cho new features

CONCERNS CẦN BÀN:
- Infrastructure scaling: Cần discuss về cloud hosting (AWS vs GCP)
- Data privacy: Làm sao đảm bảo email data của khách hàng an toàn
- API rate limiting: Cần tăng từ 100 emails/day lên 10000 emails/day
- Customization: Mỗi customer có thể cần custom categories riêng
- SLA commitments: Response time, uptime guarantees

ĐỀ XUẤT CUỘC HỌP:
Tôi muốn đề xuất một buổi meeting vào tuần sau để discuss chi tiết hơn. Chúng ta có thể:
- Demo live sản phẩm hiện tại của cả hai bên
- Whiteboard session về technical architecture
- Discuss về contract terms và timeline
- Q&A session để clarify concerns

Tôi có thể sắp xếp meeting vào:
- Thứ 3 (22/10) lúc 2PM hoặc 4PM
- Thứ 5 (24/10) lúc 9AM hoặc 3PM
- Địa điểm: Văn phòng TechStartup tại Bitexco Tower hoặc online qua Zoom

ATTACHED DOCUMENTS:
- Company profile của TechStartup (PDF)
- Market research về email management needs (Excel)
- Draft proposal với detailed financial projections (PowerPoint)
- Technical requirements document (Word)

Tôi rất mong được nhận feedback từ anh/chị về đề xuất này. Nếu có bất kỳ câu hỏi nào, xin đừng ngại liên hệ trực tiếp qua:
- Email: ceo@techstartup.vn
- Phone: 0901 234 567
- LinkedIn: linkedin.com/in/nguyenvanan

Chúc anh/chị một ngày làm việc hiệu quả!

Trân trọng,
Nguyễn Văn An
CEO - TechStartup Vietnam
"Transforming Businesses Through Technology"`,
      received_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() // 10 hours ago
    },
    {
      id: 'sample-17',
      sender: 'professor@uit.edu.vn',
      subject: 'Phản hồi về đồ án tốt nghiệp - Cần chỉnh sửa và bổ sung',
      body: `Chào em Nguyễn Văn B,

Thầy đã xem xét kỹ báo cáo đồ án tốt nghiệp "AI Email Assistant - Multi-Agent System" mà em nộp hôm 15/10. Nhìn chung, đây là một đề tài rất hay và có tính ứng dụng cao. Tuy nhiên, thầy có một số nhận xét và yêu cầu chỉnh sửa để em hoàn thiện hơn trước khi bảo vệ.

ĐIỂM MẠNH CỦA ĐỒ ÁN:

1. Ý TƯỞNG VÀ ĐỘNG LỰC:
   ✓ Đề tài giải quyết vấn đề thực tế (email overload)
   ✓ Ứng dụng multi-agent architecture một cách sáng tạo
   ✓ Có khảo sát nhu cầu từ 50 người dùng thực tế
   ✓ Literature review tốt với 30+ papers liên quan

2. TECHNICAL IMPLEMENTATION:
   ✓ Architecture design rõ ràng với 5 specialized agents
   ✓ Code quality tốt, có comments và documentation đầy đủ
   ✓ Integration với Gemini AI API thành công
   ✓ Frontend UX design khá tốt, responsive và user-friendly
   ✓ Testing coverage đạt 70% cho backend

3. KẾT QUẢ THỰC NGHIỆM:
   ✓ Accuracy classification: 92% trên test set 500 emails
   ✓ Summarization quality: 4.2/5 điểm từ user evaluation
   ✓ Reply generation relevance: 85% được đánh giá là phù hợp
   ✓ Processing time: 2-3 giây/email là acceptable

NHỮNG VẤN ĐỀ CẦN CHỈNH SỬA VÀ BỔ SUNG:

1. CHƯƠNG 1 - GIỚI THIỆU (trang 5-15):
   ❌ Phần "Tính cấp thiết của đề tài" còn chung chung
   → Cần thêm statistics cụ thể về email volume tại VN
   → Cite thêm research về productivity loss do email
   
   ❌ Phần "Mục tiêu nghiên cứu" chưa đủ specific
   → Cần quantify targets: "Đạt accuracy >90%", "Processing time <3s"
   → Thêm success criteria rõ ràng

2. CHƯƠNG 2 - CƠ SỞ LÝ THUYẾT (trang 16-40):
   ❌ Phần "Multi-Agent Systems" thiếu depth
   → Cần explain coordination mechanisms chi tiết hơn
   → Thêm diagrams về agent communication flow
   → So sánh với single-agent approach
   
   ❌ Phần "Natural Language Processing" quá ngắn
   → Cần cover: tokenization, embedding, attention mechanisms
   → Explain cụ thể về Gemini 2.0 Flash architecture
   → Discuss về prompt engineering techniques
   
   ❌ Related Work comparison table (trang 28) chưa đủ
   → Thêm ít nhất 5 systems tương tự để compare
   → Highlight những điểm khác biệt của approach của em

3. CHƯƠNG 3 - PHƯƠNG PHÁP (trang 41-70):
   ❌ System Architecture diagram (Hình 3.1) cần redraw
   → Font chữ quá nhỏ, khó đọc
   → Cần thêm màu sắc để distinguish các components
   → Label các API endpoints rõ ràng hơn
   
   ❌ Database schema (Hình 3.4) thiếu details
   → Cần show indexes, foreign keys
   → Explain normalization strategy
   → Thêm estimated data volume
   
   ❌ Algorithms pseudocode cần improvement:
   → Algorithm 3.1 (ImportanceScoring) cần comments
   → Algorithm 3.2 (ToneAnalysis) chưa handle edge cases
   → Thêm complexity analysis (Big-O notation)

4. CHƯƠNG 4 - THỰC NGHIỆM (trang 71-95):
   ❌ Dataset description thiếu thông tin:
   → Em chỉ nói "500 emails" nhưng không nói source
   → Cần explain data collection process
   → Thêm statistics: email lengths, category distribution
   → Discuss về potential bias trong data
   
   ❌ Evaluation metrics cần expand:
   → Thêm Precision, Recall, F1-score cho classification
   → ROUGE scores cho summarization
   → BLEU scores cho reply generation
   → User satisfaction metrics chi tiết hơn
   
   ❌ Comparison với baseline models:
   → Cần so sánh với simple keyword-based classifier
   → Compare với GPT-3.5 hoặc GPT-4 nếu có thể
   → Ablation study: test từng agent riêng lẻ
   
   ❌ Error analysis section bị thiếu:
   → Cần analyze failure cases
   → Categorize types of errors
   → Propose improvements

5. CHƯƠNG 5 - KẾT LUẬN (trang 96-105):
   ❌ Phần "Hạn chế" quá ngắn:
   → Cần honest về limitations
   → Scalability concerns (1000+ emails/day)
   → Cost analysis với API calls
   → Privacy và security concerns
   
   ❌ Phần "Hướng phát triển" cần concrete hơn:
   → Thay vì "cải thiện accuracy", nói "apply fine-tuning on domain data"
   → Specific features: email threading, attachment handling
   → Timeline cho từng phase development

ĐỊNH DẠNG VÀ TRÌNH BÀY:

- Trang 23: Reference [12] format sai, cần sửa theo IEEE style
- Trang 45, 67, 89: Figures không có captions đầy đủ
- Trang 78: Table 4.2 bị overflow ra ngoài margin
- Code listings: Cần consistent về indentation và syntax highlighting
- Bibliography: Thiếu 5-7 papers quan trọng về email classification
- Appendix: Cần thêm user survey questionnaire và raw results

TIMELINE ĐỂ CHỈNH SỬA:

Thầy đề xuất em hoàn thành các chỉnh sửa theo schedule sau:
- 22/10 (Thứ 2): Complete Chương 1 và 2 revisions
- 24/10 (Thứ 4): Complete Chương 3 revisions + redraw diagrams
- 26/10 (Thứ 6): Complete Chương 4 với full experiments
- 28/10 (CN): Complete Chương 5 và formatting fixes
- 30/10 (Thứ 3): Submit revised version cho thầy review lần 2

Nếu em hoàn thành tốt các revisions này, thầy sẽ approve để em bảo vệ vào đầu tháng 11.

MEETING TRONG TUẦN:

Thầy sắp xếp gặp em vào:
- Thứ 3 (22/10) lúc 3PM tại phòng H6.705 để discuss Chương 2 và 3
- Thứ 6 (25/10) lúc 10AM để review experiments và results

Mang theo laptop để có thể chạy demo trực tiếp nhé.

KẾT LUẬN:

Nhìn chung, đồ án của em có potential để đạt điểm khá/giỏi nếu em chỉnh sửa kỹ càng. Đây là một công trình nghiêm túc và thầy đánh giá cao effort mà em đã bỏ ra. Tuy nhiên, một báo cáo tốt nghiệp cần rigorous về mặt academic và complete về mặt technical documentation.

Nếu có câu hỏi gì, em cứ email hoặc nhắn tin cho thầy. Thầy luôn sẵn sàng support em.

Chúc em làm việc hiệu quả!

Trân trọng,
PGS.TS. Nguyễn Văn Hùng
Giảng viên hướng dẫn
Khoa Công nghệ Thông tin - UIT
Email: professor@uit.edu.vn
Phone: 028 3724 xxxx (ext. 105)`,
      received_at: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString() // 15 hours ago
    }
  ];

  // Load userId from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem('email_assistant_user_id');
    if (savedUserId) {
      setUserId(savedUserId);
    } else {
      // Generate new user ID
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setUserId(newUserId);
      localStorage.setItem('email_assistant_user_id', newUserId);
    }
    
    // Load sample emails for demo
    setUnprocessedEmails(sampleEmails);
  }, []);

  // Check health status on mount
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const response = await emailApi.healthCheck();
      setHealthStatus(response);
    } catch (err) {
      console.error('Health check failed:', err);
    }
  };

  const handleProcessSelected = async (emailsToProcess) => {
    try {
      setProcessing(true);
      
      const results = [];
      const emailIds = emailsToProcess.map(e => e.id);
      
      for (let i = 0; i < emailsToProcess.length; i++) {
        const email = emailsToProcess[i];
        
        try {
          const response = await emailApi.processEmail({
            user_id: userId,
            sender: email.sender,
            subject: email.subject,
            body: email.body
          });
          
          if (response.success && response.data) {
            results.push({
              ...response.data,
              id: response.data.id || `processed-${Date.now()}-${i}`,
              sender: email.sender,
              subject: email.subject,
              body: email.body,
              received_at: email.received_at,
              processed_at: new Date().toISOString()
            });
          }
        } catch (err) {
          console.error(`Error processing email ${i + 1}:`, err);
        }
        
        // Small delay to avoid rate limiting
        if (i < emailsToProcess.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // Remove processed emails from unprocessed list
      setUnprocessedEmails(prev => prev.filter(e => !emailIds.includes(e.id)));
      
      // Add to processed list
      setProcessedEmails(prev => [...results, ...prev]);
      
      // Switch to processed view
      setActiveView('processed');
      
      alert(`Đã xử lý thành công ${results.length}/${emailsToProcess.length} email!`);
      
      setRefreshKey(prev => prev + 1);
      
    } catch (err) {
      console.error('Batch processing error:', err);
      alert('Lỗi khi xử lý email: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleViewDetail = (email) => {
    setSelectedEmail(email);
    setActiveView('detail');
  };

  const handleBackToList = () => {
    setSelectedEmail(null);
    setActiveView('processed');
  };

  const handleRefreshInbox = () => {
    // In a real app, this would fetch from server
    alert('Danh sách đã được làm mới!');
    setRefreshKey(prev => prev + 1);
  };

  const handleAddEmail = () => {
    setShowAddEmailModal(true);
  };

  const resetUserId = () => {
    if (window.confirm('Đặt lại ID người dùng? Điều này sẽ xóa toàn bộ dữ liệu.')) {
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setUserId(newUserId);
      localStorage.setItem('email_assistant_user_id', newUserId);
      setUnprocessedEmails(sampleEmails);
      setProcessedEmails([]);
      setSelectedEmail(null);
      setActiveView('inbox');
      setRefreshKey((prev) => prev + 1);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Mail size={32} />
            <h1>AI Email Assistant</h1>
          </div>
          <div className="header-right">
            {healthStatus && (
              <div className={`health-indicator ${healthStatus.status === 'healthy' ? 'healthy' : 'unhealthy'}`}>
                <Activity size={16} />
                <span>{healthStatus.status}</span>
              </div>
            )}
            <div className="user-info">
              <small>User ID: {userId.substring(0, 20)}...</small>
              <button onClick={resetUserId} className="btn-text">
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs">
          <button
            className={`tab ${activeView === 'inbox' ? 'active' : ''}`}
            onClick={() => setActiveView('inbox')}
          >
            <Inbox size={18} />
            Hộp thư ({unprocessedEmails.length})
          </button>
          <button
            className={`tab ${activeView === 'processed' ? 'active' : ''}`}
            onClick={() => setActiveView('processed')}
          >
            <CheckCircle size={18} />
            Đã xử lý ({processedEmails.length})
          </button>
          <button
            className={`tab ${activeView === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveView('stats')}
          >
            <BarChart2 size={18} />
            Thống kê
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="container">
          {/* Unprocessed Inbox View */}
          {activeView === 'inbox' && (
            <UnprocessedInbox 
              emails={unprocessedEmails}
              onProcessSelected={handleProcessSelected}
              processing={processing}
              onRefresh={handleRefreshInbox}
              onAddEmail={handleAddEmail}
            />
          )}

          {/* Processed Emails List */}
          {activeView === 'processed' && (
            <ProcessedList
              emails={processedEmails}
              onViewDetail={handleViewDetail}
            />
          )}

          {/* Email Detail View */}
          {activeView === 'detail' && selectedEmail && (
            <EmailDetailView
              email={selectedEmail}
              onBack={handleBackToList}
            />
          )}

          {/* Statistics Tab */}
          {activeView === 'stats' && (
            <Statistics userId={userId} refresh={refreshKey} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          AI Email Assistant • Powered by Google Gemini AI • Multi-Agent Architecture
        </p>
        <small>
          Classification • Summarization • Importance Scoring • Tone Analysis • Reply
          Generation
        </small>
      </footer>
    </div>
  );
}

export default App;
