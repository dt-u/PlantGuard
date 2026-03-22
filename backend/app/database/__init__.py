from .mongodb import mongodb, connect_to_mongodb, disconnect_from_mongodb, diseases_collection, client, database
from .mongodb import seed_db as seed_collections
from ..seed_data import DISEASES_SEED_DATA

async def seed_db():
    """Unified seeding function"""
    # 1. Seed collections (users, history)
    await seed_collections()
    
    # 2. Seed diseases
    try:
        if DISEASES_SEED_DATA:
            # We use a more aggressive seeding strategy to ensure translations are updated
            # For each disease in seed data, update or insert
            for disease in DISEASES_SEED_DATA:
                await diseases_collection.update_one(
                    {"name": disease["name"]},
                    {"$set": disease},
                    upsert=True
                )
            print(f"✅ Database seeded/updated with {len(DISEASES_SEED_DATA)} diseases.")
        else:
            print("⚠️ No disease seed data found.")
    except Exception as e:
        print(f"❌ Error seeding diseases: {e}")
