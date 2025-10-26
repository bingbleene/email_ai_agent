"""
Summarizer Agent - Tóm tắt nội dung email.
"""
import sys
from typing import Dict, Any, Optional
from .base_agent import BaseAgent
from utils.openai_client import OpenAIClient
from utils.errors import OpenAIAPIError


class SummarizerAgent(BaseAgent):
    """
    Agent chuyên tóm tắt email.
    
    Nhiệm vụ:
    - Tạo tóm tắt ngắn gọn (1-2 câu)
    - Trích xuất các điểm chính (key points)
    - Highlight action items nếu có
    """
    
    def __init__(self):
        """Initialize the Summarizer Agent."""
        super().__init__(name="Summarizer Agent")
        
        # Initialize OpenAI client
        self.openai_client = OpenAIClient()
    
    def process(self, data: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Create a summary of the email.
        
        Args:
            data: Parsed email data
            context: Optional context information (may include category)
            
        Returns:
            Dictionary containing summary
        """
        try:
            parsed_email = data.get("parsed_email", data)
            category = context.get("category") if context else None
            
            # Create summarization prompt
            system_instruction = """
            You are an expert email summarizer.
            Create a concise summary of the email in 1-2 sentences.
            Extract key points and action items if any.
            
            IMPORTANT: Your response MUST be a valid JSON object with these exact fields:
            {
                "summary": "1-2 sentence summary",
                "key_points": ["point 1", "point 2", ...],
                "action_items": ["action 1", "action 2", ...] (or empty array if none)
            }
            
            Do not include any text before or after the JSON.
            """
            
            prompt = f"""
            Summarize this email:
            
            Subject: {parsed_email.get('subject', 'No subject')}
            From: {parsed_email.get('sender', {}).get('name', 'Unknown')}
            Category: {category or 'Unknown'}
            
            Body:
            {parsed_email.get('body', '')}
            """
            
            # Get summary from OpenAI
            response = self.openai_client.generate_text(
                prompt=prompt,
                system_instruction=system_instruction,
                temperature=0.5
            )
            
            # Parse JSON response
            summary_data = self.openai_client.parse_json_response(
                response,
                required_fields=["summary", "key_points", "action_items"]
            )
            
            return {
                "agent": self.name,
                "success": True,
                "summary": summary_data["summary"],
                "key_points": summary_data["key_points"],
                "action_items": summary_data["action_items"],
                "tools_used": ["OpenAI"]
            }
            
        except OpenAIAPIError:
            raise
        except Exception as e:
            print(f"Error in Summarizer Agent: {str(e)}", file=sys.stderr)
            # Fallback to simple summary
            return self._fallback_summary(data)
    
    def _fallback_summary(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Fallback summary using simple text truncation.
        """
        parsed_email = data.get("parsed_email", data)
        subject = parsed_email.get("subject", "")
        body = parsed_email.get("body", "")
        
        # Create simple summary from first sentence or subject
        if body:
            first_sentence = body.split('.')[0] + '.'
            summary = first_sentence[:150]
        else:
            summary = subject
        
        return {
            "agent": self.name,
            "success": True,
            "summary": summary,
            "key_points": [subject] if subject else [],
            "action_items": [],
            "tools_used": ["Text Truncation"]
        }
