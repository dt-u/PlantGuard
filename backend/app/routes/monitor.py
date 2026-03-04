from fastapi import APIRouter, UploadFile, File, HTTPException, WebSocket, WebSocketDisconnect
from ..ai_engine import AIEngine
from ..models import AnalysisResponse
import shutil
import os
import uuid

router = APIRouter()
ai_engine = AIEngine()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_video(file: UploadFile = File(...)):
    try:
        # Save upload
        filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Analyze
        result = await ai_engine.detect_video(file_path)
        
        return AnalysisResponse(
            video_url=result["video_url"],
            alert_count=result["alert_count"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        # Wait for client to send the camera URL
        camera_url = await websocket.receive_text()
        print(f"Client requested stream from: {camera_url}")
        
        async for frame_base64 in ai_engine.generate_frames(camera_url):
            await websocket.send_text(frame_base64)
            
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket Error: {e}")
        await websocket.close()
