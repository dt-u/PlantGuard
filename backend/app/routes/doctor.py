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

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "doctor"}

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
            raise HTTPException(
                status_code=404, 
                detail=f"Mô hình AI nhận diện đây là '{disease_name}', nhưng thông tin chi tiết về loại bệnh này hiện chưa có trong cơ sở dữ liệu."
            )
            
        return DiagnosisResponse(
            image_url=result["image_url"],
            disease=DiseaseInfo(**disease_info),
            confidence=result["confidence"]
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Diagnosis error: {e}")
        raise HTTPException(status_code=500, detail="Máy chủ gặp sự cố khi xử lý hình ảnh. Vui lòng thử lại sau.")
