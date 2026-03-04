from fastapi import APIRouter, UploadFile, File, HTTPException
from app.ai_engine import mock_run_monitor, mock_run_doctor
from app.database import history_collection, disease_collection
from datetime import datetime
import shutil
import os

router = APIRouter()

# --- API 1: MONITOR ---
@router.post("/scan-garden")
async def scan_garden(file: UploadFile = File(...)):
    # 1. Lưu file tạm
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # 2. Gọi AI (Giả)
        result = mock_run_monitor(temp_path)
        
        # 3. Lưu lịch sử vào MongoDB
        record = {
            "type": "monitor",
            "timestamp": datetime.now(),
            "filename": file.filename,
            "result_count": result["count"]
        }
        history_collection.insert_one(record)
        
        return result
    finally:
        # Dọn dẹp file tạm
        if os.path.exists(temp_path):
            os.remove(temp_path)

# --- API 2: DOCTOR ---
@router.post("/diagnose-leaf")
async def diagnose_leaf(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # 1. Gọi AI (Giả)
        ai_result = mock_run_doctor(temp_path)
        disease_name = ai_result["disease_name"]
        
        # 2. Tìm hướng dẫn thuốc trong Database
        # (Nếu chưa có trong DB thì trả về hướng dẫn mặc định)
        db_info = disease_collection.find_one({"name": disease_name})
        advice = db_info["advice"] if db_info else "Hãy cắt tỉa cành bệnh và bón phân cân đối."
        
        # 3. Lưu lịch sử
        history_collection.insert_one({
            "type": "doctor",
            "timestamp": datetime.now(),
            "disease": disease_name,
            "confidence": ai_result["confidence"]
        })
        
        return {
            "disease_name": disease_name,
            "advice": advice,
            "image_url": ai_result["image_url"],
            "confidence": ai_result["confidence"]
        }
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# --- API 3: LẤY LỊCH SỬ (Cho trang Admin/Dashboard) ---
@router.get("/history")
async def get_history():
    # Lấy 10 dòng mới nhất
    logs = list(history_collection.find({}, {"_id": 0}).sort("timestamp", -1).limit(10))
    return logs