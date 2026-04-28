from fastapi import APIRouter, UploadFile, File, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
from typing import Optional
from fastapi.responses import FileResponse
from ..ai_engine import AIEngine
from ..models import AnalysisResponse
import shutil
import os
import uuid
import asyncio
import pandas as pd
import zipfile
import tempfile
from datetime import datetime

router = APIRouter()
ai_engine = AIEngine()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

jobs = {}

async def run_analysis(job_id: str, file_path: str, user_id: Optional[str] = None):
    def progress_cb(pct):
        jobs[job_id]["progress"] = pct
        
    try:
        result = await ai_engine.detect_video(file_path, progress_callback=progress_cb)
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["result"] = result
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)
    
    # Trigger Notification if user_id is provided
    if user_id and user_id != "anonymous":
        try:
            status_text = "hoàn tất" if jobs[job_id]["status"] == "completed" else "thất bại"
            alert_count = result.get("alert_count", 0) if jobs[job_id]["status"] == "completed" else 0
            
            message = f"Phân tích Drone đã {status_text}. "
            if jobs[job_id]["status"] == "completed":
                message += f"Tìm thấy {alert_count} cảnh báo rủi ro. Xem chi tiết tại tab Giám sát."
            else:
                message += "Đã xảy ra lỗi trong quá trình xử lý tệp video."

            from ..services.notification_service import create_and_send_notification
            await create_and_send_notification(
                user_id=str(user_id),
                type="drone",
                title="Cập nhật Phân tích Drone",
                message=message
            )
        except Exception as noti_err:
            print(f"Error creating drone notification: {noti_err}")

@router.post("/analyze")
async def analyze_video(background_tasks: BackgroundTasks, file: UploadFile = File(...), user_id: Optional[str] = None):
    try:
        job_id = str(uuid.uuid4())
        filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        jobs[job_id] = {"status": "processing", "progress": 0, "result": None, "error": None, "user_id": user_id}
        background_tasks.add_task(run_analysis, job_id, file_path, user_id)
        
        return {"job_id": job_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/job-status/{job_id}")
async def get_job_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]

@router.get("/logs/excel/{job_id}")
async def download_logs_excel(job_id: str):
    if job_id not in jobs or not jobs[job_id]["result"]:
        raise HTTPException(status_code=404, detail="Kết quả không tồn tại hoặc Server đã khởi động lại")
    
    logs = jobs[job_id]["result"].get("detailed_logs", [])
    
    # Prepare data for Excel
    data = []
    for i, log in enumerate(logs, 1):
        data.append({
            "STT": i,
            "Thời gian": log["time"],
            "Loại": log["type"].upper(),
            "Nội dung": log["msg"]
        })
    
    df = pd.DataFrame(data)
    
    # Create temp file
    temp_dir = tempfile.gettempdir()
    excel_filename = f"PlantGuard_Report_{job_id[:8]}.xlsx"
    excel_path = os.path.join(temp_dir, excel_filename)
    
    # Save to Excel
    with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Nhật ký Phân tích')
        
    return FileResponse(
        excel_path, 
        filename=excel_filename,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

@router.get("/zip/{job_id}")
async def download_combined_zip(job_id: str):
    if job_id not in jobs or not jobs[job_id]["result"]:
        raise HTTPException(status_code=404, detail="Kết quả không tồn tại hoặc Server đã khởi động lại")
    
    result = jobs[job_id]["result"]
    video_rel_path = result["video_url"].lstrip("/") # results/processed_...
    # Correct path: backend is 2 levels up from routes/monitor.py
    video_abs_path = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), video_rel_path))
    
    if not os.path.exists(video_abs_path):
        raise HTTPException(status_code=404, detail="Tệp video không tìm thấy trên máy chủ")
    
    temp_dir = tempfile.gettempdir()
    zip_filename = f"PlantGuard_Full_Results_{job_id[:8]}.zip"
    zip_path = os.path.join(temp_dir, zip_filename)
    
    # Create Excel logs first
    logs = result.get("detailed_logs", [])
    data = [{"STT": i, "Thời gian": l["time"], "Loại": l["type"].upper(), "Nội dung": l["msg"]} for i, l in enumerate(logs, 1)]
    df = pd.DataFrame(data)
    excel_filename = f"Nhat_ky_Phan_tich_{job_id[:8]}.xlsx"
    excel_path = os.path.join(temp_dir, excel_filename)
    df.to_excel(excel_path, index=False)
    
    # Create Zip
    with zipfile.ZipFile(zip_path, 'w') as zf:
        zf.write(video_abs_path, arcname=os.path.basename(video_abs_path))
        zf.write(excel_path, arcname=excel_filename)
    
    return FileResponse(
        zip_path,
        filename=zip_filename,
        media_type="application/zip"
    )

@router.websocket("/ws/live/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    print(f"WebSocket connection accepted for user: {user_id}")
    try:
        # Wait for client to send the camera URL with a timeout or safer receive
        try:
            camera_url = await asyncio.wait_for(websocket.receive_text(), timeout=5.0)
            print(f"Client requested stream from: {camera_url}")
        except asyncio.TimeoutError:
            print("Timeout waiting for camera URL from client")
            await websocket.close(code=1000)
            return

        async for frame_data in ai_engine.generate_frames(camera_url, user_id=user_id):
            # frame_data is now a JSON string from ai_engine
            await websocket.send_text(frame_data)
            # Small sleep to prevent overwhelming the socket
            await asyncio.sleep(0.01)
            
    except WebSocketDisconnect:
        print("Client disconnected normally")
    except Exception as e:
        print(f"WebSocket Error in endpoint: {e}")
        try:
            await websocket.close()
        except:
            pass
