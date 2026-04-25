from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .database import seed_db, connect_to_mongodb, disconnect_from_mongodb
from .routes import monitor, doctor, admin, auth, history, routine
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
    await manager.connect(websocket, user_id)
    try:
        while True:
            # We don't really expect clients to send messages, just keep the connection open
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)

# Routes
app.include_router(monitor.router, prefix="/api/monitor", tags=["Monitor"])
app.include_router(doctor.router, prefix="/api/doctor", tags=["Doctor"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(history.router, prefix="/api/history", tags=["History"])
app.include_router(routine.router, prefix="/api/routine", tags=["Routine"])

# Static Mounts
RESULTS_DIR = os.path.join(os.path.dirname(__file__), "..", "results")
if not os.path.exists(RESULTS_DIR):
    os.makedirs(RESULTS_DIR)

app.mount("/results", StaticFiles(directory=RESULTS_DIR), name="results")

@app.on_event("startup")
async def startup_event():
    await connect_to_mongodb()
    await seed_db()
    scheduler.start()

@app.on_event("shutdown")
async def shutdown_event():
    await disconnect_from_mongodb()
    scheduler.shutdown()

@app.get("/")
async def root():
    return {"message": "PlantGuard Backend is Running"}