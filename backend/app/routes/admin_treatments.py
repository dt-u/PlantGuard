from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import List, Optional
from ..models.treatment import Treatment, TreatmentCreate, TreatmentUpdate
from ..database.mongodb import treatments_collection
from bson import ObjectId
from datetime import datetime
import json

router = APIRouter()

@router.get("/treatments", response_model=List[Treatment])
async def get_all_treatments_admin():
    """Get all treatments for admin management"""
    try:
        treatments = []
        cursor = treatments_collection.find({})
        async for document in cursor:
            treatments.append(Treatment(**document))
        return treatments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching treatments: {str(e)}")

@router.post("/treatments", response_model=Treatment)
async def create_treatment_admin(treatment: TreatmentCreate):
    """Create a new treatment (Admin only)"""
    try:
        treatment_dict = treatment.dict()
        treatment_dict["created_at"] = datetime.utcnow()
        treatment_dict["updated_at"] = datetime.utcnow()
        
        # Set fallback keyword if not provided
        if not treatment_dict.get("search_fallback_keyword"):
            treatment_dict["search_fallback_keyword"] = treatment_dict["product_name"]
        
        result = await treatments_collection.insert_one(treatment_dict)
        
        # Return created treatment
        created_treatment = await treatments_collection.find_one({"_id": result.inserted_id})
        return Treatment(**created_treatment)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating treatment: {str(e)}")

@router.put("/treatments/{treatment_id}", response_model=Treatment)
async def update_treatment_admin(treatment_id: str, treatment_update: TreatmentUpdate):
    """Update a treatment (Admin only)"""
    try:
        if not ObjectId.is_valid(treatment_id):
            raise HTTPException(status_code=400, detail="Invalid treatment ID")
        
        # Check if treatment exists
        existing_treatment = await treatments_collection.find_one({"_id": ObjectId(treatment_id)})
        if not existing_treatment:
            raise HTTPException(status_code=404, detail="Treatment not found")
        
        # Update fields
        update_dict = treatment_update.dict(exclude_unset=True)
        update_dict["updated_at"] = datetime.utcnow()
        
        # Set fallback keyword if product_name is updated and no fallback keyword provided
        if "product_name" in update_dict and not update_dict.get("search_fallback_keyword"):
            update_dict["search_fallback_keyword"] = update_dict["product_name"]
        
        result = await treatments_collection.update_one(
            {"_id": ObjectId(treatment_id)},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Treatment not found")
        
        # Return updated treatment
        updated_treatment = await treatments_collection.find_one({"_id": ObjectId(treatment_id)})
        return Treatment(**updated_treatment)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating treatment: {str(e)}")

@router.delete("/treatments/{treatment_id}")
async def delete_treatment_admin(treatment_id: str):
    """Delete a treatment (Admin only)"""
    try:
        if not ObjectId.is_valid(treatment_id):
            raise HTTPException(status_code=400, detail="Invalid treatment ID")
        
        result = await treatments_collection.delete_one({"_id": ObjectId(treatment_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Treatment not found")
        
        return {"message": "Treatment deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting treatment: {str(e)}")

@router.post("/treatments/bulk", response_model=List[Treatment])
async def bulk_create_treatments_admin(treatments: List[TreatmentCreate]):
    """Bulk create treatments (Admin only)"""
    try:
        created_treatments = []
        
        for treatment in treatments:
            treatment_dict = treatment.dict()
            treatment_dict["created_at"] = datetime.utcnow()
            treatment_dict["updated_at"] = datetime.utcnow()
            
            # Set fallback keyword if not provided
            if not treatment_dict.get("search_fallback_keyword"):
                treatment_dict["search_fallback_keyword"] = treatment_dict["product_name"]
            
            result = await treatments_collection.insert_one(treatment_dict)
            created_treatment = await treatments_collection.find_one({"_id": result.inserted_id})
            created_treatments.append(Treatment(**created_treatment))
        
        return created_treatments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error bulk creating treatments: {str(e)}")

@router.post("/treatments/import")
async def import_treatments_from_json(file: UploadFile = File(...)):
    """Import treatments from JSON file (Admin only)"""
    try:
        if not file.filename.endswith('.json'):
            raise HTTPException(status_code=400, detail="Only JSON files are supported")
        
        content = await file.read()
        data = json.loads(content.decode('utf-8'))
        
        if not isinstance(data, list):
            raise HTTPException(status_code=400, detail="JSON file must contain an array of treatments")
        
        created_treatments = []
        
        for treatment_data in data:
            # Validate required fields
            required_fields = ["disease_id", "level", "identification_guide", "action", "product_name"]
            for field in required_fields:
                if field not in treatment_data:
                    raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
            
            treatment_dict = {
                **treatment_data,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            # Set fallback keyword if not provided
            if not treatment_dict.get("search_fallback_keyword"):
                treatment_dict["search_fallback_keyword"] = treatment_dict["product_name"]
            
            result = await treatments_collection.insert_one(treatment_dict)
            created_treatment = await treatments_collection.find_one({"_id": result.inserted_id})
            created_treatments.append(Treatment(**created_treatment))
        
        return {
            "message": f"Successfully imported {len(created_treatments)} treatments",
            "treatments": created_treatments
        }
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error importing treatments: {str(e)}")

@router.get("/treatments/export")
async def export_treatments_admin():
    """Export all treatments as JSON (Admin only)"""
    try:
        treatments = []
        cursor = treatments_collection.find({})
        async for document in cursor:
            # Convert ObjectId to string for JSON serialization
            doc = dict(document)
            doc["_id"] = str(doc["_id"])
            doc["created_at"] = doc["created_at"].isoformat()
            doc["updated_at"] = doc["updated_at"].isoformat()
            treatments.append(doc)
        
        return {
            "treatments": treatments,
            "total_count": len(treatments),
            "exported_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting treatments: {str(e)}")

@router.post("/treatments/{treatment_id}/affiliate-url")
async def update_affiliate_url(treatment_id: str, affiliate_url: str):
    """Quick update for affiliate URL (Admin only)"""
    try:
        if not ObjectId.is_valid(treatment_id):
            raise HTTPException(status_code=400, detail="Invalid treatment ID")
        
        result = await treatments_collection.update_one(
            {"_id": ObjectId(treatment_id)},
            {"$set": {"affiliate_url": affiliate_url, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Treatment not found")
        
        return {"message": "Affiliate URL updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating affiliate URL: {str(e)}")

@router.get("/treatments/stats")
async def get_treatments_stats():
    """Get treatments statistics (Admin only)"""
    try:
        total_treatments = await treatments_collection.count_documents({})
        treatments_with_affiliate = await treatments_collection.count_documents({"affiliate_url": {"$ne": None}})
        treatments_without_affiliate = total_treatments - treatments_with_affiliate
        
        # Group by disease
        pipeline = [
            {"$group": {"_id": "$disease_id", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        disease_counts = []
        async for doc in treatments_collection.aggregate(pipeline):
            disease_counts.append({"disease_id": doc["_id"], "treatment_count": doc["count"]})
        
        return {
            "total_treatments": total_treatments,
            "treatments_with_affiliate": treatments_with_affiliate,
            "treatments_without_affiliate": treatments_without_affiliate,
            "affiliate_coverage": round((treatments_with_affiliate / total_treatments * 100), 2) if total_treatments > 0 else 0,
            "disease_breakdown": disease_counts
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")
