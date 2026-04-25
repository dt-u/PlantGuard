from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime, time
import logging
from ..database.mongodb import routines_collection
from ..services.notification import send_push_notification

logger = logging.getLogger(__name__)

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
                await send_push_notification(user_id, title, body)

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
                
            if today_start <= event_date <= today_end and event["status"] == "pending":
                title = f"Nhắc nhẹ: {plant_name}"
                body = f"Đừng quên {event['title']} cho cây hôm nay nha!"
                await send_push_notification(user_id, title, body)

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
    
    # 11:59 PM
    scheduler.add_job(end_of_day_cleanup_job, 'cron', hour=23, minute=59)
    
    return scheduler
