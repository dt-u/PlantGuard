from fastapi import APIRouter, HTTPException
from ..database import diseases_collection
from ..seed_data import DISEASES_SEED_DATA

router = APIRouter()

@router.post("/reseed")
async def reseed_database():
    try:
        await diseases_collection.delete_many({})
        if DISEASES_SEED_DATA:
            await diseases_collection.insert_many(DISEASES_SEED_DATA)
        return {"message": f"Successfully reseeded {len(DISEASES_SEED_DATA)} diseases."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
