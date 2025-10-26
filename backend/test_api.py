"""
Test script for AI Email Assistant.
Run this to test email processing without frontend.
"""
import requests
import json

# Configuration
BASE_URL = "http://localhost:5000/api/v1"
USER_ID = "test_user_123"

# Test emails
TEST_EMAILS = [
    {
        "sender": "boss@company.com",
        "subject": "URGENT: Q4 Budget Approval Needed",
        "body": """Hi Team,
        
We need to finalize the Q4 budget by end of day today. This is critical for our planning.
Please review the attached spreadsheet and send your approval ASAP.

The deadline cannot be extended as we have a board meeting tomorrow morning.

Thanks,
Sarah Johnson
CEO"""
    },
    {
        "sender": "newsletter@techcrunch.com",
        "subject": "TechCrunch Daily: Top tech news",
        "body": """Here's your daily dose of tech news:
        
1. AI startup raises $100M
2. New iPhone features leaked
3. Tesla stock surges

Read more on our website. Unsubscribe anytime."""
    },
    {
        "sender": "mom@family.com",
        "subject": "Dinner this Sunday?",
        "body": """Hi sweetie,
        
Hope you're doing well! Would you like to come over for dinner this Sunday?
I'm making your favorite lasagna.

Let me know if 6pm works for you.

Love,
Mom"""
    },
    {
        "sender": "support@stripe.com",
        "subject": "Invoice #12345 - Payment Successful",
        "body": """Your payment of $99.00 has been processed successfully.

Invoice: #12345
Amount: $99.00
Date: October 19, 2025

Thank you for your business.

Stripe Team"""
    }
]


def test_health():
    """Test health endpoint."""
    print("\n" + "="*60)
    print("🏥 Testing Health Endpoint")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def test_process_email(email_data):
    """Test processing a single email."""
    print("\n" + "="*60)
    print(f"📧 Processing Email: {email_data['subject']}")
    print("="*60)
    
    try:
        payload = {
            "user_id": USER_ID,
            **email_data
        }
        
        response = requests.post(
            f"{BASE_URL}/email/process",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            if result['status'] == 'success':
                data = result['data']
                print(f"\n✅ Success!")
                print(f"   Category: {data.get('category')}")
                print(f"   Important: {data.get('is_important')} ({data.get('importance_level')})")
                print(f"   Score: {data.get('importance_score')}/100")
                print(f"   Summary: {data.get('summary')}")
                print(f"   Tone: {data.get('tone')} / {data.get('formality')}")
                print(f"   Actions: {', '.join(data.get('suggested_actions', [])[:3])}")
                
                if data.get('key_points'):
                    print(f"\n   Key Points:")
                    for point in data['key_points'][:3]:
                        print(f"   • {point}")
                
                if data.get('suggested_reply'):
                    print(f"\n   Suggested Reply (brief):")
                    print(f"   {data['suggested_reply'].get('brief', 'N/A')[:100]}...")
                
                return True
        else:
            print(f"❌ Error: {response.json()}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def test_get_emails():
    """Test getting all emails."""
    print("\n" + "="*60)
    print("📋 Getting All Emails")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/emails?user_id={USER_ID}")
        
        if response.status_code == 200:
            result = response.json()
            emails = result['data']
            print(f"\n✅ Found {len(emails)} emails")
            
            for i, email in enumerate(emails[:5], 1):
                print(f"\n{i}. {email.get('subject')}")
                print(f"   Category: {email.get('category')} | Important: {email.get('is_important')}")
                print(f"   Summary: {email.get('summary', 'N/A')[:80]}...")
            
            return True
        else:
            print(f"❌ Error: {response.json()}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def test_get_stats():
    """Test getting email statistics."""
    print("\n" + "="*60)
    print("📊 Getting Email Statistics")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/stats?user_id={USER_ID}")
        
        if response.status_code == 200:
            stats = response.json()['data']
            print(f"\n✅ Statistics:")
            print(f"   Total emails: {stats.get('total')}")
            print(f"   Important: {stats.get('important')}")
            print(f"\n   By Category:")
            for category, count in stats.get('by_category', {}).items():
                print(f"   • {category}: {count}")
            
            return True
        else:
            print(f"❌ Error: {response.json()}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def main():
    """Run all tests."""
    print("\n" + "🤖 "*20)
    print("AI EMAIL ASSISTANT - TEST SUITE")
    print("🤖 "*20)
    
    # Test 1: Health check
    if not test_health():
        print("\n❌ Health check failed. Is the server running?")
        print("Run: python run.py")
        return
    
    # Test 2: Process each test email
    print("\n" + "📧"*20)
    print("PROCESSING TEST EMAILS")
    print("📧"*20)
    
    for email in TEST_EMAILS:
        test_process_email(email)
        print()
    
    # Test 3: Get all emails
    test_get_emails()
    
    # Test 4: Get statistics
    test_get_stats()
    
    print("\n" + "="*60)
    print("✅ All tests completed!")
    print("="*60)
    print("\nCheck the results above to see how emails were processed.")
    print("You can also check MongoDB to see the stored data.\n")


if __name__ == "__main__":
    main()
