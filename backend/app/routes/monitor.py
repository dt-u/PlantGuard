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
from ..database.mongodb import mongodb, captures_collection

router = APIRouter()
ai_engine = AIEngine()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

RESULTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "results")
PENDING_DIR = os.path.join(RESULTS_DIR, "user_dataset", "pending")
VERIFIED_DIR = os.path.join(RESULTS_DIR, "user_dataset", "verified")

for d in [PENDING_DIR, VERIFIED_DIR]:
    if not os.path.exists(d):
        os.makedirs(d)

jobs = {}
auto_scan_tasks = {}

class AutoScanRequest(BaseModel):
    camera_url: str
    user_id: str

class AutoScanStopRequest(BaseModel):
    user_id: str

class VerifyCaptureRequest(BaseModel):
    capture_id: str
    is_correct: bool

async def bg_auto_scan(user_id: str, camera_url: str):
    print(f"Started auto-scan for {user_id} on {camera_url}")
    # Cache for spatial-temporal check: {(class_id, x_norm, y_norm): timestamp}
    # We use a simplified key for spatial check (rounded coordinates)
    recent_captures = {} 

    while auto_scan_tasks.get(user_id, {}).get('active', False):
        try:
            frame, boxes = await ai_engine.scan_single_frame(camera_url)
            if frame is not None and boxes:
                height, width, _ = frame.shape
                now = datetime.now()
                
                for box in boxes:
                    x1, y1, x2, y2, conf, cls = box
                    if conf > 0.5:
                        # Normalize coordinates
                        cx = (x1 + x2) / 2 / width
                        cy = (y1 + y2) / 2 / height
                        w = (x2 - x1) / width
                        h = (y2 - y1) / height
                        
                        # Spatial-temporal check
                        # Round to nearest 0.1 for ~10% spatial grid matching
                        grid_x = round(cx, 1)
                        grid_y = round(cy, 1)
                        key = (cls, grid_x, grid_y)
                        
                        last_time = recent_captures.get(key)
                        if last_time and (now - last_time).total_seconds() < 1800: # 30 mins
                            continue
                        
                        # Mark as captured
                        recent_captures[key] = now
                        
                        # Prepare files
                        cap_id = str(uuid.uuid4())
                        img_name = f"{cap_id}.jpg"
                        txt_name = f"{cap_id}.txt"
                        img_path = os.path.join(PENDING_DIR, img_name)
                        txt_path = os.path.join(PENDING_DIR, txt_name)
                        
                        # Save Image & Label (YOLO format)
                        await asyncio.to_thread(cv2.imwrite, img_path, frame)
                        save_cls = cls if cls >= 0 else 0
                        label_line = f"{save_cls} {cx:.6f} {cy:.6f} {w:.6f} {h:.6f}"
                        with open(txt_path, "w") as f:
                            f.write(label_line)
                        
                        # Save to MongoDB
                        await captures_collection.insert_one({
                            "capture_id": cap_id,
                            "user_id": user_id,
                            "camera_url": camera_url,
                            "class_id": save_cls,
                            "confidence": conf,
                            "coordinates": {"cx": cx, "cy": cy, "w": w, "h": h},
                            "status": "pending",
                            "created_at": now
                        })
                        
                        print(f"Captured new unique region: {cap_id} for user {user_id}")

            # Clean up old cache entries (> 30 mins)
            now = datetime.now()
            recent_captures = {k: v for k, v in recent_captures.items() if (now - v).total_seconds() < 1800}
            
            await asyncio.sleep(10)
        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"Auto scan error for {user_id}: {e}")
            await asyncio.sleep(10)

@router.get("/pending-captures")
async def get_pending_captures(user_id: str):
    cursor = captures_collection.find({"user_id": user_id, "status": "pending"}).sort("created_at", -1)
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        # Add image URL for frontend
        doc["image_url"] = f"/results/user_dataset/pending/{doc['capture_id']}.jpg"
        results.append(doc)
    return results

@router.post("/verify-capture")
async def verify_capture(req: VerifyCaptureRequest):
    doc = await captures_collection.find_one({"capture_id": req.capture_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Capture not found")
    
    img_name = f"{req.capture_id}.jpg"
    txt_name = f"{req.capture_id}.txt"
    
    old_img = os.path.join(PENDING_DIR, img_name)
    old_txt = os.path.join(PENDING_DIR, txt_name)
    
    if req.is_correct:
        # Move to verified
        new_img = os.path.join(VERIFIED_DIR, img_name)
        new_txt = os.path.join(VERIFIED_DIR, txt_name)
        if os.path.exists(old_img): shutil.move(old_img, new_img)
        if os.path.exists(old_txt): shutil.move(old_txt, new_txt)
        
        await captures_collection.update_one(
            {"capture_id": req.capture_id},
            {"$set": {"status": "verified"}}
        )
        return {"status": "verified"}
    else:
        # Delete rejected
        if os.path.exists(old_img): os.remove(old_img)
        if os.path.exists(old_txt): os.remove(old_txt)
        
        await captures_collection.delete_one({"capture_id": req.capture_id})
        return {"status": "rejected_and_deleted"}

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
