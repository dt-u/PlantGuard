from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from ..models.treatment import Treatment, TreatmentCreate, TreatmentUpdate
from ..database.mongodb import mongodb, get_treatments_by_disease
from bson import ObjectId
from datetime import datetime
import json

router = APIRouter()

# Collection name
treatments_collection = mongodb.treatments

@router.get("/", response_model=List[Treatment])
async def get_all_treatments():
    """Get all treatments"""
    try:
        treatments = []
        cursor = treatments_collection.find({})
        async for document in cursor:
            treatments.append(Treatment(**document))
        return treatments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching treatments: {str(e)}")

@router.get("/disease/{disease_id}", response_model=List[Treatment])
async def get_treatments_by_disease_id(disease_id: str):
    """Get treatments by disease ID"""
    try:
        treatments_data = await get_treatments_by_disease(disease_id)
        treatments = []
        for document in treatments_data:
            treatments.append(Treatment(**document))
        return treatments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching treatments for disease {disease_id}: {str(e)}")

@router.get("/{treatment_id}", response_model=Treatment)
async def get_treatment(treatment_id: str):
    """Get treatment by ID"""
    try:
        if not ObjectId.is_valid(treatment_id):
            raise HTTPException(status_code=400, detail="Invalid treatment ID")
        
        treatment = await treatments_collection.find_one({"_id": ObjectId(treatment_id)})
        if not treatment:
            raise HTTPException(status_code=404, detail="Treatment not found")
        
        return Treatment(**treatment)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching treatment: {str(e)}")

@router.post("/", response_model=Treatment)
async def create_treatment(treatment: TreatmentCreate):
    """Create a new treatment"""
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

@router.put("/{treatment_id}", response_model=Treatment)
async def update_treatment(treatment_id: str, treatment_update: TreatmentUpdate):
    """Update a treatment"""
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

@router.delete("/{treatment_id}")
async def delete_treatment(treatment_id: str):
    """Delete a treatment"""
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

@router.post("/bulk-create", response_model=List[Treatment])
async def bulk_create_treatments(treatments: List[TreatmentCreate]):
    """Create multiple treatments at once"""
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

@router.get("/search/affiliate/{product_name}")
async def search_treatment_by_product(product_name: str):
    """Search for treatment by product name to get affiliate URL"""
    try:
        # Product name mapping - frontend names to database names
        product_mapping = {
            "Lưu huỳnh (Sulfur dust)": "Lưu huỳnh 80WP",
            "Thuốc đặc trị nấm Triazole": "Myclobutanil 40WP", 
            "Chlorothalonil hoặc Mancozeb": "Copper Oxychloride 85WP",
            "Sulfur dust": "Lưu huỳnh 80WP",
            "Triazole": "Myclobutanil 40WP",
            "Mancozeb": "Copper Oxychloride 85WP",
            "Chlorothalonil": "Copper Oxychloride 85WP",
            "Lưu huỳnh": "Lưu huỳnh 80WP",
            "Myclobutanil": "Myclobutanil 40WP",
            "Copper": "Copper Oxychloride 85WP",
            "Sulfur": "Lưu huỳnh 80WP",
            # Database product names (direct mapping)
            "Nước vôi trong": "Nước vôi trong",
            "Captan 80WP": "Captan 80WP",
            "Anvil 5SC Difenoconazole": "Anvil 5SC Difenoconazole",
            "Kéo tỉa cành": "Kéo tỉa cành",
            "Lưu huỳnh 80WP": "Lưu huỳnh 80WP",
            "Myclobutanil 40WP": "Myclobutanil 40WP",
            "Dịch chiết hành tây": "Dịch chiết hành tây",
            "Copper Oxychloride 85WP": "Copper Oxychloride 85WP",
            "Streptomycin 1.5SL": "Streptomycin 1.5SL",
            "Phân hữu cơ vi sinh Tricho": "Phân hữu cơ vi sinh Tricho",
            "Nước sạch": "Nước sạch",
            "Phân NPK 20-20-20": "Phân NPK 20-20-20"
        }
        
        # Try mapping first
        mapped_name = product_mapping.get(product_name)
        if mapped_name:
            treatment = await treatments_collection.find_one({
                "product_name": {"$regex": mapped_name, "$options": "i"},
                "affiliate_url": {"$ne": None}
            })
            if treatment:
                return {"affiliate_url": treatment["affiliate_url"], "product_name": treatment["product_name"]}
        
        # Try exact match
        treatment = await treatments_collection.find_one({
            "product_name": {"$regex": product_name, "$options": "i"},
            "affiliate_url": {"$ne": None}
        })
        
        # If not found, try keyword matching
        if not treatment:
            # Extract keywords from search term
            keywords = product_name.lower().replace("(", "").replace(")", "").replace("hoặc", " ").split()
            
            # Try each keyword
            for keyword in keywords:
                if len(keyword) > 2:  # Skip very short keywords
                    treatment = await treatments_collection.find_one({
                        "product_name": {"$regex": keyword, "$options": "i"},
                        "affiliate_url": {"$ne": None}
                    })
                    if treatment:
                        break
        
        # If still not found, try partial matching
        if not treatment:
            # Try to match any part of the search term
            treatment = await treatments_collection.find_one({
                "product_name": {"$regex": product_name.split()[0], "$options": "i"},
                "affiliate_url": {"$ne": None}
            })
        
        if not treatment:
            raise HTTPException(status_code=404, detail="No affiliate link found for this product")
        
        return {"affiliate_url": treatment["affiliate_url"], "product_name": treatment["product_name"]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching for affiliate link: {str(e)}")
