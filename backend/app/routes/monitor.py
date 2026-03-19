from fastapi import APIRouter, UploadFile, File, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
from ..ai_engine import AIEngine
from ..models import AnalysisResponse
import shutil
import os
import uuid
import asyncio

router = APIRouter()
ai_engine = AIEngine()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

jobs = {}

async def run_analysis(job_id: str, file_path: str):
    def progress_cb(pct):
        jobs[job_id]["progress"] = pct
        
    try:
        result = await ai_engine.detect_video(file_path, progress_callback=progress_cb)
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["result"] = result
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)

@router.post("/analyze")
async def analyze_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    try:
        job_id = str(uuid.uuid4())
        filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        jobs[job_id] = {"status": "processing", "progress": 0, "result": None, "error": None}
        background_tasks.add_task(run_analysis, job_id, file_path)
        
        return {"job_id": job_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/job-status/{job_id}")
async def get_job_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]

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
