"""
Test script để kiểm tra reply agent mới
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agents.reply_agent import ReplyAgent

def test_reply_agent():
    """Test reply agent với email mẫu tiếng Việt"""
    
    agent = ReplyAgent()
    
    # Test case 1: Email công việc khẩn
    print("=" * 60)
    print("TEST 1: Email công việc khẩn cấp")
    print("=" * 60)
    
    work_email = {
        "parsed_email": {
            "sender": {"name": "Sếp", "email": "sep@uit.edu.vn"},
            "subject": "KHẨN: Phê duyệt ngân sách quý 4",
            "body": """Chào bạn,

Tôi cần bạn phê duyệt đề xuất ngân sách Q4 trước 5 giờ chiều nay. 
Vui lòng xem xét tài liệu đính kèm và cho tôi biết nếu có bất kỳ thắc mắc nào.

Các khoản chính:
- Marketing: 500 triệu
- Nhân sự: 300 triệu  
- Công nghệ: 200 triệu

Cảm ơn bạn!"""
        }
    }
    
    context = {
        "category": "Work",
        "tone": "formal",
        "summary": "Sếp yêu cầu phê duyệt ngân sách Q4 trước 5h chiều",
        "action_items": ["Phê duyệt ngân sách", "Xem tài liệu đính kèm"]
    }
    
    result = agent.process(work_email, context)
    
    if result["success"]:
        print("\n✅ Reply Agent thành công!\n")
        reply = result["suggested_reply"]
        
        print("📝 BRIEF VERSION:")
        print(reply["brief"])
        print("\n" + "-" * 60)
        
        print("\n📝 STANDARD VERSION:")
        print(reply["standard"])
        print("\n" + "-" * 60)
        
        print("\n📝 DETAILED VERSION:")
        print(reply["detailed"])
        print("\n" + "=" * 60)
    else:
        print(f"\n❌ Lỗi: {result.get('error', 'Unknown error')}")
    
    # Test case 2: Email cá nhân
    print("\n\nTEST 2: Email cá nhân - Hẹn cafe")
    print("=" * 60)
    
    personal_email = {
        "parsed_email": {
            "sender": {"name": "Nguyễn Văn A", "email": "nguyenvana@gmail.com"},
            "subject": "Hẹn cafe cuối tuần này nhé?",
            "body": """Chào bạn!

Lâu rồi không gặp. Mình hẹn đi cafe chiều thứ 7 này được không? 
Khoảng 3 giờ chiều tại Highlands Coffee The Garden nhé.

Hy vọng bạn rảnh!"""
        }
    }
    
    context2 = {
        "category": "Personal",
        "tone": "casual",
        "summary": "Bạn hẹn đi cafe chiều thứ 7",
        "action_items": ["Xác nhận lịch hẹn"]
    }
    
    result2 = agent.process(personal_email, context2)
    
    if result2["success"]:
        print("\n✅ Reply Agent thành công!\n")
        reply2 = result2["suggested_reply"]
        
        print("📝 BRIEF VERSION:")
        print(reply2["brief"])
        print("\n" + "-" * 60)
        
        print("\n📝 STANDARD VERSION:")
        print(reply2["standard"])
        print("\n" + "=" * 60)
    else:
        print(f"\n❌ Lỗi: {result2.get('error', 'Unknown error')}")

if __name__ == "__main__":
    print("\n🧪 Testing Improved Reply Agent")
    print("Kiểm tra xem AI có tạo reply thực tế thay vì chỉ 'Tôi sẽ xem xét'...\n")
    
    test_reply_agent()
    
    print("\n\n✅ Test hoàn tất!")
    print("Nếu thấy reply cụ thể (ví dụ: 'Tôi đồng ý', 'Mình rảnh thứ 7'), nghĩa là đã thành công! 🎉")
