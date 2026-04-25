import asyncio
import os
from app.services.email import send_care_reminder_email

async def main():
    # Lấy email từ .env để test gửi cho chính mình
    test_email = os.getenv("SMTP_USER")
    
    if not test_email:
        print("❌ Lỗi: Chưa cấu hình SMTP_USER trong file .env")
        return

    print(f"📧 Đang gửi email test đến: {test_email}...")
    
    success = send_care_reminder_email(
        user_email=test_email,
        user_name="Người dùng PlantGuard",
        plant_name="Cây Cà Chua Test",
        task_title="Tưới nước buổi sáng",
        task_desc="Hãy tưới 500ml nước ấm vào gốc cây để đảm bảo độ ẩm."
    )

    if success:
        print("✅ Gửi email thành công! Hãy kiểm tra hòm thư của bạn (bao gồm cả mục Spam).")
    else:
        print("❌ Gửi email thất bại. Hãy kiểm tra lại SMTP_USER và SMTP_PASSWORD trong file .env")

if __name__ == "__main__":
    asyncio.run(main())
