from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from ..models.treatment import Treatment, TreatmentCreate, TreatmentUpdate
from ..database.mongodb import treatments_collection
from bson import ObjectId
from datetime import datetime
import json

router = APIRouter()

# Collection name
treatments_collection = treatments_collection

@router.get("/affiliate/treatments", response_model=List[Treatment])
async def get_all_treatments():
    """Get all treatments for affiliate management"""
    try:
        treatments = []
        cursor = treatments_collection.find({})
        async for document in cursor:
            document["_id"] = str(document["_id"])
            treatments.append(Treatment(**document))
        return treatments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching treatments: {str(e)}")

@router.get("/affiliate/treatments/{treatment_id}", response_model=Treatment)
async def get_treatment_by_id(treatment_id: str):
    """Get treatment by ID for affiliate management"""
    try:
        if not ObjectId.is_valid(treatment_id):
            raise HTTPException(status_code=400, detail="Invalid treatment ID")
            
        treatment = await treatments_collection.find_one({"_id": ObjectId(treatment_id)})
        if not treatment:
            raise HTTPException(status_code=404, detail="Treatment not found")
        
        treatment["_id"] = str(treatment["_id"])
        return Treatment(**treatment)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching treatment: {str(e)}")

@router.post("/affiliate/treatments", response_model=Treatment)
async def create_treatment(treatment: TreatmentCreate):
    """Create new treatment with affiliate link"""
    try:
        # Create treatment document
        treatment_dict = treatment.dict()
        
        # Add timestamps
        treatment_dict["created_at"] = datetime.utcnow()
        treatment_dict["updated_at"] = datetime.utcnow()
        
        # Insert into database
        result = await treatments_collection.insert_one(treatment_dict)
        
        # Retrieve the created document
        created_treatment = await treatments_collection.find_one({"_id": result.inserted_id})
        
        return Treatment(**created_treatment)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating treatment: {str(e)}")

@router.put("/affiliate/treatments/{treatment_id}", response_model=Treatment)
async def update_treatment(treatment_id: str, treatment_update: TreatmentUpdate):
    """Update treatment with affiliate link"""
    try:
        if not ObjectId.is_valid(treatment_id):
            raise HTTPException(status_code=400, detail="Invalid treatment ID")
            
        # Check if treatment exists
        existing = await treatments_collection.find_one({"_id": ObjectId(treatment_id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Treatment not found")
        
        # Update fields
        update_data = treatment_update.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        # Update in database
        await treatments_collection.update_one(
            {"_id": ObjectId(treatment_id)},
            {"$set": update_data}
        )
        
        # Retrieve updated document
        updated_treatment = await treatments_collection.find_one({"_id": ObjectId(treatment_id)})
        updated_treatment["_id"] = str(updated_treatment["_id"])
        
        return Treatment(**updated_treatment)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating treatment: {str(e)}")

@router.delete("/affiliate/treatments/{treatment_id}")
async def delete_treatment(treatment_id: str):
    """Delete treatment"""
    try:
        if not ObjectId.is_valid(treatment_id):
            raise HTTPException(status_code=400, detail="Invalid treatment ID")
            
        # Check if treatment exists
        existing = await treatments_collection.find_one({"_id": ObjectId(treatment_id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Treatment not found")
        
        # Delete from database
        result = await treatments_collection.delete_one({"_id": ObjectId(treatment_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Treatment not found")
        
        return {"message": "Treatment deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting treatment: {str(e)}")

@router.post("/affiliate/treatments/{treatment_id}/affiliate-link")
async def update_affiliate_link(treatment_id: str, affiliate_data: dict):
    """Update affiliate link for a treatment"""
    try:
        if not ObjectId.is_valid(treatment_id):
            raise HTTPException(status_code=400, detail="Invalid treatment ID")
            
        # Check if treatment exists
        existing = await treatments_collection.find_one({"_id": ObjectId(treatment_id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Treatment not found")
        
        # Validate affiliate URL
        affiliate_url = affiliate_data.get("affiliate_url")
        if affiliate_url and not affiliate_url.startswith(('http://', 'https://')):
            raise HTTPException(status_code=400, detail="Affiliate URL must start with http:// or https://")
        
        # Update affiliate link
        update_data = {
            "affiliate_url": affiliate_url,
            "search_fallback_keyword": affiliate_data.get("search_fallback_keyword"),
            "updated_at": datetime.utcnow()
        }
        
        await treatments_collection.update_one(
            {"_id": ObjectId(treatment_id)},
            {"$set": update_data}
        )
        
        # Retrieve updated document
        updated_treatment = await treatments_collection.find_one({"_id": ObjectId(treatment_id)})
        updated_treatment["_id"] = str(updated_treatment["_id"])
        
        return Treatment(**updated_treatment)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating affiliate link: {str(e)}")

@router.get("/affiliate/treatments/disease/{disease_id}", response_model=List[Treatment])
async def get_treatments_by_disease(disease_id: str):
    """Get treatments by disease ID for affiliate management"""
    try:
        treatments = []
        cursor = treatments_collection.find({"disease_id": disease_id})
        async for document in cursor:
            document["_id"] = str(document["_id"])
            treatments.append(Treatment(**document))
        return treatments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching treatments for disease: {str(e)}")

@router.get("/affiliate/stats")
async def get_affiliate_stats():
    """Get statistics for affiliate management"""
    try:
        # Total treatments
        total_treatments = await treatments_collection.count_documents({})
        
        # Treatments with affiliate links
        with_affiliate = await treatments_collection.count_documents({"affiliate_url": {"$ne": None}})
        
        # Treatments without affiliate links
        without_affiliate = total_treatments - with_affiliate
        
        # By disease
        pipeline = [
            {"$group": {"_id": "$disease_id", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        disease_stats = []
        async for doc in treatments_collection.aggregate(pipeline):
            disease_stats.append({"disease_id": doc["_id"], "treatment_count": doc["count"]})
        
        return {
            "total_treatments": total_treatments,
            "with_affiliate_links": with_affiliate,
            "without_affiliate_links": without_affiliate,
            "affiliate_coverage": f"{(with_affiliate/total_treatments*100):.1f}%" if total_treatments > 0 else "0%",
            "by_disease": disease_stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stats: {str(e)}")

@router.post("/affiliate/batch-update")
async def batch_update_affiliate_links(batch_data: dict):
    """Batch update affiliate links for multiple treatments"""
    try:
        treatment_updates = batch_data.get("treatments", [])
        updated_count = 0
        
        for update in treatment_updates:
            treatment_id = update.get("id")
            affiliate_url = update.get("affiliate_url")
            search_fallback_keyword = update.get("search_fallback_keyword")
            
            if not treatment_id:
                continue
            
            # Validate affiliate URL
            if affiliate_url and not affiliate_url.startswith(('http://', 'https://')):
                continue
            
            # Update treatment
            update_data = {
                "updated_at": datetime.utcnow()
            }
            
            if affiliate_url is not None:
                update_data["affiliate_url"] = affiliate_url
            if search_fallback_keyword is not None:
                update_data["search_fallback_keyword"] = search_fallback_keyword
            
            result = await treatments_collection.update_one(
                {"id": treatment_id},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                updated_count += 1
        
        return {
            "message": f"Successfully updated {updated_count} treatments",
            "updated_count": updated_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in batch update: {str(e)}")
