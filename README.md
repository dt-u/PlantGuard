# 🌿 PlantGuard - Smart Crop Protection & Monitoring System

**PlantGuard** is a comprehensive smart agriculture solution that leverages AI to help farmers monitor crop health and diagnose diseases in real-time. The system provides a cross-platform experience (Web & Mobile) ranging from wide-area monitoring to detailed plant-level diagnostics.

## 🌟 Key Features

### 🔑 Account System & Security
- **User Authentication**: Secure registration and login, with personal profile management.
- **Diagnostic History**: Stores all diagnostic results for tracking disease progression over time.
- **Real-time Synchronization**: Uses WebSockets for instant updates on notifications and system status.

### 🛰️ Monitor Mode
- **Drone Video Analysis**: Upload drone footage for automated scanning and detection of stressed plants or disease hotspots.
- **Live Camera**: Connect directly to field cameras (supporting RTSP/DroidCam) for 24/7 remote monitoring.
- **Auto-scan & Dataset Collector**: Automatically captures suspicious zones, allowing users to verify them to enrich the AI training dataset.
- **Daily Reports**: Summarizes daily alerts and sends automated reports to users.

### 🩺 Doctor Mode
- **Precision Diagnosis**: Uses a specialized YOLO26 model (`best.pt`) to identify 38 different types of diseases and plant states.
- **Treatment Protocols**: Provides 3-level solutions (Mild, Moderate, Severe) with specific actionable steps.
- **Affiliate Integration**: Recommends specific treatment products with direct purchase links (Shopee Affiliate).

### 📅 Care Routine
- **Automated Scheduling**: Automatically generates care schedules (watering, fertilizing, spraying) based on diagnostic results.
- **Smart Reminders**: Sends daily push notifications and emails to ensure timely plant care.
- **Progress Tracking**: Records task completion status to ensure plants follow the prescribed protocol.

### 🌤️ Weather Alerts
- **3-Day Forecast**: Integrates real-time weather data from Open-Meteo.
- **Predictive Alerts**: Automatically issues warnings for Fungal risks (high humidity), Heat stress, Storms, or Fog based on forecast data.

## 🛠 Tech Stack

- **Backend**: Python (FastAPI), Uvicorn, Motor (Async MongoDB), OpenCV, WebSocket, APScheduler.
- **AI/ML**: YOLO26 (Ultralytics) with specialized models for Diagnosis (`best.pt`) and Monitoring (`monitor.pt`).
- **Frontend (Web)**: ReactJS (Vite), Tailwind CSS, Lucide-React, Framer Motion.
- **Mobile App**: React Native (Expo), Lucide-React-Native.
- **Database**: MongoDB.

## 📂 Project Structure

```text
PlantGuard/
├── backend/            # FastAPI Server
│   ├── app/
│   │   ├── ai_engine.py# AI Processing & Frame Processing
│   │   ├── routes/     # API Endpoints (Monitor, Doctor, Auth, Routine, Weather, etc.)
│   │   ├── jobs/       # Scheduler for background tasks
│   │   ├── services/   # Email & Notification services
│   │   └── models/     # YOLO models & Pydantic schemas
│   └── results/        # Storage for processed media
│
├── frontend/           # Web Client (React)
└── mobile/             # Mobile Application (React Native)
```

## 🔧 Installation & Setup

### Prerequisites
- **Python 3.9+**
- **Node.js 18+**
- **MongoDB**

### 1. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Configure `.env`: Copy from `.env.example` and fill in details (MongoDB URI, SMTP for Email).
4. Start the server: `uvicorn app.main:app --reload`

### 2. Frontend Setup (Web)
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the application: `npm run dev`

### 3. Mobile App Setup
1. Navigate to the mobile directory: `cd mobile`
2. Install dependencies: `npm install`
3. Start Expo: `npx expo start`

## ⚠️ Important Notes
- **AI Models**: Ensure `best.pt` and `monitor.pt` are placed in the `backend/app/models/` directory.
- **Data Seeding**: The system will automatically seed disease data and treatment products during the first run.
