from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .database import seed_db
from .routes import monitor, doctor, admin
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

# Routes
app.include_router(monitor.router, prefix="/api/monitor", tags=["Monitor"])
app.include_router(doctor.router, prefix="/api/doctor", tags=["Doctor"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

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