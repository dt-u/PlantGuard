#!/usr/bin/env python3
"""
Clear treatments collection and reseed with direct product URLs
"""

import asyncio
from .database.mongodb import treatments_collection
from .seed_treatments import TREATMENTS_SEED_DATA
from datetime import datetime

async def clear_and_reseed_treatments():
    """Clear treatments collection and reseed with new data"""
    try:
        print("🗑️ Clearing existing treatments collection...")
        
        # Delete all existing treatments
        result = await treatments_collection.delete_many({})
        print(f"✅ Deleted {result.deleted_count} existing treatments")
        
        # Add timestamps to each treatment
        for treatment in TREATMENTS_SEED_DATA:
            treatment["created_at"] = datetime.utcnow()
            treatment["updated_at"] = datetime.utcnow()
        
        # Insert new treatments
        result = await treatments_collection.insert_many(TREATMENTS_SEED_DATA)
        print(f"✅ Created {len(result.inserted_ids)} new treatments")
        
        # Show affiliate link summary
        affiliate_count = sum(1 for t in TREATMENTS_SEED_DATA if t.get("affiliate_url"))
        print(f"🔗 Affiliate links: {affiliate_count}/{len(TREATMENTS_SEED_DATA)} treatments")
        
        # Show sample direct product URLs
        print("\n🛒 Sample Direct Product URLs:")
        for treatment in TREATMENTS_SEED_DATA:
            if treatment.get("affiliate_url"):
                print(f"   • {treatment['product_name']}: {treatment['affiliate_url']}")
                break  # Just show first one
        
        print("\n✅ Clear and reseed completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during clear and reseed: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(clear_and_reseed_treatments())
