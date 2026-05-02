import asyncio
import os
from app.services.email import send_care_reminder_email

async def main():
    # Lấy email từ .env để test gửi cho chính mình
    test_email = os.getenv("SMTP_USER")
    
    if not test_email:
        print("ERROR: SMTP_USER not configured in .env")
        return

    print(f"Email: Sending test email to: {test_email}...")
    
    success = send_care_reminder_email(
        user_email=test_email,
        user_name="PlantGuard User",
        plant_name="Tomato Test",
        task_title="Morning Watering",
        task_desc="Please water the plant with 500ml of warm water."
    )

    if success:
        print("SUCCESS: Email sent successfully! Please check your inbox (including Spam).")
    else:
        print("ERROR: Email failed to send. Please check SMTP_USER and SMTP_PASSWORD in .env")

if __name__ == "__main__":
    asyncio.run(main())
