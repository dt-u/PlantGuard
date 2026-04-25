from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .database import seed_db
from .routes import monitor, doctor, admin, auth, history, admin_affiliate, treatments
from .websocket import manager
import os

app = FastAPI(title="PlantGuard API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    try:
        await manager.connect(websocket, user_id)
        print(f"✅ WebSocket connected for user: {user_id}")
        
        try:
            while True:
                # We don't really expect clients to send messages, just keep the connection open
                data = await websocket.receive_text()
                # Echo back or handle any incoming messages if needed
                await websocket.send_text(f"Received: {data}")
        except WebSocketDisconnect:
            print(f"❌ WebSocket disconnected for user: {user_id}")
            manager.disconnect(websocket, user_id)
        except Exception as e:
            print(f"❌ WebSocket error for user {user_id}: {e}")
            manager.disconnect(websocket, user_id)
    except Exception as e:
        print(f"❌ Failed to establish WebSocket connection for user {user_id}: {e}")
        await websocket.close(code=1011, reason="Internal server error")

# Routes
app.include_router(monitor.router, prefix="/api/monitor", tags=["Monitor"])
app.include_router(doctor.router, prefix="/api/doctor", tags=["Doctor"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(history.router, prefix="/api/history", tags=["History"])
app.include_router(treatments.router, prefix="/api/treatments", tags=["Treatments"])
app.include_router(admin_affiliate.router, prefix="/api/admin", tags=["Admin Affiliate"])

# Static Mounts
RESULTS_DIR = os.path.join(os.path.dirname(__file__), "..", "results")
if not os.path.exists(RESULTS_DIR):
    os.makedirs(RESULTS_DIR)
    
app.mount("/results", StaticFiles(directory=RESULTS_DIR), name="results")

@app.on_event("startup")
async def startup_event():
    await seed_db()

@app.get("/")
async def root():
    return {"message": "PlantGuard Backend is Running"}