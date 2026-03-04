import motor.motor_asyncio
from .config import MONGO_URL, DB_NAME
from .seed_data import DISEASES_SEED_DATA

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
diseases_collection = db["diseases"]

async def seed_db():
    try:
        count = await diseases_collection.count_documents({})
        if count == 0:
            await diseases_collection.insert_many(DISEASES_SEED_DATA)
            print(f"Database seeded with {len(DISEASES_SEED_DATA)} diseases.")
        else:
            print("Database already contains data.")
    except Exception as e:
        print(f"Error seeding database: {e}")
