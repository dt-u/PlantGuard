# 🌿 PlantGuard - Hệ thống Giám sát & Chẩn đoán Cây trồng Thông minh

**PlantGuard** là một giải pháp nông nghiệp thông minh toàn diện, kết hợp AI để giúp người nông dân giám sát sức khỏe cây trồng và chẩn đoán bệnh lý thời gian thực. Hệ thống cung cấp trải nghiệm đa nền tảng (Web & Mobile) từ giám sát diện rộng đến chẩn đoán chi tiết từng lá cây.

## 🌟 Tính năng nổi bật

### 🔑 Hệ thống Tài khoản & Bảo mật
- **Xác thực người dùng**: Đăng ký/Đăng nhập bảo mật, quản lý profile cá nhân.
- **Lịch sử chẩn đoán**: Lưu trữ toàn bộ kết quả chẩn đoán để theo dõi diễn biến bệnh trạng theo thời gian.
- **Đồng bộ thời gian thực**: Sử dụng WebSocket để cập nhật thông báo và trạng thái hệ thống ngay lập tức.

### 🛰️ Chế độ Giám sát (Monitor Mode)
- **Phân tích Video Drone**: Tải lên video từ drone để tự động quét và phát hiện các vùng cây trồng bị stress hoặc có dấu hiệu dịch bệnh.
- **Live Camera**: Kết nối trực tiếp với camera tại vườn (hỗ trợ RTSP/DroidCam) để giám sát từ xa 24/7.
- **Auto-scan & Dataset Collector**: Tự động chụp ảnh các vùng nghi vấn, cho phép người dùng xác nhận để làm giàu tập dữ liệu huấn luyện AI.
- **Báo cáo hàng ngày**: Tóm tắt các cảnh báo trong ngày và gửi thông báo cho người dùng.

### 🩺 Chế độ Chẩn đoán (Doctor Mode)
- **Chẩn đoán chính xác**: Sử dụng model YOLOv8 chuyên biệt (`best.pt`) để nhận diện 38 loại bệnh và trạng thái cây trồng khác nhau.
- **Phác đồ điều trị**: Cung cấp giải pháp 3 cấp độ (Nhẹ, Trung bình, Nặng) với các bước hành động cụ thể.
- **Affiliate Integration**: Gợi ý các sản phẩm điều trị cụ thể kèm link mua hàng trực tiếp (Shopee Affiliate).

### 📅 Lộ trình Chăm sóc (Care Routine)
- **Lập lịch tự động**: Tự động tạo lịch trình chăm sóc cây (tưới nước, bón phân, phun thuốc) dựa trên kết quả chẩn đoán.
- **Nhắc nhở thông minh**: Gửi thông báo đẩy (Push Notification) và Email nhắc nhở hàng ngày.
- **Theo dõi tiến độ**: Ghi nhận trạng thái hoàn thành công việc để đảm bảo cây trồng được chăm sóc đúng phác đồ.

### 🌤️ Dự báo & Cảnh báo Thời tiết (Weather Alerts)
- **Dự báo 3 ngày**: Tích hợp dữ liệu thời tiết thực tế từ Open-Meteo.
- **Cảnh báo thông minh**: Tự động đưa ra cảnh báo về nguy cơ Nấm bệnh (khi ẩm cao), Sốc nhiệt, Bão hoặc Sương mù dựa trên dữ liệu dự báo.

## 🛠 Công nghệ sử dụng

- **Backend**: Python (FastAPI), Uvicorn, Motor (Async MongoDB), OpenCV, WebSocket, APScheduler.
- **AI/ML**: YOLOv8 (Ultralytics) với hai model chuyên biệt cho Chẩn đoán (`best.pt`) và Giám sát (`monitor.pt`).
- **Frontend (Web)**: ReactJS (Vite), Tailwind CSS, Lucide-React, Framer Motion.
- **Mobile App**: React Native (Expo), Lucide-React-Native.
- **Database**: MongoDB.

## 📂 Cấu trúc dự án

```text
PlantGuard/
├── backend/            # FastAPI Server
│   ├── app/
│   │   ├── ai_engine.py# Xử lý AI & Frame Processing
│   │   ├── routes/     # Các API Endpoints (Monitor, Doctor, Auth, Routine, Weather,...)
│   │   ├── jobs/       # Scheduler cho các tác vụ chạy ngầm
│   │   ├── services/   # Email & Notification services
│   │   └── models/     # YOLO models & Pydantic schemas
│   └── results/        # Lưu trữ ảnh/video đã xử lý
│
├── frontend/           # Web Client (React)
└── mobile/             # Mobile Application (React Native)
```

## 🔧 Cài đặt & Chạy hệ thống

### Điều kiện cần
- **Python 3.9+**
- **Node.js 18+**
- **MongoDB**

### 1. Cài đặt Backend
1. Di chuyển vào thư mục backend: `cd backend`
2. Cài đặt thư viện: `pip install -r requirements.txt`
3. Cấu hình `.env`: Copy từ `.env.example` và điền thông tin (MongoDB URI, SMTP cho Email).
4. Chạy server: `uvicorn app.main:app --reload`

### 2. Cài đặt Frontend (Web)
1. Di chuyển vào thư mục frontend: `cd frontend`
2. Cài đặt: `npm install`
3. Chạy: `npm run dev`

### 3. Cài đặt Mobile
1. Di chuyển vào thư mục mobile: `cd mobile`
2. Cài đặt: `npm install`
3. Chạy: `npx expo start`

## ⚠️ Lưu ý quan trọng
- **Model AI**: Đảm bảo các file `best.pt` và `monitor.pt` đã được đặt trong thư mục `backend/app/models/`.
- **Dữ liệu mẫu**: Hệ thống sẽ tự động khởi tạo dữ liệu (Seeding) về các loại bệnh và sản phẩm điều trị trong lần chạy đầu tiên.
