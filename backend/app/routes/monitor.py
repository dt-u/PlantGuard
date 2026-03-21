from fastapi import APIRouter, UploadFile, File, HTTPException, WebSocket, WebSocketDisconnect
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

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "monitor"}

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

        async for frame_base64 in ai_engine.generate_frames(camera_url):
            await websocket.send_text(frame_base64)
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
