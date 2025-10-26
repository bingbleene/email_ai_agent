"""
MongoDB database manager for the AI Email Assistant.
"""
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'email_assistant')


class MongoDB:
    _instance = None
    _client = None
    _db = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        if MongoDB._client is None:
            MongoDB._client = MongoClient(MONGODB_URI)
            MongoDB._db = MongoDB._client[DATABASE_NAME]
            self._create_indexes()

    def _create_indexes(self):
        """Create necessary indexes for better query performance."""
        try:
            self.db.users.create_index("user_id", unique=True)
            self.db.emails.create_index([("user_id", 1), ("created_at", -1)])
            self.db.emails.create_index("email_id", unique=True)
            self.db.emails.create_index([("category", 1)])
            self.db.emails.create_index([("is_important", 1)])
            print("✅ MongoDB indexes created successfully")
        except Exception as e:
            print(f"❌ Error creating MongoDB indexes: {str(e)}")

    @property
    def db(self):
        return MongoDB._db

    def _serialize_document(self, doc):
        """Helper method to serialize MongoDB document."""
        if doc is None:
            return None
        if isinstance(doc.get('_id'), ObjectId):
            doc['_id'] = str(doc['_id'])
        return doc

    # User Management
    def get_or_create_user(self, user_id):
        """Get or create a user document."""
        try:
            user = self.db.users.find_one_and_update(
                {"user_id": user_id},
                {
                    "$setOnInsert": {
                        "user_id": user_id,
                        "created_at": datetime.utcnow(),
                    },
                    "$set": {
                        "last_active": datetime.utcnow()
                    }
                },
                upsert=True,
                return_document=True
            )
            return self._serialize_document(user)
        except Exception as e:
            print(f"Error in get_or_create_user: {str(e)}")
            return None

    # Email Management
    def save_email(self, email_data):
        """Save a processed email to the database."""
        try:
            email_id = str(ObjectId())
            email_doc = {
                "_id": ObjectId(email_id),
                "email_id": email_id,
                "user_id": email_data.get("user_id"),
                "sender": email_data.get("sender"),
                "subject": email_data.get("subject"),
                "body": email_data.get("body"),
                "received_date": email_data.get("received_date"),
                "category": email_data.get("category"),
                "summary": email_data.get("summary"),
                "is_important": email_data.get("is_important", False),
                "suggested_action": email_data.get("suggested_action"),
                "suggested_reply": email_data.get("suggested_reply"),
                "tone": email_data.get("tone"),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = self.db.emails.insert_one(email_doc)
            if result.inserted_id:
                return self._serialize_document(email_doc)
            return None
        except Exception as e:
            print(f"Error in save_email: {str(e)}")
            return None

    def get_emails(self, user_id, filters=None):
        """Get emails for a user with optional filters."""
        try:
            query = {"user_id": user_id}
            
            if filters:
                if filters.get("category"):
                    query["category"] = filters["category"]
                if filters.get("is_important") is not None:
                    query["is_important"] = filters["is_important"]
            
            emails = list(self.db.emails.find(query).sort("created_at", -1))
            return [self._serialize_document(email) for email in emails]
        except Exception as e:
            print(f"Error in get_emails: {str(e)}")
            return []

    def get_email_by_id(self, email_id, user_id):
        """Get a specific email by ID."""
        try:
            email = self.db.emails.find_one({
                "email_id": email_id,
                "user_id": user_id
            })
            return self._serialize_document(email)
        except Exception as e:
            print(f"Error in get_email_by_id: {str(e)}")
            return None

    def delete_email(self, email_id, user_id):
        """Delete an email."""
        try:
            result = self.db.emails.delete_one({
                "email_id": email_id,
                "user_id": user_id
            })
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error in delete_email: {str(e)}")
            return False

    def update_email_action(self, email_id, user_id, action):
        """Update the action taken on an email."""
        try:
            result = self.db.emails.update_one(
                {"email_id": email_id, "user_id": user_id},
                {
                    "$set": {
                        "user_action": action,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error in update_email_action: {str(e)}")
            return False

    def get_email_stats(self, user_id):
        """Get email statistics for a user."""
        try:
            total = self.db.emails.count_documents({"user_id": user_id})
            important = self.db.emails.count_documents({"user_id": user_id, "is_important": True})
            
            categories = self.db.emails.aggregate([
                {"$match": {"user_id": user_id}},
                {"$group": {"_id": "$category", "count": {"$sum": 1}}}
            ])
            
            category_stats = {cat["_id"]: cat["count"] for cat in categories}
            
            return {
                "total": total,
                "important": important,
                "by_category": category_stats
            }
        except Exception as e:
            print(f"Error in get_email_stats: {str(e)}")
            return {"total": 0, "important": 0, "by_category": {}}

    def close(self):
        if MongoDB._client:
            MongoDB._client.close()
            MongoDB._client = None
            MongoDB._db = None
