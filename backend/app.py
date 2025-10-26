"""
AI Email Assistant Flask Application.
"""
import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from utils.errors import APIError, OpenAIAPIError, EmailProcessingError
from utils.db import MongoDB
from utils.json_encoder import MongoJSONEncoder
from utils.rate_limiter import init_limiter
from agents.email_coordinator import EmailCoordinator
from flask_limiter.errors import RateLimitExceeded

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.json_encoder = MongoJSONEncoder

# Initialize rate limiter
rate_limiter = init_limiter(app)

# Configure CORS
CORS(app, resources={
    r"/*": {
        "origins": [os.environ.get('FRONTEND_URL', 'http://localhost:3000')],
        "methods": ["GET", "POST", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})

# Initialize Email Coordinator and MongoDB
email_coordinator = EmailCoordinator()
db = MongoDB.get_instance()


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(Exception)
def handle_exception(e):
    """Global exception handler for all routes."""
    import traceback
    print(f"Unhandled error: {str(e)}", file=sys.stderr)
    print(traceback.format_exc(), file=sys.stderr)
    
    # In debug mode, return more detailed error information
    if app.debug:
        return jsonify({
            "error": str(e),
            "type": type(e).__name__,
            "traceback": traceback.format_exc(),
            "status": "error"
        }), 500
    
    # Return a user-friendly error message in production
    return jsonify({
        "error": "An error occurred while processing your request. Please try again later.",
        "status": "error"
    }), 500


@app.errorhandler(RateLimitExceeded)
def handle_rate_limit_error(e):
    """Handler for rate limit exceeded errors."""
    return jsonify({
        "error": "Rate limit exceeded. Please try again later.",
        "status": "error",
        "retry_after": e.retry_after
    }), 429


@app.errorhandler(APIError)
def handle_api_error(e):
    """Handler for custom API errors."""
    return jsonify({
        "error": e.message,
        "status": "error"
    }), e.status_code


# ============================================================================
# API ROUTES
# ============================================================================

@app.route('/', methods=['GET'])
def root():
    """Root endpoint - API information."""
    return jsonify({
        "name": "AI Email Assistant API",
        "version": "1.0",
        "status": "running",
        "description": "Multi-agent system for intelligent email processing",
        "endpoints": {
            "health": "/api/v1/health",
            "process_email": "/api/v1/email/process (POST)",
            "batch_process": "/api/v1/email/batch (POST)",
            "list_emails": "/api/v1/emails (GET)",
            "get_email": "/api/v1/emails/<email_id> (GET)",
            "delete_email": "/api/v1/emails/<email_id> (DELETE)",
            "stats": "/api/v1/stats (GET)"
        }
    }), 200


@app.route('/api/v1/health', methods=['GET'])
@rate_limiter.limit_health_check
def health_check():
    """Health check endpoint to verify the API is running."""
    try:
        # Test MongoDB connection
        db_status = "connected" if db.db is not None else "disconnected"
        
        # Test OpenAI client initialization
        ai_status = "initialized" if email_coordinator.classifier_agent.openai_client is not None else "not initialized"
        
        return jsonify({
            "status": "healthy",
            "message": "AI Email Assistant is running",
            "database": db_status,
            "ai_service": ai_status,
            "agents": {
                "coordinator": email_coordinator.name,
                "reader": email_coordinator.reader_agent.name,
                "classifier": email_coordinator.classifier_agent.name,
                "summarizer": email_coordinator.summarizer_agent.name,
                "decision": email_coordinator.decision_agent.name,
                "reply": email_coordinator.reply_agent.name
            }
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500


@app.route('/api/v1/email/process', methods=['POST'])
@rate_limiter.limit_email_processing
def process_email():
    """
    Process a single email.
    
    Expected JSON:
    {
        "user_id": "user123",
        "sender": "john@example.com",
        "subject": "Meeting tomorrow",
        "body": "Email body content...",
        "received_date": "2025-10-19T10:00:00Z" (optional)
    }
    """
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided", "status": "error"}), 400
        
        # Validate required fields
        if not data.get('user_id'):
            return jsonify({"error": "Missing required field: user_id", "status": "error"}), 400
        
        if not data.get('subject') and not data.get('body'):
            return jsonify({"error": "Email must have either subject or body", "status": "error"}), 400
        
        # Extract email data
        user_id = data['user_id']
        email_data = {
            "sender": data.get("sender", "unknown@example.com"),
            "subject": data.get("subject", ""),
            "body": data.get("body", ""),
            "received_date": data.get("received_date"),
            "has_attachments": data.get("has_attachments", False)
        }
        
        # Process email through coordinator
        result = email_coordinator.process_email(email_data, user_id)
        
        if not result.get("success"):
            raise EmailProcessingError(result.get("error", "Failed to process email"))
        
        return jsonify({
            "success": True,
            "status": "success",
            "data": result
        }), 200
        
    except OpenAIAPIError as e:
        return jsonify({
            "error": e.message,
            "status": "error"
        }), e.status_code
    except EmailProcessingError as e:
        return jsonify({
            "error": e.message,
            "status": "error"
        }), e.status_code
    except Exception as e:
        print(f"Error processing email: {str(e)}", file=sys.stderr)
        return jsonify({
            "error": "Failed to process email",
            "status": "error"
        }), 500


@app.route('/api/v1/email/batch', methods=['POST'])
@rate_limiter.limit_batch_processing
def batch_process_emails():
    """
    Process multiple emails at once.
    
    Expected JSON:
    {
        "user_id": "user123",
        "emails": [
            {
                "sender": "...",
                "subject": "...",
                "body": "..."
            },
            ...
        ]
    }
    """
    try:
        data = request.json
        if not data or not data.get('emails'):
            return jsonify({"error": "No emails provided", "status": "error"}), 400
        
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({"error": "Missing required field: user_id", "status": "error"}), 400
        
        emails = data['emails']
        if not isinstance(emails, list):
            return jsonify({"error": "emails must be an array", "status": "error"}), 400
        
        # Process each email
        results = []
        for email_data in emails[:10]:  # Limit to 10 emails per batch
            try:
                result = email_coordinator.process_email(email_data, user_id)
                results.append(result)
            except Exception as e:
                results.append({
                    "success": False,
                    "error": str(e),
                    "email_subject": email_data.get("subject", "Unknown")
                })
        
        return jsonify({
            "status": "success",
            "total": len(results),
            "processed": sum(1 for r in results if r.get("success")),
            "failed": sum(1 for r in results if not r.get("success")),
            "results": results
        }), 200
        
    except Exception as e:
        print(f"Error in batch processing: {str(e)}", file=sys.stderr)
        return jsonify({
            "error": "Failed to process batch",
            "status": "error"
        }), 500


@app.route('/api/v1/emails', methods=['GET'])
@rate_limiter.limit_email_list
def get_emails():
    """
    Get list of processed emails.
    
    Query params:
    - user_id (required)
    - category (optional): filter by category
    - is_important (optional): true/false
    """
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "Missing required parameter: user_id", "status": "error"}), 400
        
        # Build filters
        filters = {}
        if request.args.get('category'):
            filters['category'] = request.args.get('category')
        if request.args.get('is_important'):
            filters['is_important'] = request.args.get('is_important').lower() == 'true'
        
        # Get emails from database
        emails = db.get_emails(user_id, filters)
        
        return jsonify({
            "status": "success",
            "total": len(emails),
            "data": emails
        }), 200
        
    except Exception as e:
        print(f"Error getting emails: {str(e)}", file=sys.stderr)
        return jsonify({
            "error": "Failed to retrieve emails",
            "status": "error"
        }), 500


@app.route('/api/v1/emails/<email_id>', methods=['GET'])
def get_email(email_id):
    """Get a specific email by ID."""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "Missing required parameter: user_id", "status": "error"}), 400
        
        email = db.get_email_by_id(email_id, user_id)
        if not email:
            return jsonify({
                "error": "Email not found or access denied",
                "status": "error"
            }), 404
        
        return jsonify({
            "status": "success",
            "data": email
        }), 200
        
    except Exception as e:
        print(f"Error getting email: {str(e)}", file=sys.stderr)
        return jsonify({
            "error": "Failed to retrieve email",
            "status": "error"
        }), 500


@app.route('/api/v1/emails/<email_id>', methods=['DELETE'])
def delete_email(email_id):
    """Delete an email."""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "Missing required parameter: user_id", "status": "error"}), 400
        
        success = db.delete_email(email_id, user_id)
        if not success:
            return jsonify({
                "error": "Email not found or access denied",
                "status": "error"
            }), 404
        
        return jsonify({
            "status": "success",
            "message": "Email deleted successfully"
        }), 200
        
    except Exception as e:
        print(f"Error deleting email: {str(e)}", file=sys.stderr)
        return jsonify({
            "error": "Failed to delete email",
            "status": "error"
        }), 500


@app.route('/api/v1/stats', methods=['GET'])
def get_stats():
    """Get email statistics for a user."""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "Missing required parameter: user_id", "status": "error"}), 400
        
        stats = db.get_email_stats(user_id)
        
        return jsonify({
            "status": "success",
            "data": stats
        }), 200
        
    except Exception as e:
        print(f"Error getting stats: {str(e)}", file=sys.stderr)
        return jsonify({
            "error": "Failed to retrieve statistics",
            "status": "error"
        }), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
