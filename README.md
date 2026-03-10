# PlantGuard

**PlantGuard** is a smart agriculture system designed to help farmers monitor crop health and detect diseases using AI. The system features two main modes:
1.  **Monitor Mode (Drone View)**: Analyzes wide-area footage (from drones or CCTV) to detect crop stress and hotspots.
2.  **Doctor Mode (Close-up View)**: Diagnoses specific leaf diseases and provides tailored treatment plans.

## 🚀 Features

### 🔍 Monitor Mode
-   **Video Analysis**: Upload drone footage to automatically detect and highlight areas of concern (Mock detection implemented).
-   **Real-time Live Stream**: Connect to an IP Camera (e.g., DroidCam) via WebSocket for real-time field monitoring.
-   **Alert System**: Displays an alert count for detected issues.

### 🩺 Doctor Mode
-   **Leaf Diagnosis**: Upload a photo of a crop leaf to identify diseases like "Tomato Blight" or "Corn Rust".
-   **Treatment Plans**: Provides a 3-level treatment recommendation (Mild, Moderate, Severe) with actionable steps and product suggestions.

## 🛠 Tech Stack

-   **Backend**: Python (FastAPI), Uvicorn, Motor (Async MongoDB), OpenCV, WebSocket.
-   **Frontend (Web)**: ReactJS (Vite), Tailwind CSS, Lucide-React.
-   **Mobile App**: React Native (Expo), Lucide-React-Native.
-   **Database**: MongoDB.
-   **AI/ML**: Mock AI Engine (Simulating YOLOv8 detection behavior).

## 📂 Project Structure

```text
PlantGuard/
├── backend/            # FastAPI Server
│   ├── app/
│   │   ├── main.py     # Entry point
│   │   ├── ai_engine.py# Mock AI logic & Frame generation
│   │   └── routes/     # API Endpoints (Monitor/Doctor)
│   └── results/        # Processed videos/images
│
├── frontend/           # React Web Client
│   ├── src/
│   │   ├── components/ # Reusable UI (LiveCamera, TreatmentCard)
│   │   └── pages/      # Main Pages (Home, Monitor, Doctor)
│   └── tailwind.config.js
│
└── mobile/             # React Native Mobile App (Expo)
    ├── App.js          # Navigation & Entry
    └── src/
        ├── screens/    # Mobile Screens
        └── api/        # Mobile API Config
```

## 🔧 Installation & Setup

### Prerequisites
-   **Python 3.8+**
-   **Node.js 16+**
-   **MongoDB** (Must be running locally on port `27017`)
-   **Expo Go** app (Installed on your phone for mobile testing)

### 1. Backend Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Start the server:
    ```bash
    uvicorn app.main:app --reload --host 0.0.0.0
    ```
    *Note: Use `--host 0.0.0.0` to allow mobile devices to connect.*

### 2. Frontend (Web) Setup
1.  Open a new terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the application:
    ```bash
    npm run dev
    ```

### 3. Mobile App Setup
1.  Open a new terminal and navigate to the mobile folder:
    ```bash
    cd mobile
    ```
2.  Update Backend IP:
    -   Open `src/api/config.js` and change `LOCAL_IP` to your computer's IP (e.g., `192.168.1.3`).
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start Expo:
    ```bash
    npx expo start
    ```
5.  **Scan the QR Code** with the **Expo Go** app on your phone.


## 📖 Usage Guide

### Using Doctor Mode
1.  Go to the **Doctor** page.
2.  Upload a clear image of a crop leaf.
3.  View the diagnosed disease and confidence score.
4.  Click on the **Treatment Cards** (Mild/Moderate/Severe) to view detailed solutions.

### Using Monitor Mode (Upload)
1.  Go to the **Monitor** page.
2.  Stay on the "Upload Video" tab.
3.  Upload a video file (`.mp4`, etc.).
4.  Watch the processed output with red bounding boxes indicating detected stress.

### Using Monitor Mode (Live Stream)
1.  Go to the **Monitor** page.
2.  Switch to the **Live Camera** tab.
3.  Enter your IP Webcaming URL (e.g., `http://192.168.1.5:4747/video`).
    -   *If you don't have a camera, the system will enter "Simulation Mode" and show a generated stream.*
4.  Click **Start Stream** to begin.

## ⚠️ Notes
-   **Mock AI**: This version uses a simulation engine. Real YOLOv8 models (`.pt` files) should be loaded in `backend/app/ai_engine.py` for production use.
-   **Data**: MongoDB is seeded with sample data ("Tomato Blight", "Corn Rust") on the first run.
