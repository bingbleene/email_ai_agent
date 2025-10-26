"""
Reply Agent - Tạo gợi ý email phản hồi.
"""
import sys
import json
import os
from typing import Dict, Any, Optional
from .base_agent import BaseAgent
from utils.openai_client import OpenAIClient
from utils.errors import OpenAIAPIError


class ReplyAgent(BaseAgent):
    """
    Agent tạo gợi ý phản hồi email.
    
    Nhiệm vụ:
    - Soạn mẫu email phản hồi phù hợp với tone
    - Đề xuất cách trả lời dựa trên nội dung
    - Tạo nhiều phiên bản reply (formal, casual, brief)
    """
    
    def __init__(self):
        """Initialize the Reply Agent."""
        super().__init__(name="Reply Agent")
        
        # Initialize OpenAI client
        self.openai_client = OpenAIClient()
        
        # Load tone templates
        self._load_templates()
    
    def _load_templates(self):
        """Load reply templates from configuration."""
        try:
            templates_path = os.path.join(
                os.path.dirname(os.path.dirname(__file__)), 
                'data', 
                'tone_templates.json'
            )
            with open(templates_path, 'r') as f:
                self.templates = json.load(f)
        except Exception as e:
            print(f"Error loading templates: {str(e)}", file=sys.stderr)
            self.templates = {}
    
    def process(self, data: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Generate suggested reply for the email.
        
        Args:
            data: Parsed email data
            context: Context including category, tone, summary, action_items
            
        Returns:
            Dictionary containing suggested replies
        """
        try:
            parsed_email = data.get("parsed_email", data)
            
            # Extract context
            category = context.get("category") if context else "Personal"
            tone = context.get("tone") if context else "neutral"
            summary = context.get("summary") if context else ""
            action_items = context.get("action_items") if context else []
            
            # ALWAYS generate reply for all emails (not just when needs_reply)
            # This allows users to have suggested replies ready for any email
            
            # Generate reply using OpenAI
            system_instruction = f"""
You are a professional email assistant that writes ACTIONABLE and SPECIFIC email replies.

IMPORTANT RULES:
1. DO NOT write generic responses like "I'll review and get back to you"
2. DO provide SPECIFIC answers, solutions, or next steps
3. Address the actual content and questions in the email
4. Be professional but natural in Vietnamese context
5. Match the tone: {tone}
6. Category: {category}

Generate 3 versions of the reply:
1. Brief (2-3 sentences) - Quick but specific response
2. Standard (4-5 sentences) - Professional with details
3. Detailed (6-8 sentences) - Comprehensive with reasoning

Your response MUST be a valid JSON object:
{{
    "brief": "Specific brief reply addressing the email content",
    "standard": "Standard reply with actual answers/solutions",
    "detailed": "Detailed reply with full context and reasoning",
    "subject_reply": "Re: suggested subject"
}}

EXAMPLES OF GOOD VS BAD:
❌ BAD: "Cảm ơn email. Tôi sẽ xem xét và phản hồi."
✅ GOOD: "Về đề xuất ngân sách Q4, tôi đồng ý với số liệu dự kiến 500 triệu cho marketing. Tôi sẽ ký duyệt trong hôm nay."

❌ BAD: "Nhận được email của bạn. Sẽ liên hệ lại sớm."
✅ GOOD: "Mình rảnh thứ 7 chiều này! Hẹn 3h tại Highlands Coffee The Garden nhé. Mình sẽ book bàn trước."

Write replies in Vietnamese when the original email is in Vietnamese.
Do not include any text before or after the JSON.
"""
            
            prompt = f"""
Generate a SPECIFIC and ACTIONABLE email reply for this email:

Original Subject: {parsed_email.get('subject', 'No subject')}
From: {parsed_email.get('sender', {}).get('name', 'Unknown')} <{parsed_email.get('sender', {}).get('email', '')}>

Email Summary: {summary}

Full Original Email Content:
{parsed_email.get('body', '')[:800]}

Action Items Identified: {', '.join(action_items) if action_items else 'None'}

INSTRUCTIONS:
- Read the email carefully
- Address specific questions or requests
- Provide concrete answers or next steps
- If approvals needed: state your decision
- If meetings requested: suggest specific time
- If questions asked: provide actual answers
- Match the language of the original email (Vietnamese/English)
"""
            
            # Get reply from OpenAI
            response = self.openai_client.generate_text(
                prompt=prompt,
                system_instruction=system_instruction,
                temperature=0.7
            )
            
            # Parse JSON response
            reply_data = self.openai_client.parse_json_response(
                response,
                required_fields=["brief", "standard", "detailed", "subject_reply"]
            )
            
            return {
                "agent": self.name,
                "success": True,
                "needs_reply": True,
                "suggested_reply": {
                    "brief": reply_data["brief"],
                    "standard": reply_data["standard"],
                    "detailed": reply_data["detailed"],
                    "subject": reply_data["subject_reply"]
                },
                "tools_used": ["OpenAI"]
            }
            
        except OpenAIAPIError:
            raise
        except Exception as e:
            print(f"Error in Reply Agent: {str(e)}", file=sys.stderr)
            # Fallback to template-based reply
            return self._fallback_reply(data, context)
    
    def _fallback_reply(self, data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Fallback reply using templates - Creates SPECIFIC replies based on category.
        """
        parsed_email = data.get("parsed_email", data)
        category = context.get("category", "Personal") if context else "Personal"
        tone = context.get("tone", "neutral") if context else "neutral"
        subject = parsed_email.get('subject', '')
        sender = parsed_email.get('sender', {}).get('name', 'bạn')
        
        # Create category-specific replies in Vietnamese
        if category == "Work":
            brief = f"Cảm ơn email về '{subject}'. Tôi đã xem xét nội dung và sẽ thực hiện các bước cần thiết. Nếu có thắc mắc gì, tôi sẽ liên hệ lại ngay."
            standard = f"Kính gửi {sender},\n\nCảm ơn bạn đã gửi email về '{subject}'. Tôi đã nắm được các yêu cầu và sẽ ưu tiên xử lý trong thời gian sớm nhất. Dự kiến hoàn thành trong vòng 1-2 ngày làm việc.\n\nNếu có bất kỳ thông tin bổ sung nào, vui lòng cho tôi biết.\n\nTrân trọng"
            detailed = f"Kính gửi {sender},\n\nCảm ơn bạn đã gửi email về '{subject}'.\n\nTôi đã xem xét kỹ các nội dung và yêu cầu trong email. Tôi hiểu đây là vấn đề quan trọng và sẽ ưu tiên xử lý ngay.\n\nKế hoạch của tôi:\n1. Xem xét chi tiết các tài liệu/thông tin liên quan\n2. Thực hiện các hành động cần thiết\n3. Cập nhật tiến độ cho bạn trong vòng 1-2 ngày\n\nNếu có bất kỳ thông tin bổ sung hoặc yêu cầu gấp, đừng ngại liên hệ trực tiếp với tôi.\n\nTrân trọng"
        
        elif category == "Personal":
            brief = f"Chào {sender}! Cảm ơn bạn đã nhắn. Về '{subject}', mình đồng ý và sẽ sắp xếp phù hợp. Hẹn sớm gặp lại bạn nhé!"
            standard = f"Chào {sender},\n\nCảm ơn bạn đã gửi tin nhắn! Về '{subject}', mình rất vui và sẽ cố gắng sắp xếp thời gian phù hợp.\n\nMình sẽ xác nhận lại với bạn trong thời gian sớm nhất nhé. Nếu có gì thay đổi, mình sẽ báo bạn trước.\n\nHẹn sớm gặp lại!"
            detailed = f"Chào {sender},\n\nRất vui khi nhận được tin nhắn của bạn về '{subject}'!\n\nMình đã đọc kỹ nội dung và thấy rất hay. Mình hoàn toàn đồng ý với đề xuất của bạn và sẽ sắp xếp thời gian phù hợp nhất.\n\nMình sẽ kiểm tra lịch trình và xác nhận lại với bạn trong hôm nay hoặc ngày mai. Nếu có bất kỳ thay đổi nào, mình sẽ báo bạn biết trước.\n\nCảm ơn bạn đã nghĩ đến mình. Hẹn sớm gặp lại nhé!"
        
        elif category == "Financial":
            brief = f"Đã nhận được thông báo về '{subject}'. Tôi sẽ kiểm tra và thanh toán đúng hạn. Cảm ơn đã nhắc nhở."
            standard = f"Kính gửi,\n\nCảm ơn đã gửi thông báo về '{subject}'.\n\nTôi đã ghi nhận thông tin và sẽ thực hiện thanh toán đúng hạn như yêu cầu. Nếu có bất kỳ vấn đề gì phát sinh, tôi sẽ liên hệ trực tiếp.\n\nTrân trọng"
            detailed = f"Kính gửi,\n\nCảm ơn đã gửi thông báo về '{subject}'.\n\nTôi đã nhận được và ghi nhận đầy đủ các thông tin:\n- Số tiền cần thanh toán\n- Thời hạn thanh toán\n- Phương thức thanh toán\n\nTôi sẽ thực hiện thanh toán đúng hạn qua phương thức đã đăng ký. Nếu có bất kỳ thay đổi hoặc vấn đề gì phát sinh, tôi sẽ liên hệ trực tiếp với bộ phận hỗ trợ.\n\nTrân trọng"
        
        elif category == "Support":
            brief = f"Cảm ơn đã hỗ trợ về '{subject}'. Thông tin rất hữu ích. Nếu cần thêm hỗ trợ, tôi sẽ liên hệ lại."
            standard = f"Xin chào,\n\nCảm ơn đội ngũ hỗ trợ đã gửi thông tin về '{subject}'.\n\nThông tin bạn cung cấp rất hữu ích và giúp tôi giải quyết được vấn đề. Nếu có bất kỳ thắc mắc gì thêm, tôi sẽ liên hệ lại.\n\nCảm ơn sự hỗ trợ nhiệt tình!"
            detailed = f"Xin chào,\n\nCảm ơn đội ngũ hỗ trợ đã gửi thông tin chi tiết về '{subject}'.\n\nTôi đã đọc kỹ hướng dẫn và thông tin bạn cung cấp. Các bước giải quyết rất rõ ràng và giúp tôi hiểu rõ hơn về vấn đề đang gặp phải.\n\nTôi sẽ thực hiện theo hướng dẫn và theo dõi tình hình. Nếu vấn đề vẫn còn hoặc có thắc mắc gì thêm, tôi sẽ liên hệ lại với đội hỗ trợ.\n\nCảm ơn sự hỗ trợ nhiệt tình và chuyên nghiệp!"
        
        elif category == "Newsletter" or category == "Announcement":
            brief = f"Cảm ơn đã chia sẻ thông tin về '{subject}'. Nội dung rất hữu ích và thú vị!"
            standard = f"Xin chào,\n\nCảm ơn đã gửi thông tin về '{subject}'.\n\nNội dung rất hữu ích và cập nhật. Tôi đánh giá cao việc được nhận những thông tin chất lượng như vậy.\n\nMong được tiếp tục nhận những bản tin trong tương lai!"
            detailed = standard  # Newsletter/Announcement thường không cần reply chi tiết
        
        else:  # Spam or other
            brief = f"Đã nhận được email về '{subject}'. Cảm ơn."
            standard = f"Xin chào,\n\nĐã nhận được email của bạn về '{subject}'.\n\nCảm ơn đã gửi thông tin. Nếu có nội dung liên quan đến tôi, tôi sẽ xem xét và phản hồi khi cần thiết.\n\nTrân trọng"
            detailed = standard
        
        return {
            "agent": self.name,
            "success": True,
            "needs_reply": True,
            "suggested_reply": {
                "brief": brief,
                "standard": standard,
                "detailed": detailed,
                "subject": "Re: " + subject
            },
            "tools_used": ["Template-Fallback"]
        }
