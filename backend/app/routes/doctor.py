from fastapi import APIRouter, UploadFile, File, HTTPException
from ..ai_engine import AIEngine
from ..database import diseases_collection
from ..models import DiagnosisResponse, DiseaseInfo
import shutil
import os
import uuid

router = APIRouter()
ai_engine = AIEngine()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose_leaf(file: UploadFile = File(...)):
    try:
        # Save upload
        filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Detect
        result = await ai_engine.detect_image(file_path)
        disease_name = result["disease_name"]
        
        # Query DB
        disease_info = await diseases_collection.find_one({"name": disease_name})
        
        if not disease_info:
            # Fallback if DB not seeded or unknown disease
            disease_info = {
                "name": disease_name,
                "treatments": []
            }
            
        return DiagnosisResponse(
            image_url=result["image_url"],
            disease=DiseaseInfo(**disease_info),
            confidence=result["confidence"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
