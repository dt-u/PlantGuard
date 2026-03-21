# PlantGuard

**PlantGuard** is a smart agriculture system designed to help farmers monitor crop health and detect diseases using AI. The system features two main modes:
1.  **Monitor Mode (Drone View)**: Analyzes wide-area footage (from drones or CCTV) to detect crop stress and hotspots.
2.  **Doctor Mode (Close-up View)**: Diagnoses specific leaf diseases and provides tailored treatment plans.

## 🚀 Features

### 🔍 Monitor Mode
-   **Video Analysis**: Upload drone footage to automatically detect and highlight areas of concern (Mock detection implemented).
-   **Real-time Live Stream**: Connect to an IP Camera (e.g., DroidCam) via WebSocket for real-time field monitoring.
-   **Alert System**: Displays an alert count for detected issues.
-   **Log Management**: One-tap "Clear Logs" functionality to keep the surveillance log clean.
-   **Technical Transparency**: Integrated technical disclaimers explaining AI inference limitations.

### 🩺 Doctor Mode
-   **Leaf Diagnosis**: Upload a photo of a crop leaf to identify diseases like "Tomato Blight" or "Corn Rust".
-   **Treatment Plans**: Provides a 3-level treatment recommendation (Mild, Moderate, Severe) with actionable steps and product suggestions.

## 🛠 Tech Stack

-   **Backend**: Python (FastAPI), Uvicorn, Motor (Async MongoDB), OpenCV, WebSocket.
-   **Frontend (Web)**: ReactJS (Vite), Tailwind CSS, Lucide-React.
-   **Mobile App**: React Native (Expo), Lucide-React-Native.
-   **Database**: MongoDB.
-   **AI/ML**: Mock AI Engine (Simulating YOLOv8 detection behavior).
-   **Design**: Premium, state-of-the-art UI with glassmorphism, dynamic transitions, and cross-platform branding.

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
3.  Configure Environment Variables:
    -   Copy the provided example environment file:
        ```bash
        copy .env.example .env
        ```
    -   Update `.env` with your actual configuration if necessary (e.g., custom MongoDB URI).
4.  Start the server:
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
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start Expo:
    ```bash
    npx expo start
    ```
4.  **Scan the QR Code** with the **Expo Go** app on your phone.
    -   *Note: The app automatically detects your computer's IP via Expo Constants.*

## 📖 Usage Guide

### Using Monitor Mode
1.  **Tab Switcher**: Toggle between **Live Cam** and **Upload Video**.
2.  **Live Cam**: Enter your DroidCam URL. Enjoy **Auto-Rotation** (landscape) and **Keyboard persistence** for seamless starts.
3.  **Log Management**: Use the **Trash Icon** next to log headers to clear detection history.
4.  **Technical Insights**: Refer to the **Technical Disclaimer** at the bottom for AI confidence context.

### Using Doctor Mode
1.  Upload a clear image of a crop leaf.
2.  View the diagnosed disease and confidence score.
3.  Click on the **Treatment Cards** (Mild/Moderate/Severe) for tailored solutions.


## ⚠️ Notes
-   **Mock AI**: This version uses a simulation engine. Real YOLOv8 models (`.pt` files) should be loaded in `backend/app/ai_engine.py` for production use.
-   **Data**: MongoDB is seeded with sample data ("Tomato Blight", "Corn Rust") on the first run.
