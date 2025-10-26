"""
AI API client wrapper for the AI Email Assistant.
Supports both OpenAI and Google Gemini.
"""
import os
import sys
import json
import re
from typing import Dict, List, Any, Optional
from utils.errors import OpenAIAPIError

try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False


class OpenAIClient:
    """
    A wrapper around AI APIs (OpenAI or Gemini) for text generation.
    """
    
    def __init__(self):
        # Try Gemini first, then OpenAI
        gemini_key = os.environ.get('GEMINI_API_KEY')
        openai_key = os.environ.get('OPENAI_API_KEY')
        
        if gemini_key and GEMINI_AVAILABLE:
            try:
                genai.configure(api_key=gemini_key)
                # Use gemini-2.0-flash (fast and free tier available)
                self.client = genai.GenerativeModel('models/gemini-2.0-flash')
                self.model_type = 'gemini'
                self.model = 'gemini-2.0-flash'
                print("✅ Using Google Gemini AI (gemini-2.0-flash)", file=sys.stderr)
            except Exception as e:
                print(f"Error initializing Gemini client: {str(e)}", file=sys.stderr)
                raise OpenAIAPIError("Could not initialize AI service") from e
        elif openai_key and OPENAI_AVAILABLE:
            try:
                self.client = OpenAI(api_key=openai_key)
                self.model_type = 'openai'
                self.model = os.environ.get('OPENAI_MODEL', 'gpt-4o-mini')
                print("✅ Using OpenAI GPT", file=sys.stderr)
            except Exception as e:
                print(f"Error initializing OpenAI client: {str(e)}", file=sys.stderr)
                raise OpenAIAPIError("Could not initialize AI service") from e
        else:
            raise ValueError("No AI API key found. Set GEMINI_API_KEY or OPENAI_API_KEY environment variable")
    
    def generate_text(self, 
                     prompt: str, 
                     system_instruction: Optional[str] = None,
                     temperature: float = 0.7,
                     max_tokens: int = 1024) -> str:
        """
        Generate text using AI API (OpenAI or Gemini).
        
        Args:
            prompt: The user prompt
            system_instruction: System instruction for the model
            temperature: Creativity level (0.0-2.0)
            max_tokens: Maximum tokens in response
            
        Returns:
            Generated text response
        """
        try:
            if self.model_type == 'gemini':
                # Combine system instruction and prompt for Gemini
                full_prompt = prompt
                if system_instruction:
                    full_prompt = f"{system_instruction}\n\n{prompt}"
                
                response = self.client.generate_content(
                    full_prompt,
                    generation_config={
                        'temperature': temperature,
                        'max_output_tokens': max_tokens,
                    }
                )
                return response.text
                
            else:  # OpenAI
                messages = []
                
                if system_instruction:
                    messages.append({"role": "system", "content": system_instruction})
                
                messages.append({"role": "user", "content": prompt})
                
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens
                )
                
                return response.choices[0].message.content
            
        except Exception as e:
            error_msg = f"Error generating text with AI API: {str(e)}"
            print(error_msg, file=sys.stderr)
            raise OpenAIAPIError("AI service is temporarily unavailable") from e
    
    def parse_json_response(self, response: str, required_fields: List[str] = None) -> Dict[str, Any]:
        """
        Parse a JSON response from OpenAI API in a robust way.
        
        Args:
            response: The text response from OpenAI
            required_fields: List of field names that must be present in the JSON
            
        Returns:
            A dictionary parsed from the JSON
            
        Raises:
            ValueError: If the JSON doesn't have all required fields or can't be parsed
        """
        try:
            # Clean the response to extract only JSON if there's any extra text
            # Look for text that looks like JSON (between curly braces)
            json_match = re.search(r'(\{.*\})', response, re.DOTALL)
            if json_match:
                json_str = json_match.group(1)
            else:
                json_str = response
            
            # Try to parse the JSON
            result = json.loads(json_str)
            
            # Validate that we have all required fields if specified
            if required_fields and not all(key in result for key in required_fields):
                missing_fields = [field for field in required_fields if field not in result]
                raise ValueError(f"Missing required fields in JSON response: {missing_fields}")
                
            return result
            
        except json.JSONDecodeError as json_err:
            print(f"JSON parse error: {str(json_err)}")
            print(f"Attempted to parse: {json_str}")
            raise ValueError(f"Could not parse JSON response: {str(json_err)}")
