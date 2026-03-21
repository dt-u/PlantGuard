from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from bson import ObjectId

from ..database.mongodb import mongodb

router = APIRouter()

from ..models import DiagnosisRecord, DiagnosisResponse as AIDiagnosisResponse

class HistoryRecordResponse(BaseModel):
    success: bool
    data: Optional[DiagnosisRecord] = None
    message: Optional[str] = None

class HistoryResponse(BaseModel):
    success: bool
    data: List[DiagnosisRecord]
    total: int
    message: Optional[str] = None

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "history"}

@router.post("/save", response_model=HistoryRecordResponse)
async def save_diagnosis(record: DiagnosisRecord):
    """Lưu một bản ghi chẩn đoán mới"""
    try:
        # Add timestamp if not provided
        if not record.created_at:
            record.created_at = datetime.utcnow()
        
        # Insert into database
        result = await mongodb.history.insert_one(record.dict())
        
        # Get the inserted record
        saved_record = await mongodb.history.find_one({"_id": result.inserted_id})
        
        # Convert ObjectId to string
        saved_record["id"] = str(saved_record.pop("_id"))
        
        return HistoryRecordResponse(
            success=True,
            data=DiagnosisRecord(**saved_record),
            message="Lưu lịch sử chẩn đoán thành công"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi lưu lịch sử: {str(e)}")

@router.get("/all", response_model=HistoryResponse)
async def get_history(user_id: Optional[str] = "default_user", limit: int = 20, skip: int = 0):
    """Lấy lịch sử chẩn đoán của người dùng"""
    try:
        # Build query
        query = {"user_id": user_id} if user_id else {}
        
        # Get records with pagination
        cursor = mongodb.history.find(query).sort("created_at", -1).skip(skip).limit(limit)
        records = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string and format
        formatted_records = []
        for record in records:
            record["id"] = str(record.pop("_id"))
            formatted_records.append(DiagnosisRecord(**record))
        
        # Get total count
        total = await mongodb.history.count_documents(query)
        
        return HistoryResponse(
            success=True,
            data=formatted_records,
            total=total,
            message="Lấy lịch sử thành công"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi lấy lịch sử: {str(e)}")

@router.get("/{diagnosis_id}", response_model=HistoryRecordResponse)
async def get_diagnosis_detail(diagnosis_id: str):
    """Lấy chi tiết một bản ghi chẩn đoán"""
    try:
        # Convert string ID to ObjectId and find record
        object_id = ObjectId(diagnosis_id)
        record = await mongodb.history.find_one({"_id": object_id})
        
        if not record:
            raise HTTPException(status_code=404, detail="Không tìm thấy bản ghi chẩn đoán")
        
        # Convert ObjectId to string
        record["id"] = str(record.pop("_id"))
        
        return HistoryRecordResponse(
            success=True,
            data=DiagnosisRecord(**record),
            message="Lấy chi tiết thành công"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi lấy chi tiết: {str(e)}")

@router.delete("/{diagnosis_id}")
async def delete_diagnosis(diagnosis_id: str):
    """Xóa một bản ghi chẩn đoán"""
    try:
        # Convert string ID to ObjectId and delete record
        object_id = ObjectId(diagnosis_id)
        result = await mongodb.history.delete_one({"_id": object_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy bản ghi chẩn đoán")
        
        return {"success": True, "message": "Xóa bản ghi thành công"}
        
    except HTTPException:
        # Re-raise HTTP exceptions (like 404)
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi xóa: {str(e)}")
