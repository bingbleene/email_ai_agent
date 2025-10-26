"""
Decision Agent - Quyết định hành động cho email.
"""
import sys
from typing import Dict, Any, Optional
from .base_agent import BaseAgent
from tools.importance_scorer import ImportanceScorer
from tools.tone_analyzer import ToneAnalyzer


class DecisionAgent(BaseAgent):
    """
    Agent quyết định hành động cho email.
    
    Nhiệm vụ:
    - Xác định mức độ quan trọng (importance score)
    - Quyết định action: highlight, archive, delete, reply
    - Phân tích tone để đề xuất cách phản hồi
    """
    
    def __init__(self):
        """Initialize the Decision Agent with its tools."""
        super().__init__(name="Decision Agent")
        
        # Register tools
        self.register_tool(ImportanceScorer())
        self.register_tool(ToneAnalyzer())
    
    def process(self, data: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Decide on actions for the email.
        
        Args:
            data: Parsed email data
            context: Optional context (should include category, summary)
            
        Returns:
            Dictionary containing decisions and actions
        """
        try:
            parsed_email = data.get("parsed_email", data)
            category = context.get("category") if context else None
            
            # Step 1: Score importance
            importance_result = self.use_tool(
                'ImportanceScorer',
                email_data=parsed_email,
                category=category
            )
            
            # Step 2: Analyze tone
            tone_result = self.use_tool(
                'ToneAnalyzer',
                email_body=parsed_email.get("body", ""),
                email_subject=parsed_email.get("subject", "")
            )
            
            # Step 3: Decide actions based on importance and tone
            actions = self._decide_actions(
                importance_result,
                tone_result,
                category
            )
            
            return {
                "agent": self.name,
                "success": True,
                "is_important": importance_result.get("is_important", False),
                "importance_score": importance_result.get("importance_score", 0),
                "importance_level": importance_result.get("level", "Low"),
                "tone": tone_result.get("primary_tone", "neutral"),
                "formality": tone_result.get("formality", "neutral"),
                "suggested_actions": actions,
                "tools_used": ["ImportanceScorer", "ToneAnalyzer"]
            }
            
        except Exception as e:
            print(f"Error in Decision Agent: {str(e)}", file=sys.stderr)
            return {
                "agent": self.name,
                "success": False,
                "error": str(e),
                "is_important": False,
                "suggested_actions": ["review"],
                "tools_used": []
            }
    
    def _decide_actions(self, importance: Dict, tone: Dict, category: str) -> list:
        """
        Decide what actions to suggest based on analysis.
        
        Args:
            importance: Importance analysis results
            tone: Tone analysis results
            category: Email category
            
        Returns:
            List of suggested actions
        """
        actions = []
        
        # Spam handling
        if category == "Spam":
            actions.append("delete")
            actions.append("unsubscribe")
            return actions
        
        # Important emails
        if importance.get("is_important"):
            actions.append("highlight")
            actions.append("priority_inbox")
        
        # Urgent emails need immediate attention
        if "urgent" in tone.get("all_tones", []):
            actions.append("reply_asap")
            actions.append("flag")
        
        # Questions need responses
        if "inquisitive" in tone.get("all_tones", []):
            actions.append("needs_reply")
        
        # Work emails might need tracking
        if category == "Work":
            actions.append("track")
            if importance.get("importance_score", 0) > 30:
                actions.append("calendar_reminder")
        
        # Financial emails should be archived
        if category == "Financial":
            actions.append("archive")
            actions.append("mark_as_read")
        
        # Newsletters can be read later
        if category == "Newsletter":
            actions.append("read_later")
            actions.append("archive")
        
        # Default: just mark as reviewed
        if not actions:
            actions.append("review")
        
        return actions
