from fastapi import APIRouter, UploadFile, File, HTTPException
from ..ai_engine import AIEngine
from ..database import diseases_collection
from ..database.mongodb import get_treatments_by_disease
from ..models import DiagnosisResponse, DiseaseInfo
import shutil
import os
import uuid
import time

router = APIRouter()
ai_engine = AIEngine()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose_leaf(file: UploadFile = File(...)):
    start_time = time.time()
    
    try:
        # Validate file
        if not file or not file.filename:
            raise HTTPException(status_code=422, detail="Không có file được tải lên.")
        
        # Check file size (max 10MB)
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Reset to start
        
        max_size = 10 * 1024 * 1024  # 10MB
        if file_size > max_size:
            raise HTTPException(status_code=413, detail="File quá lớn. Vui lòng chọn file dưới 10MB.")
        
        # Check file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=422, detail="Loại file không được hỗ trợ. Vui lòng chọn file ảnh (JPEG, PNG, WebP).")
        
        print(f"📤 Received file: {file.filename}, Size: {file_size} bytes, Type: {file.content_type}")
        
        # Save upload
        filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        print(f"💾 Saving file to: {file_path}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        print(f"✅ File saved successfully")
        
        # Detect disease
        print(f"🤖 Starting AI detection...")
        detection_start = time.time()
        result = await ai_engine.detect_image(file_path)
        detection_time = time.time() - detection_start
        print(f"✅ AI detection completed in {detection_time:.2f}s")
        
        disease_name = result["disease_name"]
        confidence = result["confidence"]
        
        print(f"🔍 AI Result: {disease_name} (confidence: {confidence:.2f})")
        
        # Query database for disease and treatments
        print(f"🔎 Querying database for disease: {disease_name}")
        db_start = time.time()
        
        # Get disease info
        disease_info = await diseases_collection.find_one({"name": disease_name})
        
        if not disease_info:
            print(f"❌ Disease not found in database: {disease_name}")
            raise HTTPException(
                status_code=404, 
                detail=f"Mô hình AI nhận diện đây là '{disease_name}', nhưng thông tin chi tiết về loại bệnh này hiện chưa có trong cơ sở dữ liệu."
            )
        
        # Get treatments for this disease
        treatments = await get_treatments_by_disease(disease_name)
        print(f"📋 Found {len(treatments)} treatments for {disease_name}")
        
        # Add treatments to disease info
        disease_info["treatments"] = treatments
        
        db_time = time.time() - db_start
        print(f"✅ Database query completed in {db_time:.2f}s")
        
        total_time = time.time() - start_time
        print(f"✅ Diagnosis completed successfully in {total_time:.2f}s")
        
        return DiagnosisResponse(
            image_url=result["image_url"],
            disease=DiseaseInfo(**disease_info),
            confidence=confidence
        )
        
    except HTTPException:
        raise
    except Exception as e:
        total_time = time.time() - start_time
        print(f"❌ Diagnosis error after {total_time:.2f}s: {str(e)}")
        raise HTTPException(status_code=500, detail="Máy chủ gặp sự cố khi xử lý hình ảnh. Vui lòng thử lại sau.")
    finally:
        # Clean up temporary file if it exists
        if 'file_path' in locals() and os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"🗑️ Cleaned up temporary file: {file_path}")
            except Exception as cleanup_error:
                print(f"⚠️ Failed to clean up file {file_path}: {cleanup_error}")
