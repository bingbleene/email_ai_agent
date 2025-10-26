"""
Email Coordinator - Main orchestrator cho toàn bộ hệ thống.
"""
import sys
from typing import Dict, Any
from .base_agent import BaseAgent
from .reader_agent import ReaderAgent
from .classifier_agent import ClassifierAgent
from .summarizer_agent import SummarizerAgent
from .decision_agent import DecisionAgent
from .reply_agent import ReplyAgent
from utils.db import MongoDB
from utils.errors import OpenAIAPIError


class EmailCoordinator(BaseAgent):
    """
    Main coordinator agent - orchestrates all specialist agents.
    
    Flow:
    1. ReaderAgent → Parse email
    2. ClassifierAgent → Phân loại
    3. SummarizerAgent → Tóm tắt
    4. DecisionAgent → Quyết định actions
    5. ReplyAgent (optional) → Tạo gợi ý reply
    6. Save to MongoDB
    """
    
    def __init__(self):
        """Initialize the Email Coordinator with all specialist agents."""
        super().__init__(name="Email Coordinator")
        
        # Initialize all specialist agents
        self.reader_agent = ReaderAgent()
        self.classifier_agent = ClassifierAgent()
        self.summarizer_agent = SummarizerAgent()
        self.decision_agent = DecisionAgent()
        self.reply_agent = ReplyAgent()
        
        # Initialize database
        self.db = MongoDB.get_instance()
    
    def process_email(self, email_data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """
        Process a single email through all agents.
        
        Args:
            email_data: Raw email data
            user_id: User ID
            
        Returns:
            Fully processed email with all analysis
        """
        try:
            print(f"\n{'='*60}")
            print(f"📧 Processing email for user: {user_id}")
            print(f"Subject: {email_data.get('subject', 'No subject')}")
            print(f"{'='*60}\n")
            
            # Ensure user exists
            user = self.db.get_or_create_user(user_id)
            if not user:
                raise Exception("Failed to create or retrieve user")
            
            # Step 1: Reader Agent - Parse email
            print("📖 Step 1: Reading and parsing email...")
            reader_result = self.reader_agent.process(email_data)
            if not reader_result.get("success"):
                raise Exception(f"Reader Agent failed: {reader_result.get('error')}")
            
            parsed_email = reader_result["parsed_email"]
            print(f"✅ Email parsed successfully")
            print(f"   Sender: {parsed_email['sender']['name']} <{parsed_email['sender']['email']}>")
            
            # Step 2: Classifier Agent - Classify email
            print("\n🏷️  Step 2: Classifying email...")
            classifier_result = self.classifier_agent.process({"parsed_email": parsed_email})
            if not classifier_result.get("success"):
                raise Exception(f"Classifier Agent failed: {classifier_result.get('error')}")
            
            category = classifier_result["category"]
            print(f"✅ Category: {category} (confidence: {classifier_result['confidence']:.2f})")
            print(f"   Reasoning: {classifier_result['reasoning']}")
            
            # Step 3: Summarizer Agent - Create summary
            print("\n📝 Step 3: Generating summary...")
            context_for_summary = {"category": category}
            summarizer_result = self.summarizer_agent.process(
                {"parsed_email": parsed_email},
                context=context_for_summary
            )
            if not summarizer_result.get("success"):
                raise Exception(f"Summarizer Agent failed: {summarizer_result.get('error')}")
            
            summary = summarizer_result["summary"]
            key_points = summarizer_result.get("key_points", [])
            action_items = summarizer_result.get("action_items", [])
            print(f"✅ Summary: {summary}")
            if key_points:
                print(f"   Key points: {', '.join(key_points[:3])}")
            
            # Step 4: Decision Agent - Decide actions
            print("\n⚖️  Step 4: Making decisions...")
            context_for_decision = {
                "category": category,
                "summary": summary
            }
            decision_result = self.decision_agent.process(
                {"parsed_email": parsed_email},
                context=context_for_decision
            )
            if not decision_result.get("success"):
                raise Exception(f"Decision Agent failed: {decision_result.get('error')}")
            
            is_important = decision_result["is_important"]
            importance_score = decision_result["importance_score"]
            suggested_actions = decision_result["suggested_actions"]
            tone = decision_result["tone"]
            print(f"✅ Importance: {decision_result['importance_level']} (score: {importance_score})")
            print(f"   Important: {'Yes' if is_important else 'No'}")
            print(f"   Tone: {tone}")
            print(f"   Actions: {', '.join(suggested_actions[:3])}")
            
            # Step 5: Reply Agent (optional) - Generate suggested reply
            suggested_reply = None
            if any(action in suggested_actions for action in ["needs_reply", "reply_asap"]):
                print("\n💬 Step 5: Generating reply suggestions...")
                context_for_reply = {
                    "category": category,
                    "tone": tone,
                    "summary": summary,
                    "action_items": action_items,
                    "suggested_actions": suggested_actions
                }
                reply_result = self.reply_agent.process(
                    {"parsed_email": parsed_email},
                    context=context_for_reply
                )
                if reply_result.get("success") and reply_result.get("needs_reply"):
                    suggested_reply = reply_result["suggested_reply"]
                    print(f"✅ Reply generated (3 versions available)")
            
            # Step 6: Save to database
            print("\n💾 Step 6: Saving to database...")
            email_to_save = {
                "user_id": user_id,
                "sender": parsed_email["sender"]["email"],
                "subject": parsed_email["subject"],
                "body": parsed_email["body"],
                "received_date": parsed_email.get("received_date"),
                "category": category,
                "summary": summary,
                "key_points": key_points,
                "action_items": action_items,
                "is_important": is_important,
                "importance_score": importance_score,
                "suggested_action": suggested_actions,
                "suggested_reply": suggested_reply,
                "tone": tone
            }
            
            saved_email = self.db.save_email(email_to_save)
            if not saved_email:
                print("⚠️  Warning: Failed to save email to database")
            else:
                print(f"✅ Email saved with ID: {saved_email['email_id']}")
            
            # Return complete result
            result = {
                "success": True,
                "email_id": saved_email["email_id"] if saved_email else None,
                "parsed_email": parsed_email,
                "category": category,
                "classification_confidence": classifier_result["confidence"],
                "summary": summary,
                "key_points": key_points,
                "action_items": action_items,
                "is_important": is_important,
                "importance_score": importance_score,
                "importance_level": decision_result["importance_level"],
                "tone": tone,
                "formality": decision_result.get("formality"),
                "suggested_actions": suggested_actions,
                "suggested_reply": suggested_reply,
                "agents_used": [
                    self.reader_agent.name,
                    self.classifier_agent.name,
                    self.summarizer_agent.name,
                    self.decision_agent.name,
                    self.reply_agent.name if suggested_reply else None
                ]
            }
            
            print(f"\n{'='*60}")
            print("✅ Email processing completed successfully!")
            print(f"{'='*60}\n")
            
            return result
            
        except OpenAIAPIError as e:
            print(f"\n❌ OpenAI API Error: {str(e)}", file=sys.stderr)
            raise
        except Exception as e:
            print(f"\n❌ Error in Email Coordinator: {str(e)}", file=sys.stderr)
            return {
                "success": False,
                "error": str(e),
                "agents_used": [self.name]
            }
    
    def process(self, data: Dict[str, Any], context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Process method required by BaseAgent.
        Delegates to process_email.
        """
        user_id = context.get("user_id") if context else "default_user"
        return self.process_email(data, user_id)
