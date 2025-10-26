"""
Email parser tool for extracting structured information from email content.
"""
import re
from email.utils import parseaddr
from typing import Dict, Any
from .base_tool import BaseTool


class EmailParser(BaseTool):
    """
    A tool for parsing and extracting information from email content.
    """
    
    def __init__(self):
        """Initialize the Email Parser tool."""
        super().__init__(
            name="EmailParser",
            description="Parses email content and extracts structured information"
        )
    
    def execute(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parse email data and extract structured information.
        
        Args:
            email_data: Dictionary containing email fields
            
        Returns:
            Parsed and structured email data
        """
        try:
            parsed_data = {
                "sender": self._parse_sender(email_data.get("sender", "")),
                "subject": self._clean_subject(email_data.get("subject", "")),
                "body": self._clean_body(email_data.get("body", "")),
                "received_date": email_data.get("received_date"),
                "has_attachments": email_data.get("has_attachments", False),
                "metadata": self._extract_metadata(email_data.get("body", ""))
            }
            
            return {
                "success": True,
                "parsed_data": parsed_data
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _parse_sender(self, sender: str) -> Dict[str, str]:
        """
        Parse sender email address.
        
        Args:
            sender: Sender email string
            
        Returns:
            Dictionary with name and email
        """
        name, email = parseaddr(sender)
        return {
            "name": name or email.split('@')[0] if email else "Unknown",
            "email": email or sender
        }
    
    def _clean_subject(self, subject: str) -> str:
        """
        Clean and normalize email subject.
        
        Args:
            subject: Raw email subject
            
        Returns:
            Cleaned subject
        """
        # Remove common prefixes
        subject = re.sub(r'^(Re:|Fwd?:|RE:|FW:)\s*', '', subject, flags=re.IGNORECASE)
        return subject.strip()
    
    def _clean_body(self, body: str) -> str:
        """
        Clean email body text.
        
        Args:
            body: Raw email body
            
        Returns:
            Cleaned body text
        """
        # Remove excessive whitespace
        body = re.sub(r'\s+', ' ', body)
        # Remove common email signatures
        body = re.sub(r'-{2,}.*$', '', body, flags=re.DOTALL)
        return body.strip()
    
    def _extract_metadata(self, body: str) -> Dict[str, Any]:
        """
        Extract metadata from email body.
        
        Args:
            body: Email body text
            
        Returns:
            Dictionary of metadata
        """
        metadata = {
            "has_links": bool(re.search(r'https?://', body)),
            "has_phone": bool(re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', body)),
            "word_count": len(body.split()),
            "has_question": '?' in body
        }
        return metadata
