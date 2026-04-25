# PlantGuard - Smart Crop Protection System

**PlantGuard** is an AI-powered smart agriculture solution designed to help farmers monitor crop health and detect diseases in real-time. The system provides a comprehensive experience, ranging from wide-area monitoring to detailed diagnostics.

## 🌟 Key Features

### 🔑 Account System & Security
-   **User Authentication**: Secure registration and login functionality with password visibility toggles.
-   **Diagnostic History**: Logged-in users can store diagnostic results in their personal history to track disease progression over time.
-   **Access Control**: Critical features (such as saving history) are protected and require authentication via `ProtectedRoute`.

### 🔍 Monitor Mode
-   **Drone Video Analysis**: Upload drone footage for automated identification of plant stress zones and disease hotspots (Simulated YOLO26 detection).
-   **Live Streaming**: Connect to field IP Cameras (e.g., DroidCam) via WebSockets for real-time remote monitoring.
-   **Alert System**: Visualizes the number of alerts and maintains a real-time detection log.
-   **Log Management**: "Clear Logs" feature allows for cleaning up old monitoring data with a single tap.

### 🩺 Doctor Mode
-   **Precision Diagnosis**: Upload leaf images for AI-driven identification of diseases such as "Tomato Late Blight" or "Corn Rust."
-   **Treatment Protocols**: Provides a 3-level solution (Light, Medium, Severe) with specific actionable steps and recommended treatment products.

### 🎨 UI/UX Design
-   **Minimalist Home**: A streamlined single-screen interface with quick access to Monitor and Doctor modes.
-   **Premium Aesthetics**: Modern Glassmorphism styling, smooth transitions, and a professional Lucide icon set.
-   **Cross-Platform**: A consistent and responsive experience across both Web and Mobile platforms.

## 🛠 Tech Stack

-   **Backend**: Python (FastAPI), Uvicorn, Motor (Async MongoDB), OpenCV, WebSocket, Passlib (Bcrypt), Pydantic.
-   **AI/ML**: YOLO26 (Ultralytics) - Simulated engine for advanced detection patterns.
-   **Frontend (Web)**: ReactJS (Vite), Tailwind CSS, Lucide-React, Axios, Framer Motion (Transitions).
-   **Mobile App**: React Native (Expo), Lucide-React-Native.
-   **Database**: MongoDB.

## 📂 Project Structure

```text
PlantGuard/
├── backend/            # FastAPI Server
│   ├── app/
│   │   ├── main.py     # Application Entry point
│   │   ├── ai_engine.py# AI Logic & Frame Processing
│   │   ├── auth.py     # Auth & Security Management
│   │   ├── routes/     # API Endpoints (Monitor/Doctor/History)
│   │   └── seed_data.py# Sample Data Initializer
│   └── results/        # Storage for processed media
│
├── frontend/           # Web Client (React)
│   ├── src/
│   │   ├── components/ # Reusable UI (Navbar, FileUpload, Dialogs)
│   │   ├── contexts/   # Global State Management (AuthContext)
│   │   └── pages/      # Key Pages (Home, Monitor, Doctor, History)
│   └── vite.config.ts
│
└── mobile/             # Mobile Application (Expo)
    ├── App.js          # Navigation & Entry point
    └── src/            # Mobile Logic and UI Components
```

## 🔧 Installation & Setup

### Prerequisites
-   **Python 3.8+**
-   **Node.js 16+**
-   **MongoDB** (Default port `27017`)

### 1. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configure Environment:
    -   Create `.env` from the template: `cp .env.example .env` (or `copy .env.example .env` on Windows).
4.  Start the server:
    ```bash
    uvicorn app.main:app --reload --host 0.0.0.0
    ```

### 2. Frontend Setup (Web)
1.  Open a new terminal and enter the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the application:
    ```bash
    npm run dev
    ```

### 3. Mobile App Setup
1.  Enter the mobile directory and install:
    ```bash
    cd mobile
    npm install
    ```
2.  Launch Expo:
    ```bash
    npx expo start
    ```
3.  Scan the QR code using the **Expo Go** app on your physical device.

## 📖 User Guide

1.  **Home**: Select "Start Monitoring" or "Diagnose Now." We recommend registering/logging in first for the full experience.
2.  **Monitor**: Toggle between "Live Cam" and "Upload Video." Use the "Trash" icon to clear your detection logs.
3.  **Doctor**: Upload a photo of a leaf, view the AI diagnosis, and click **Save to History** for future tracking.
4.  **History**: Access your personal profile menu (when logged in) to review past diagnoses and treatment protocols.

## ⚠️ Important Notes
-   **Mock AI**: This version uses a simulation engine. For production deployment, replace the logic in `backend/app/ai_engine.py` with a real YOLO26 model (`.pt`).
-   **Data Initialization**: MongoDB will automatically seed sample disease data during the first run.
