from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime, time
import logging
from ..database.mongodb import routines_collection, users_collection, captures_collection
from ..services.notification import send_push_notification
from ..services.email import send_care_reminder_email
from datetime import datetime, time, timedelta

logger = logging.getLogger(__name__)

async def daily_summary_job():
    """
    Runs every day at 9:00 PM (21:00).
    Aggregates all auto-scan detections from the day and sends one notification.
    """
    logger.info("Running daily summary job for auto-scans...")
    today_start = datetime.combine(datetime.today(), time.min)
    
    # Get all unique users who had detections today
    pipeline = [
        {"$match": {"created_at": {"$gte": today_start}}},
        {"$group": {"_id": "$user_id", "count": {"$sum": 1}}}
    ]
    
    cursor = captures_collection.aggregate(pipeline)
    async for result in cursor:
        user_id = result["_id"]
        count = result["count"]
        
        if user_id and user_id != "anonymous":
            title = "Báo cáo Giám sát Ngày"
            body = f"Hệ thống đã tự động ghi nhận {count} vùng rủi ro mới trong ngày hôm nay. Hãy vào tab Giám sát để kiểm tra và xác nhận."
            
            await send_push_notification(
                user_id=str(user_id),
                n_type="alert",
                title=title,
                body=body
            )
            logger.info(f"Sent daily summary to user {user_id}")

async def morning_reminder_job():
    """
    Runs every morning at 7:00 AM.
    Sends notifications for pending tasks of the day.
    """
    logger.info("Running morning reminder job...")
    today_start = datetime.combine(datetime.today(), time.min)
    today_end = datetime.combine(datetime.today(), time.max)
    
    # Find all routines that have an event for today with status 'pending'
    cursor = routines_collection.find({
        "events": {
            "$elemMatch": {
                "date": {"$gte": today_start, "$lte": today_end},
                "status": "pending"
            }
        }
    })
    
    async for routine in cursor:
        user_id = routine["user_id"]
        plant_name = routine["plant_name"]
        
        # Find the specific event for today
        for event in routine["events"]:
            # Handle both datetime objects and ISO strings if necessary
            event_date = event["date"]
            if isinstance(event_date, str):
                event_date = datetime.fromisoformat(event_date)
            
            if today_start <= event_date <= today_end and event["status"] == "pending":
                title = f"{plant_name} đang đợi bạn!"
                body = f"Hãy {event['title']} để hoàn thành lộ trình hôm nay nhé."
                
                # 1. Send In-app/Web Push
                await send_push_notification(user_id, title, body, n_type="routine")
                
                # 2. Send Email if enabled for this routine
                if routine.get("remind_via_email"):
                    user = await users_collection.find_one({"_id": user_id})
                    if user and user.get("email"):
                        send_care_reminder_email(
                            user_email=user["email"],
                            user_name=user["name"],
                            plant_name=plant_name,
                            task_title=event["title"],
                            task_desc=event["description"]
                        )

async def afternoon_followup_job():
    """
    Runs every afternoon at 5:00 PM.
    Reminds users who haven't completed their daily task.
    """
    logger.info("Running afternoon follow-up job...")
    today_start = datetime.combine(datetime.today(), time.min)
    today_end = datetime.combine(datetime.today(), time.max)
    
    cursor = routines_collection.find({
        "events": {
            "$elemMatch": {
                "date": {"$gte": today_start, "$lte": today_end},
                "status": "pending"
            }
        }
    })
    
    async for routine in cursor:
        user_id = routine["user_id"]
        plant_name = routine["plant_name"]
        
        for event in routine["events"]:
            event_date = event["date"]
            if isinstance(event_date, str):
                event_date = datetime.fromisoformat(event_date)
                
            if (today_start <= event_date <= today_end) and (event["status"] == "pending"):
                title = f"Lời nhắc từ {plant_name}"
                body = f"Bạn chưa xác nhận hoàn thành công việc '{event['title']}' ngày hôm nay."
                
                # 1. Send In-app Push
                await send_push_notification(user_id, title, body, n_type="routine")
                
                # 2. Send Email if enabled for this routine
                if routine.get("remind_via_email"):
                    user = await users_collection.find_one({"_id": user_id})
                    if user and user.get("email"):
                        send_care_reminder_email(
                            user_email=user["email"],
                            user_name=user["name"],
                            plant_name=plant_name,
                            task_title=f"NHẮC NHỞ: {event['title']}",
                            task_desc=f"Bạn chưa hoàn thành công việc hôm nay cho {plant_name}. Hãy chăm sóc cây kịp thời nhé!"
                        )

async def end_of_day_cleanup_job():
    """
    Runs every day at 11:59 PM.
    Marks pending tasks as 'missed' (strict) or 'skipped' (relaxed).
    """
    logger.info("Running end-of-day cleanup job...")
    today_start = datetime.combine(datetime.today(), time.min)
    today_end = datetime.combine(datetime.today(), time.max)
    
    # 1. Handle Strict Mode: pending -> missed
    await routines_collection.update_many(
        {
            "is_strict_tracking": True,
            "events": {
                "$elemMatch": {
                    "date": {"$lt": today_end},
                    "status": "pending"
                }
            }
        },
        {
            "$set": {"events.$[elem].status": "missed"}
        },
        array_filters=[{"elem.date": {"$lt": today_end}, "elem.status": "pending"}]
    )
    
    # 2. Handle Relaxed Mode: pending -> skipped (or completed depending on preference)
    await routines_collection.update_many(
        {
            "is_strict_tracking": False,
            "events": {
                "$elemMatch": {
                    "date": {"$lt": today_end},
                    "status": "pending"
                }
            }
        },
        {
            "$set": {"events.$[elem].status": "skipped"}
        },
        array_filters=[{"elem.date": {"$lt": today_end}, "elem.status": "pending"}]
    )

def setup_scheduler():
    scheduler = AsyncIOScheduler()
    
    # Schedule jobs
    # 7:00 AM
    scheduler.add_job(morning_reminder_job, 'cron', hour=7, minute=0)
    
    # 5:00 PM
    scheduler.add_job(afternoon_followup_job, 'cron', hour=17, minute=0)
    
    # 9:00 PM - Daily Summary
    scheduler.add_job(daily_summary_job, 'cron', hour=21, minute=0)
    
    # 11:59 PM
    scheduler.add_job(end_of_day_cleanup_job, 'cron', hour=23, minute=59)
    
    return scheduler
