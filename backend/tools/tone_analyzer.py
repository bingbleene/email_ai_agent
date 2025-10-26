"""
Tone analyzer tool for detecting the tone of email content.
"""
from typing import Dict, Any
from .base_tool import BaseTool


class ToneAnalyzer(BaseTool):
    """
    A tool for analyzing the tone of email content.
    """
    
    def __init__(self):
        """Initialize the Tone Analyzer tool."""
        super().__init__(
            name="ToneAnalyzer",
            description="Analyzes the tone and sentiment of email content"
        )
    
    def execute(self, email_body: str, email_subject: str = "") -> Dict[str, Any]:
        """
        Analyze the tone of an email.
        
        Args:
            email_body: The body of the email
            email_subject: The subject of the email (optional)
            
        Returns:
            Dictionary with tone analysis results
        """
        try:
            text = f"{email_subject} {email_body}".lower()
            
            # Detect various tones
            tones_detected = []
            
            # Formal vs Casual
            formality = self._detect_formality(text)
            
            # Urgency
            if self._is_urgent(text):
                tones_detected.append("urgent")
            
            # Positive/Negative sentiment
            sentiment = self._detect_sentiment(text)
            if sentiment:
                tones_detected.append(sentiment)
            
            # Specific tones
            if self._is_grateful(text):
                tones_detected.append("grateful")
            if self._is_apologetic(text):
                tones_detected.append("apologetic")
            if self._is_inquisitive(text):
                tones_detected.append("inquisitive")
            
            # Determine primary tone
            primary_tone = self._determine_primary_tone(formality, tones_detected)
            
            return {
                "success": True,
                "primary_tone": primary_tone,
                "formality": formality,
                "all_tones": tones_detected,
                "confidence": 0.8
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "primary_tone": "neutral"
            }
    
    def _detect_formality(self, text: str) -> str:
        """Detect if email is formal or casual."""
        formal_indicators = [
            "dear sir", "dear madam", "to whom it may concern",
            "sincerely", "respectfully", "regards",
            "kindly", "hereby", "pursuant"
        ]
        
        casual_indicators = [
            "hey", "hi there", "thanks", "cheers",
            "cool", "awesome", "gonna", "wanna"
        ]
        
        formal_count = sum(1 for indicator in formal_indicators if indicator in text)
        casual_count = sum(1 for indicator in casual_indicators if indicator in text)
        
        if formal_count > casual_count:
            return "formal"
        elif casual_count > formal_count:
            return "casual"
        else:
            return "neutral"
    
    def _is_urgent(self, text: str) -> bool:
        """Check if email has urgent tone."""
        urgent_keywords = [
            "urgent", "asap", "immediately", "critical",
            "emergency", "important", "time-sensitive",
            "action required", "respond now"
        ]
        return any(keyword in text for keyword in urgent_keywords)
    
    def _detect_sentiment(self, text: str) -> str:
        """Detect positive or negative sentiment."""
        positive_words = [
            "thank", "great", "excellent", "wonderful",
            "appreciate", "happy", "pleased", "glad"
        ]
        
        negative_words = [
            "sorry", "unfortunately", "disappointed", "concerned",
            "problem", "issue", "mistake", "error", "unhappy"
        ]
        
        positive_count = sum(1 for word in positive_words if word in text)
        negative_count = sum(1 for word in negative_words if word in text)
        
        if positive_count > negative_count and positive_count > 0:
            return "positive"
        elif negative_count > positive_count and negative_count > 0:
            return "negative"
        return ""
    
    def _is_grateful(self, text: str) -> bool:
        """Check if email expresses gratitude."""
        gratitude_words = ["thank", "appreciate", "grateful", "thanks"]
        return any(word in text for word in gratitude_words)
    
    def _is_apologetic(self, text: str) -> bool:
        """Check if email is apologetic."""
        apology_words = ["sorry", "apologize", "apologies", "regret"]
        return any(word in text for word in apology_words)
    
    def _is_inquisitive(self, text: str) -> bool:
        """Check if email is asking questions."""
        question_indicators = ["?", "could you", "would you", "can you", "please let me know"]
        return any(indicator in text for indicator in question_indicators)
    
    def _determine_primary_tone(self, formality: str, tones: list) -> str:
        """Determine the primary tone from all detected tones."""
        # Priority order for tone selection
        if "urgent" in tones:
            return "urgent"
        if "apologetic" in tones:
            return "apologetic"
        if "grateful" in tones:
            return "grateful"
        if "inquisitive" in tones:
            return "inquisitive"
        if "positive" in tones:
            return "friendly"
        if "negative" in tones:
            return "concerned"
        
        # Default to formality level
        return formality
