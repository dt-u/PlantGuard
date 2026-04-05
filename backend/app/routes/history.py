from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from bson import ObjectId

from ..database.mongodb import mongodb
from ..websocket import manager

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
        # Add local timestamp if not provided or to ensure local time is used
        # We prefer local time for display convenience in this specific app context
        record.created_at = datetime.now()
        
        # Insert into database
        result = await mongodb.history.insert_one(record.dict())
        
        # Get the inserted record
        saved_record = await mongodb.history.find_one({"_id": result.inserted_id})
        
        # Trigger Notification
        if record.user_id and record.user_id != "anonymous":
            try:
                disease_name = record.disease.common_name or record.disease.name
                await mongodb.notifications.insert_one({
                    "user_id": str(record.user_id),
                    "type": "health",
                    "title": "Chẩn đoán mới đã lưu",
                    "message": f"Kết quả chẩn đoán cho cây {disease_name} đã được lưu vào lịch sử của bạn.",
                    "is_read": False,
                    "created_at": datetime.now()
                })
            except Exception as noti_err:
                print(f"Error creating notification: {noti_err}")
        
        # Convert ObjectId to string
        saved_record["id"] = str(saved_record.pop("_id"))
        
        # Broadcast save event
        if record.user_id:
            await manager.broadcast_to_user(
                str(record.user_id), 
                {"action": "history_updated", "type": "save", "record_id": saved_record["id"]}
            )
        
        return HistoryRecordResponse(
            success=True,
            data=DiagnosisRecord(**saved_record),
            message="Lưu lịch sử chẩn đoán thành công"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi lưu lịch sử: {str(e)}")

@router.get("/all", response_model=HistoryResponse)
@router.get("/list", response_model=HistoryResponse)
async def get_history(user_id: Optional[str] = None, limit: int = 50, skip: int = 0):
    """Lấy lịch sử chẩn đoán của người dùng"""
    try:
        # Build query - if user_id is "anonymous" or empty, might want to handle differently
        # But usually we filter by user_id if provided
        query = {}
        if user_id and user_id != "anonymous" and user_id != "undefined":
            query = {"user_id": user_id}
        
        # Get records with pagination
        cursor = mongodb.history.find(query).sort("created_at", -1).skip(skip).limit(limit)
        records = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string and format
        formatted_records = []
        for record in records:
            try:
                record["id"] = str(record.pop("_id"))
                # Use construct or handle missing fields to avoid Pydantic validation errors causing 500
                formatted_records.append(DiagnosisRecord(**record))
            except Exception as parse_err:
                print(f"Error parsing history record: {parse_err}")
                continue
        
        # Get total count
        total = await mongodb.history.count_documents(query)
        
        return HistoryResponse(
            success=True,
            data=formatted_records,
            total=total,
            message="Lấy lịch sử thành công"
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
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
        # Convert string ID to ObjectId
        object_id = ObjectId(diagnosis_id)
        
        # Get record first to find user_id for broadcasting
        record = await mongodb.history.find_one({"_id": object_id})
        if not record:
            raise HTTPException(status_code=404, detail="Không tìm thấy bản ghi chẩn đoán")
            
        user_id = record.get("user_id")
        
        # Delete record
        result = await mongodb.history.delete_one({"_id": object_id})
        
        # Broadcast delete event
        if user_id:
            await manager.broadcast_to_user(
                str(user_id), 
                {"action": "history_updated", "type": "delete", "record_id": diagnosis_id}
            )
        
        return {"success": True, "message": "Xóa bản ghi thành công"}
        
    except HTTPException:
        # Re-raise HTTP exceptions (like 404)
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi xóa: {str(e)}")
