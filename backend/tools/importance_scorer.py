"""
Importance scorer tool for calculating email importance based on various factors.
"""
import json
import os
from typing import Dict, Any
from .base_tool import BaseTool


class ImportanceScorer(BaseTool):
    """
    A tool for scoring email importance based on multiple factors.
    """
    
    def __init__(self):
        """Initialize the Importance Scorer tool."""
        super().__init__(
            name="ImportanceScorer",
            description="Calculates importance score for emails"
        )
        self._load_categories()
    
    def _load_categories(self):
        """Load email categories configuration."""
        try:
            categories_path = os.path.join(
                os.path.dirname(os.path.dirname(__file__)), 
                'data', 
                'email_categories.json'
            )
            with open(categories_path, 'r') as f:
                data = json.load(f)
                self.categories = data['categories']
        except Exception as e:
            print(f"Error loading categories: {str(e)}")
            self.categories = []
    
    def execute(self, email_data: Dict[str, Any], category: str = None) -> Dict[str, Any]:
        """
        Calculate importance score for an email.
        
        Args:
            email_data: Parsed email data
            category: Email category (optional)
            
        Returns:
            Dictionary with importance score and reasoning
        """
        try:
            score = 0
            reasons = []
            
            # Factor 1: Category weight (0-30 points)
            category_score = self._score_category(category)
            score += category_score
            if category_score > 0:
                reasons.append(f"Category '{category}' adds {category_score} points")
            
            # Factor 2: Sender importance (0-25 points)
            sender_score = self._score_sender(email_data.get("sender", {}))
            score += sender_score
            if sender_score > 0:
                reasons.append(f"Sender importance adds {sender_score} points")
            
            # Factor 3: Subject keywords (0-20 points)
            subject_score = self._score_subject(email_data.get("subject", ""))
            score += subject_score
            if subject_score > 0:
                reasons.append(f"Subject keywords add {subject_score} points")
            
            # Factor 4: Body content (0-15 points)
            body_score = self._score_body(email_data.get("body", ""))
            score += body_score
            if body_score > 0:
                reasons.append(f"Body content adds {body_score} points")
            
            # Factor 5: Metadata (0-10 points)
            metadata_score = self._score_metadata(email_data.get("metadata", {}))
            score += metadata_score
            if metadata_score > 0:
                reasons.append(f"Email metadata adds {metadata_score} points")
            
            # Determine if important (score >= 50 is considered important)
            is_important = score >= 50
            
            return {
                "success": True,
                "importance_score": score,
                "is_important": is_important,
                "reasons": reasons,
                "level": self._get_importance_level(score)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "importance_score": 0,
                "is_important": False
            }
    
    def _score_category(self, category: str) -> int:
        """Score based on email category."""
        category_weights = {
            "Work": 30,
            "Important": 30,
            "Financial": 25,
            "Support": 20,
            "Announcement": 15,
            "Personal": 10,
            "Newsletter": 5,
            "Spam": 0
        }
        return category_weights.get(category, 10)
    
    def _score_sender(self, sender: Dict[str, str]) -> int:
        """Score based on sender information."""
        email = sender.get("email", "").lower()
        name = sender.get("name", "").lower()
        
        # Higher score for known important senders
        important_indicators = ["boss", "ceo", "manager", "director", "urgent", "important"]
        for indicator in important_indicators:
            if indicator in name or indicator in email:
                return 25
        
        # Medium score for organization emails
        if any(domain in email for domain in [".edu", ".gov", ".org"]):
            return 15
        
        # Low score for no-reply addresses
        if "noreply" in email or "no-reply" in email:
            return 0
        
        return 10
    
    def _score_subject(self, subject: str) -> int:
        """Score based on subject line."""
        subject_lower = subject.lower()
        
        # High priority keywords
        high_priority = ["urgent", "important", "asap", "critical", "action required"]
        if any(keyword in subject_lower for keyword in high_priority):
            return 20
        
        # Medium priority keywords
        medium_priority = ["meeting", "deadline", "response needed", "reminder"]
        if any(keyword in subject_lower for keyword in medium_priority):
            return 15
        
        # Question mark indicates need for response
        if "?" in subject:
            return 10
        
        return 5
    
    def _score_body(self, body: str) -> int:
        """Score based on email body content."""
        body_lower = body.lower()
        
        # Check for urgent language
        if any(word in body_lower for word in ["urgent", "asap", "immediately"]):
            return 15
        
        # Check for questions
        if "?" in body:
            return 10
        
        # Check length (very short emails might be important)
        if len(body.split()) < 50:
            return 8
        
        return 5
    
    def _score_metadata(self, metadata: Dict[str, Any]) -> int:
        """Score based on email metadata."""
        score = 0
        
        # Has question - might need response
        if metadata.get("has_question"):
            score += 5
        
        # Has phone number - might be important contact
        if metadata.get("has_phone"):
            score += 3
        
        # Short email - might be quick question
        if metadata.get("word_count", 0) < 50:
            score += 2
        
        return score
    
    def _get_importance_level(self, score: int) -> str:
        """Get importance level based on score."""
        if score >= 70:
            return "Critical"
        elif score >= 50:
            return "High"
        elif score >= 30:
            return "Medium"
        else:
            return "Low"
