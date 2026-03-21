from .mongodb import mongodb, connect_to_mongodb, disconnect_from_mongodb, diseases_collection, client, database
from .mongodb import seed_db as seed_collections
from ..seed_data import DISEASES_SEED_DATA

async def seed_db():
    """Unified seeding function"""
    # 1. Seed collections (users, history)
    await seed_collections()
    
    # 2. Seed diseases
    try:
        count = await diseases_collection.count_documents({})
        if count == 0:
            if DISEASES_SEED_DATA:
                await diseases_collection.insert_many(DISEASES_SEED_DATA)
                print(f"✅ Database seeded with {len(DISEASES_SEED_DATA)} diseases.")
            else:
                print("⚠️ No disease seed data found.")
        else:
            print(f"✅ Database already contains {count} diseases.")
    except Exception as e:
        print(f"❌ Error seeding diseases: {e}")
