import motor.motor_asyncio
from .config import MONGO_URL, DB_NAME

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
diseases_collection = db["diseases"]

async def seed_db():
    try:
        count = await diseases_collection.count_documents({})
        if count == 0:
            sample_data = [
                {
                    "name": "Tomato Blight",
                    "treatments": [
                        {"level": "Mild", "action": "Prune infected leaves", "product": "Neem Oil"},
                        {"level": "Moderate", "action": "Apply fungicide", "product": "Copper Fungicide"},
                        {"level": "Severe", "action": "Remove plant entirely", "product": "Soil Solarization"}
                    ]
                },
                {
                    "name": "Corn Rust",
                    "treatments": [
                        {"level": "Mild", "action": "Improve air circulation", "product": "Sulfur Dust"},
                        {"level": "Moderate", "action": "Apply fungicide", "product": "Chlorothalonil"},
                        {"level": "Severe", "action": "Destroy crop residue", "product": "Resistant Seeds"}
                    ]
                },
                {
                    "name": "Healthy",
                     "treatments": [
                        {"level": "Mild", "action": "Current Status Good", "product": "Regular Water"},
                        {"level": "Moderate", "action": "Current Status Good", "product": "Regular Water"},
                        {"level": "Severe", "action": "Current Status Good", "product": "Regular Water"}
                    ]
                }
            ]
            await diseases_collection.insert_many(sample_data)
            print("Database seeded with sample diseases.")
        else:
            print("Database already contains data.")
    except Exception as e:
        print(f"Error seeding database: {e}")