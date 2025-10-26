"""
Reader Agent - Đọc và parse email content.
"""
import sys
from typing import Dict, Any, Optional
from .base_agent import BaseAgent
from tools.email_parser import EmailParser


class ReaderAgent(BaseAgent):
    """
    Agent chuyên đọc và parse email content.
    
    Nhiệm vụ:
    - Parse email structure (sender, subject, body, date)
    - Extract metadata (links, phone numbers, attachments)
    - Clean and normalize text
    """
    
    def __init__(self):
        """Initialize the Reader Agent with its tools."""
        super().__init__(name="Reader Agent")
        
        # Register tools
        self.register_tool(EmailParser())
    
    def process(self, data: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Process raw email data and extract structured information.
        
        Args:
            data: Raw email data with fields: sender, subject, body, received_date
            context: Optional context information
            
        Returns:
            Dictionary containing parsed email data
        """
        try:
            # Validate input
            if not data.get("subject") and not data.get("body"):
                raise ValueError("Email must have at least subject or body")
            
            # Use EmailParser tool to parse the email
            parse_result = self.use_tool('EmailParser', email_data=data)
            
            if not parse_result.get("success"):
                raise Exception(parse_result.get("error", "Failed to parse email"))
            
            parsed_data = parse_result["parsed_data"]
            
            return {
                "agent": self.name,
                "success": True,
                "parsed_email": parsed_data,
                "tools_used": ["EmailParser"]
            }
            
        except Exception as e:
            print(f"Error in Reader Agent: {str(e)}", file=sys.stderr)
            return {
                "agent": self.name,
                "success": False,
                "error": str(e),
                "tools_used": []
            }
