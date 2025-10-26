"""
Custom exceptions for the AI Email Assistant.
"""


class APIError(Exception):
    """Base exception class for API errors."""
    def __init__(self, message, status_code=500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class OpenAIAPIError(APIError):
    """Exception raised for OpenAI API errors."""
    def __init__(self, message="There was an issue with our AI service. Please try again later."):
        super().__init__(message, status_code=503)


class RateLimitExceededError(APIError):
    """Exception raised when rate limits are exceeded."""
    def __init__(self, message="Rate limit exceeded. Please try again later.", retry_after=None):
        super().__init__(message, status_code=429)
        self.retry_after = retry_after


class EmailProcessingError(APIError):
    """Exception raised when email processing fails."""
    def __init__(self, message="Failed to process email. Please check the email format."):
        super().__init__(message, status_code=400)
