#!/usr/bin/env python3
"""
Complete seeding script for PlantGuard database
Seeds both diseases and treatments with affiliate links
"""

import asyncio
from datetime import datetime
from .database.mongodb import diseases_collection, treatments_collection
from .seed_data import DISEASES_SEED_DATA
from .seed_treatments import TREATMENTS_SEED_DATA

async def seed_all_data():
    """Seed both diseases and treatments collections"""
    try:
        print("🌱 Starting complete database seeding...")
        
        # 1. Seed diseases (existing logic)
        print("\n📋 Seeding diseases collection...")
        if DISEASES_SEED_DATA:
            diseases_count = 0
            for disease in DISEASES_SEED_DATA:
                await diseases_collection.update_one(
                    {"name": disease["name"]},
                    {"$set": disease},
                    upsert=True
                )
                diseases_count += 1
            print(f"✅ Diseases seeded/updated: {diseases_count}")
        else:
            print("⚠️ No disease seed data found.")
        
        # 2. Seed treatments with affiliate links
        print("\n💰 Seeding treatments collection with affiliate links...")
        treatments_count = await treatments_collection.count_documents({})
        
        if treatments_count == 0:
            # Add timestamps to each treatment
            for treatment in TREATMENTS_SEED_DATA:
                treatment["created_at"] = datetime.utcnow()
                treatment["updated_at"] = datetime.utcnow()
            
            # Insert treatments
            result = await treatments_collection.insert_many(TREATMENTS_SEED_DATA)
            print(f"✅ Treatments created: {len(result.inserted_ids)}")
            
            # Show affiliate link summary
            affiliate_count = sum(1 for t in TREATMENTS_SEED_DATA if t.get("affiliate_url"))
            print(f"🔗 Affiliate links: {affiliate_count}/{len(TREATMENTS_SEED_DATA)} treatments")
            
        else:
            print(f"ℹ️ Treatments collection already contains {treatments_count} treatments")
            
            # Show current affiliate link stats
            affiliate_count = await treatments_collection.count_documents({"affiliate_url": {"$ne": None}})
            print(f"🔗 Current affiliate links: {affiliate_count}/{treatments_count} treatments")
        
        # 3. Show summary statistics
        print("\n📊 Database Summary:")
        total_diseases = await diseases_collection.count_documents({})
        total_treatments = await treatments_collection.count_documents({})
        affiliate_treatments = await treatments_collection.count_documents({"affiliate_url": {"$ne": None}})
        
        print(f"   Total Diseases: {total_diseases}")
        print(f"   Total Treatments: {total_treatments}")
        print(f"   Treatments with Affiliate Links: {affiliate_treatments}")
        print(f"   Affiliate Coverage: {round((affiliate_treatments/total_treatments*100), 1) if total_treatments > 0 else 0}%")
        
        # 4. Show sample affiliate links
        print("\n🛒 Sample Affiliate Links:")
        sample_treatments = await treatments_collection.find({"affiliate_url": {"$ne": None}}).limit(3).to_list(None)
        for treatment in sample_treatments:
            print(f"   • {treatment['product_name']}: {treatment['affiliate_url']}")
        
        print("\n✅ Complete database seeding finished successfully!")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(seed_all_data())
