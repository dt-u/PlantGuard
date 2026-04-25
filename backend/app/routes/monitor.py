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
import cv2
from pydantic import BaseModel
from ..database.mongodb import mongodb

router = APIRouter()
ai_engine = AIEngine()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

RESULTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "results")

jobs = {}
auto_scan_tasks = {}

class AutoScanRequest(BaseModel):
    camera_url: str
    user_id: str

class AutoScanStopRequest(BaseModel):
    user_id: str

async def bg_auto_scan(user_id: str, camera_url: str):
    print(f"Started auto-scan for {user_id} on {camera_url}")
    while auto_scan_tasks.get(user_id, {}).get('active', False):
        try:
            frame, boxes = await ai_engine.scan_single_frame(camera_url)
            if frame is not None and boxes:
                found_disease = False
                for box in boxes:
                    conf = box[4]
                    if conf > 0.5:
                        found_disease = True
                        break
                
                if found_disease:
                    dataset_dir = os.path.join(RESULTS_DIR, "user_dataset", "unhealthy_zones")
                    if not os.path.exists(dataset_dir):
                        os.makedirs(dataset_dir)
                    img_name = f"auto_{uuid.uuid4()}.jpg"
                    img_path = os.path.join(dataset_dir, img_name)
                    await asyncio.to_thread(cv2.imwrite, img_path, frame)

                    if user_id and user_id != "anonymous":
                        from ..services.notification import send_push_notification
                        await send_push_notification(
                            user_id=str(user_id),
                            n_type="alert",
                            title="Cảnh báo từ Giám sát ngầm",
                            body=f"Phát hiện khu vực có dấu hiệu dịch bệnh từ Camera lúc {datetime.now().strftime('%H:%M')}"
                        )
                    
                    # Sleep 1 minute after finding disease
                    await asyncio.sleep(60)
                    continue

            # Default sleep 10s
            await asyncio.sleep(10)
        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"Auto scan error for {user_id}: {e}")
            await asyncio.sleep(10)

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

            from ..services.notification import send_push_notification
            await send_push_notification(
                user_id=str(user_id),
                n_type="drone",
                title="Cập nhật Phân tích Drone",
                body=message,
                data={"job_id": job_id}
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

@router.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connection accepted")
    try:
        # Wait for client to send the camera URL with a timeout or safer receive
        try:
            camera_url = await asyncio.wait_for(websocket.receive_text(), timeout=5.0)
            print(f"Client requested stream from: {camera_url}")
        except asyncio.TimeoutError:
            print("Timeout waiting for camera URL from client")
            await websocket.close(code=1000)
            return

        async for frame_data in ai_engine.generate_frames(camera_url):
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

@router.post("/auto-scan/start")
async def start_auto_scan(req: AutoScanRequest):
    user_id = req.user_id
    if user_id in auto_scan_tasks and auto_scan_tasks[user_id]['active']:
        return {"status": "already_running"}
    
    auto_scan_tasks[user_id] = {'active': True}
    task = asyncio.create_task(bg_auto_scan(user_id, req.camera_url))
    auto_scan_tasks[user_id]['task'] = task
    
    return {"status": "started"}

@router.post("/auto-scan/stop")
async def stop_auto_scan(req: AutoScanStopRequest):
    user_id = req.user_id
    if user_id in auto_scan_tasks:
        auto_scan_tasks[user_id]['active'] = False
        task = auto_scan_tasks[user_id].get('task')
        if task:
            task.cancel()
        del auto_scan_tasks[user_id]
        return {"status": "stopped"}
    return {"status": "not_running"}

@router.get("/auto-scan/status/{user_id}")
async def get_auto_scan_status(user_id: str):
    is_active = user_id in auto_scan_tasks and auto_scan_tasks[user_id].get('active', False)
    return {"active": is_active}
