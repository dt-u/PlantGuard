from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime, date
import logging
from ..database.mongodb import mongodb, routines_collection
from ..services.notification_service import create_and_send_notification

logger = logging.getLogger(__name__)

def setup_scheduler():
    scheduler = AsyncIOScheduler()
    
    # Nhắc nhở sáng 7h00
    scheduler.add_job(send_morning_routines_reminder, CronTrigger(hour=7, minute=0))
    
    # Tổng hợp Live Cam 19h00
    scheduler.add_job(send_daily_detection_summary, CronTrigger(hour=19, minute=0))
    
    # Cảnh báo Strict Mode 20h00
    scheduler.add_job(send_evening_strict_reminder, CronTrigger(hour=20, minute=0))
    
    logger.info("Scheduler setup complete with cron jobs")
    return scheduler

async def send_morning_routines_reminder():
    """Gửi nhắc nhở lúc 7:00 sáng cho các lịch trình trong ngày."""
    logger.info("Running morning routines reminder job")
    today_str = date.today().isoformat() # YYYY-MM-DD
    
    try:
        # Tìm các routine có event diễn ra vào ngày hôm nay
        cursor = routines_collection.find({
            "events": {
                "$elemMatch": {
                    "date": {"$regex": f"^{today_str}"},
                    "status": "pending"
                }
            }
        })
        
        routines = await cursor.to_list(length=1000)
        user_tasks = {}
        
        for r in routines:
            user_id = r["user_id"]
            if user_id not in user_tasks:
                user_tasks[user_id] = 0
            
            for event in r["events"]:
                if event["date"].startswith(today_str) and event["status"] == "pending":
                    user_tasks[user_id] += 1
        
        for user_id, task_count in user_tasks.items():
            if task_count > 0:
                await create_and_send_notification(
                    user_id=user_id,
                    title="Lịch chăm sóc cây hôm nay",
                    message=f"Chào buổi sáng! Bạn có {task_count} công việc cần thực hiện hôm nay. Đừng quên nhé!",
                    type="routine"
                )
    except Exception as e:
        logger.error(f"Error in morning reminder job: {e}")

async def send_evening_strict_reminder():
    """Gửi cảnh báo lúc 20:00 tối cho các Strict Routine chưa hoàn thành."""
    logger.info("Running evening strict reminder job")
    today_str = date.today().isoformat()
    
    try:
        cursor = routines_collection.find({
            "is_strict_tracking": True,
            "events": {
                "$elemMatch": {
                    "date": {"$regex": f"^{today_str}"},
                    "status": "pending"
                }
            }
        })
        
        routines = await cursor.to_list(length=1000)
        users_to_warn = set()
        
        for r in routines:
            users_to_warn.add(r["user_id"])
            
        for user_id in users_to_warn:
            await create_and_send_notification(
                user_id=user_id,
                title="Cảnh báo: Chưa hoàn thành lịch trình",
                message="Bạn vẫn còn các công việc quan trọng chưa hoàn thành trong ngày hôm nay. Hãy thực hiện ngay để đảm bảo sức khỏe cho cây!",
                type="routine"
            )
    except Exception as e:
        logger.error(f"Error in evening strict job: {e}")

async def send_daily_detection_summary():
    """Gửi tổng hợp Live Cam lúc 19:00."""
    logger.info("Running daily detection summary job")
    today_str = date.today().isoformat()
    
    try:
        pipeline = [
            {"$match": {"timestamp": {"$regex": f"^{today_str}"}}},
            {"$group": {"_id": "$user_id", "count": {"$sum": 1}}}
        ]
        
        cursor = mongodb.live_cam_logs.aggregate(pipeline)
        results = await cursor.to_list(length=1000)
        
        for res in results:
            user_id = res["_id"]
            if user_id and user_id != "anonymous":
                await create_and_send_notification(
                    user_id=user_id,
                    title="Tổng hợp Live Cam hôm nay",
                    message=f"Hôm nay hệ thống đã phát hiện {res['count']} vùng rủi ro mới qua Live Cam. Nhấn để xem chi tiết.",
                    type="drone"
                )
    except Exception as e:
        logger.error(f"Error in daily summary job: {e}")
