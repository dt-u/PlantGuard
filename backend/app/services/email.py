import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Configuration (In production, use environment variables)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SENDER_EMAIL = SMTP_USER

def send_care_reminder_email(user_email, user_name, plant_name, task_title, task_desc):
    """
    Sends a styled HTML email reminder for a care routine task.
    """
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"DEBUG: [Email MOCK] To: {user_email}, Subject: Nhắc nhở chăm sóc {plant_name}")
        print(f"Content: {task_title} - {task_desc}")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"🌱 Nhắc nhở chăm sóc {plant_name}: {task_title}"
        msg["From"] = f"PlantGuard <{SENDER_EMAIL}>"
        msg["To"] = user_email

        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #2E7D32; margin: 0;">PlantGuard</h1>
                    <p style="color: #666; margin: 5px 0;">Trợ lý chăm sóc cây thông minh</p>
                </div>
                
                <div style="background-color: #F1F8E9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #1B5E20; margin-top: 0;">Chào {user_name},</h2>
                    <p>Đã đến lúc thực hiện công việc chăm sóc cho cây <strong>{plant_name}</strong> của bạn!</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="color: #2E7D32;">📋 Nhiệm vụ: {task_title}</h3>
                    <p style="background-color: #fff; padding: 10px; border-left: 4px solid #2E7D32;">
                        {task_desc}
                    </p>
                </div>

                <p>Sau khi hoàn thành, đừng quên vào ứng dụng để xác nhận tiến độ nhé!</p>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
                    <p>Đây là email tự động từ hệ thống PlantGuard. Vui lòng không trả lời email này.</p>
                </div>
            </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
            
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
