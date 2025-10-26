"""
Classifier Agent - Phân loại email theo category.
"""
import sys
import json
import os
from typing import Dict, Any, Optional
from .base_agent import BaseAgent
from utils.openai_client import OpenAIClient
from utils.errors import OpenAIAPIError


class ClassifierAgent(BaseAgent):
    """
    Agent chuyên phân loại email.
    
    Nhiệm vụ:
    - Phân loại email theo category (Work, Personal, Spam, etc.)
    - Xác định confidence level
    - Giải thích lý do phân loại
    """
    
    def __init__(self):
        """Initialize the Classifier Agent."""
        super().__init__(name="Classifier Agent")
        
        # Initialize OpenAI client
        self.openai_client = OpenAIClient()
        
        # Load categories
        self._load_categories()
    
    def _load_categories(self):
        """Load email categories from configuration."""
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
            print(f"Error loading categories: {str(e)}", file=sys.stderr)
            self.categories = []
    
    def process(self, data: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Classify email into appropriate category.
        
        Args:
            data: Parsed email data
            context: Optional context information
            
        Returns:
            Dictionary containing classification results
        """
        try:
            parsed_email = data.get("parsed_email", data)
            
            # Build category list for prompt
            category_list = ", ".join([cat["name"] for cat in self.categories])
            
            # Create classification prompt
            system_instruction = f"""
            You are an email classification expert.
            Analyze the email and classify it into ONE of these categories: {category_list}
            
            Consider:
            - Subject line keywords
            - Sender information
            - Email content and context
            - Tone and purpose
            
            IMPORTANT: Your response MUST be a valid JSON object with these exact fields:
            {{
                "category": "category name",
                "confidence": 0.0-1.0,
                "reasoning": "brief explanation"
            }}
            
            Do not include any text before or after the JSON.
            """
            
            prompt = f"""
            Classify this email:
            
            From: {parsed_email.get('sender', {}).get('email', 'Unknown')}
            Subject: {parsed_email.get('subject', 'No subject')}
            Body: {parsed_email.get('body', '')[:500]}
            """
            
            # Get classification from OpenAI
            response = self.openai_client.generate_text(
                prompt=prompt,
                system_instruction=system_instruction,
                temperature=0.3  # Lower temperature for more consistent classification
            )
            
            # Parse JSON response
            classification = self.openai_client.parse_json_response(
                response, 
                required_fields=["category", "confidence", "reasoning"]
            )
            
            return {
                "agent": self.name,
                "success": True,
                "category": classification["category"],
                "confidence": classification["confidence"],
                "reasoning": classification["reasoning"],
                "tools_used": ["OpenAI"]
            }
            
        except OpenAIAPIError:
            raise
        except Exception as e:
            print(f"Error in Classifier Agent: {str(e)}", file=sys.stderr)
            # Fallback to simple keyword-based classification
            return self._fallback_classification(data)
    
    def _fallback_classification(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Fallback classification using simple keyword matching.
        """
        parsed_email = data.get("parsed_email", data)
        text = f"{parsed_email.get('subject', '')} {parsed_email.get('body', '')}".lower()
        
        # Simple keyword-based classification
        for category in self.categories:
            keywords = category.get("keywords", [])
            matches = sum(1 for keyword in keywords if keyword in text)
            if matches > 0:
                return {
                    "agent": self.name,
                    "success": True,
                    "category": category["name"],
                    "confidence": min(matches * 0.2, 1.0),
                    "reasoning": f"Matched {matches} keywords",
                    "tools_used": ["Keyword Matching"]
                }
        
        # Default to "Personal" if no match
        return {
            "agent": self.name,
            "success": True,
            "category": "Personal",
            "confidence": 0.5,
            "reasoning": "Default classification",
            "tools_used": ["Keyword Matching"]
        }
