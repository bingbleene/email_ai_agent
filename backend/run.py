"""
Entry point for the AI Email Assistant Flask application.
"""
import os
from app import app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', '0') == '1'
    
    print(f"🚀 Starting AI Email Assistant on port {port}")
    print(f"📧 API available at: http://127.0.0.1:{port}/api/v1")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
