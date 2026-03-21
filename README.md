# PlantGuard - Hệ Thống Bảo Vệ Cây Trồng Thông Minh

**PlantGuard** là giải pháp nông nghiệp thông minh tích hợp AI nhằm hỗ trợ nông dân giám sát sức khỏe cây trồng và phát hiện bệnh lý kịp thời. Hệ thống cung cấp trải nghiệm toàn diện từ giám sát diện rộng đến chẩn đoán chi tiết.

## 🌟 Tính Năng Nổi Bật

### 🔑 Hệ Thống Tài Khoản & Bảo Mật
-   **Đăng ký & Đăng nhập**: Hệ thống xác thực người dùng an toàn với tính năng ẩn/hiện mật khẩu.
-   **Lịch sử Chẩn đoán**: Người dùng đã đăng nhập có thể lưu trữ kết quả chẩn đoán vào lịch sử cá nhân để theo dõi diễn biến bệnh lý qua thời gian.
-   **Quyền Truy cập**: Bảo vệ các tính năng quan trọng (như lưu lịch sử) yêu cầu đăng nhập qua `ProtectedRoute`.

### 🔍 Chế Độ Giám Sát (Monitor Mode)
-   **Phân tích Video Drone**: Tải lên các đoạn phim từ Drone để tự động nhận diện vùng cây stress và điểm nóng bệnh dịch (Mô phỏng detection YOLOv8).
-   **Luồng Trực Tiếp (Live Stream)**: Kết nối với IP Camera (DroidCam) qua WebSocket để giám sát thực địa thời gian thực.
-   **Hệ Thống Cảnh Báo**: Hiển thị số lượng cảnh báo và nhật ký phát hiện theo thời gian thực.
-   **Quản lý Nhật ký**: Tính năng "Xóa nhật ký" giúp làm sạch dữ liệu giám sát cũ chỉ với một chạm.

### 🩺 Bác Sĩ Cây Trồng (Doctor Mode)
-   **Chẩn đoán Chính xác**: Tải ảnh lá cây để AI nhận diện các loại bệnh như "Bệnh mốc sương cà chua" hay "Rỉ sắt ngô".
-   **Phác đồ Điều trị**: Cung cấp giải pháp theo 3 cấp độ (Nhẹ, Trung bình, Nặng) với các bước hành động cụ thể và gợi ý sản phẩm điều trị.

### 🎨 Giao Diện Người Dùng (UI/UX)
-   **Trang Chủ Tối Giản**: Thiết kế gói gọn trong một màn hình (Single-screen) với 2 lối tắt lớn vào Monitor và Doctor.
-   **Thiết Kế Premium**: Sử dụng phong cách Glassmorphism, hiệu ứng chuyển cảnh mượt mà và hệ thống biểu tượng Lucide-React hiện đại.
-   **Tương thích Đa nền tảng**: Trải nghiệm đồng nhất giữa Web và Mobile.

## 🛠 Công Nghệ Sử Dụng (Tech Stack)

-   **Backend**: Python (FastAPI), Uvicorn, Motor (Async MongoDB), OpenCV, WebSocket, Passlib (Bcrypt), Pydantic.
-   **AI/ML**: YOLOv8 (Ultralytics) - Engine giả lập mô phỏng hành vi nhận diện chuyên sâu.
-   **Frontend (Web)**: ReactJS (Vite), Tailwind CSS, Lucide-React, Axios, Framer Motion (Transitions).
-   **Mobile App**: React Native (Expo), Lucide-React-Native.
-   **Cơ sở Dữ liệu**: MongoDB.

## 📂 Cấu Trúc Dự Án

```text
PlantGuard/
├── backend/            # Máy chủ FastAPI
│   ├── app/
│   │   ├── main.py     # Điểm khởi chạy (Entry point)
│   │   ├── ai_engine.py# Logic AI & Xử lý khung hình
│   │   ├── auth.py     # Quản lý Đăng ký/Đăng nhập
│   │   ├── routes/     # Các API Endpoints (Monitor/Doctor/History)
│   │   └── seed_data.py# Khởi tạo dữ liệu mẫu
│   └── results/        # Kho lưu trữ video/hình ảnh đã xử lý
│
├── frontend/           # Client Web (React)
│   ├── src/
│   │   ├── components/ # UI Reusable (Navbar, FileUpload, Dialogs)
│   │   ├── contexts/   # Quản lý State toàn cục (AuthContext)
│   │   └── pages/      # Các trang chính (Home, Monitor, Doctor, History)
│   └── vite.config.ts
│
└── mobile/             # Ứng dụng Mobile (Expo)
    ├── App.js          # Điều hướng & Khởi chạy
    └── src/            # Logic và giao diện Mobile
```

## 🔧 Cài Đặt & Thiết Lập

### Điều kiện tiên quyết
-   **Python 3.8+**
-   **Node.js 16+**
-   **MongoDB** (Chạy tại port `27017` mặc định)

### 1. Cài đặt Backend
1.  Di chuyển vào thư mục backend:
    ```bash
    cd backend
    ```
2.  Cài đặt các thư viện cần thiết:
    ```bash
    pip install -r requirements.txt
    ```
3.  Cấu hình Môi trường:
    -   Tạo file `.env` từ file mẫu: `copy .env.example .env`
4.  Khởi chạy server:
    ```bash
    uvicorn app.main:app --reload --host 0.0.0.0
    ```

### 2. Cài đặt Frontend (Web)
1.  Mở terminal mới và vào thư mục frontend:
    ```bash
    cd frontend
    ```
2.  Cài đặt dependencies:
    ```bash
    npm install
    ```
3.  Khởi chạy ứng dụng:
    ```bash
    npm run dev
    ```

### 3. Cài đặt Mobile App
1.  Vào thư mục mobile và cài đặt:
    ```bash
    cd mobile
    npm install
    ```
2.  Khởi chạy Expo:
    ```bash
    npx expo start
    ```
3.  Quét mã QR bằng ứng dụng **Expo Go** trên điện thoại.

## 📖 Hướng Dẫn Sử Dụng

1.  **Trang chủ**: Chọn trực tiếp "Bắt đầu Giám sát" hoặc "Chẩn đoán ngay". Nên Đăng ký/Đăng nhập trước để có trải nghiệm đầy đủ.
2.  **Giám sát**: Chuyển đổi giữa tab Live Cam và Upload Video. Sử dụng icon Thùng rác để làm sạch nhật ký giám sát.
3.  **Bác sĩ**: Tải ảnh lá cây, xem kết quả chẩn đoán và bấm **Lưu vào lịch sử** để theo dõi sau này.
4.  **Lịch sử**: Truy cập từ menu Profile (khi đã đăng nhập) để xem lại tất cả các lần chẩn đoán cũ kèm chi tiết phác đồ điều trị.

## ⚠️ Lưu ý Quan trọng
-   **Mock AI**: Phiên bản này sử dụng engine mô phỏng. Để triển khai thực tế, hãy thay thế logic trong `backend/app/ai_engine.py` bằng model YOLOv8 thực thụ (`.pt`).
-   **Dữ liệu**: MongoDB sẽ tự động được "seed" dữ liệu mẫu về các bệnh lý phổ biến trong lần chạy đầu tiên.
