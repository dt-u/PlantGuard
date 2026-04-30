from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING
from datetime import datetime
import os

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "plantguard_db")

# Create MongoDB client
client = AsyncIOMotorClient(MONGO_URI)
database = client[DB_NAME]

# Collections
mongodb = database
users_collection = mongodb.users
history_collection = mongodb.history
notifications_collection = mongodb.notifications
diseases_collection = mongodb.diseases
treatments_collection = mongodb.treatments
routines_collection = mongodb.routines
captures_collection = mongodb.captures

async def connect_to_mongodb():
    """Connect to MongoDB"""
    try:
        # Test connection
        await client.admin.command('ping')
        print(f"✅ Connected to MongoDB: {DB_NAME}")
        
        # Create indexes for better performance
        await create_indexes()
        
        return True
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        return False

async def create_indexes():
    """Create indexes for collections"""
    try:
        # Users collection indexes
        await mongodb.users.create_index("email", unique=True)
        await mongodb.users.create_index("created_at")
        
        # History collection indexes
        await mongodb.history.create_index("created_at")
        await mongodb.history.create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
        
        # Notifications collection indexes
        await mongodb.notifications.create_index("user_id")
        await mongodb.notifications.create_index("created_at")
        await mongodb.notifications.create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
        await mongodb.notifications.create_index([("user_id", ASCENDING), ("is_read", ASCENDING)])

        # Routines collection indexes
        await mongodb.routines.create_index("user_id")
        await mongodb.routines.create_index("created_at")
        
        print("✅ Database indexes created")
    except Exception as e:
        print(f"⚠️ Index creation warning: {e}")

async def disconnect_from_mongodb():
    """Disconnect from MongoDB"""
    try:
        client.close()
        print("✅ Disconnected from MongoDB")
    except Exception as e:
        print(f"❌ Failed to disconnect from MongoDB: {e}")

async def seed_db():
    """Seed database with initial data"""
    try:
        # Check if users collection exists and has data
        users_count = await mongodb.users.count_documents({})
        
        # Ensure collections exist even if already seeded
        collections = await database.list_collection_names()
        for col in ["users", "history", "notifications"]:
            if col not in collections:
                await database.create_collection(col)
                print(f"✅ Created {col} collection")
        
        if users_count > 0:
            print(f"✅ Database already contains {users_count} users")
        else:
            print("🌱 Database is empty, ready for first user")
            
    except Exception as e:
        print(f"❌ Error seeding database: {e}")

# Database helper functions
async def get_user_by_email(email: str):
    """Get user by email"""
    return await mongodb.users.find_one({"email": email})

async def create_user(user_data: dict):
    """Create a new user"""
    result = await mongodb.users.insert_one(user_data)
    return result.inserted_id

async def verify_user_credentials(email: str, password: str):
    """Verify user credentials"""
    user = await mongodb.users.find_one({"email": email})
    if user and user.get("password") == password:  # In production, use hashed passwords
        return user
    return None

async def get_treatments_by_disease(disease_id: str):
    """Get treatments by disease ID"""
    try:
        treatments = []
        cursor = treatments_collection.find({"disease_id": disease_id})
        async for document in cursor:
            treatments.append(document)
        return treatments
    except Exception as e:
        print(f"❌ Error fetching treatments for disease {disease_id}: {e}")
        return []
