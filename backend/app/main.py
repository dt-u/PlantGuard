from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .database import seed_db, connect_to_mongodb, disconnect_from_mongodb
from .seed_treatments import seed_treatments
from .routes import monitor, doctor, admin, auth, history, admin_affiliate, treatments, notification, routine, weather
from .websocket import manager
from .jobs.scheduler import setup_scheduler
import os

app = FastAPI(title="PlantGuard API")

# Scheduler
scheduler = setup_scheduler()

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
        
        try:
            while True:
                # We don't really expect clients to send messages, just keep the connection open
                data = await websocket.receive_text()
                # Echo back or handle any incoming messages if needed
                await websocket.send_text(f"Received: {data}")
        except WebSocketDisconnect:
            manager.disconnect(websocket, user_id)
        except Exception as e:
            print(f"WebSocket error for user {user_id}: {e}")
            manager.disconnect(websocket, user_id)
    except Exception as e:
        print(f"Failed to establish WebSocket connection for user {user_id}: {e}")
        await websocket.close(code=1011, reason="Internal server error")

# Routes
app.include_router(monitor.router, prefix="/api/monitor", tags=["Monitor"])
app.include_router(doctor.router, prefix="/api/doctor", tags=["Doctor"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(history.router, prefix="/api/history", tags=["History"])
app.include_router(treatments.router, prefix="/api/treatments", tags=["Treatments"])
app.include_router(admin_affiliate.router, prefix="/api/admin", tags=["Admin Affiliate"])
app.include_router(notification.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(routine.router, prefix="/api/routine", tags=["Routine"])
app.include_router(weather.router, prefix="/api", tags=["Weather"])

# Static Mounts
RESULTS_DIR = os.path.join(os.path.dirname(__file__), "..", "results")
DATASET_DIR = os.path.join(RESULTS_DIR, "user_dataset")
PENDING_DIR = os.path.join(DATASET_DIR, "pending")
VERIFIED_DIR = os.path.join(DATASET_DIR, "verified")

for d in [RESULTS_DIR, DATASET_DIR, PENDING_DIR, VERIFIED_DIR]:
    if not os.path.exists(d):
        os.makedirs(d)

app.mount("/results", StaticFiles(directory=RESULTS_DIR), name="results")

@app.on_event("startup")
async def startup_event():
    await connect_to_mongodb()
    await seed_db()
    await seed_treatments()
    # Thêm logic tự động cập nhật link affiliate nếu cần
    from .seed_treatments import update_affiliate_links
    await update_affiliate_links()
    scheduler.start()

@app.on_event("shutdown")
async def shutdown_event():
    await disconnect_from_mongodb()
    scheduler.shutdown()

@app.get("/")
async def root():
    return {"message": "PlantGuard Backend is Running"}