from datetime import datetime
from bson import ObjectId
from ..database.mongodb import mongodb
from ..websocket import manager
from .expo_service import send_expo_push_notifications
import logging

logger = logging.getLogger(__name__)

async def create_and_send_notification(user_id: str, title: str, message: str, type: str = "system"):
    """
    Saves notification to DB, sends via WebSocket if user is online,
    and sends via Expo Push Notification.
    """
    try:
        # 1. Save to MongoDB
        new_notification = {
            "user_id": user_id,
            "type": type,
            "title": title,
            "message": message,
            "is_read": False,
            "created_at": datetime.now()
        }
        result = await mongodb.notifications.insert_one(new_notification)
        new_notification["id"] = str(result.inserted_id)
        
        # 2. Send via WebSocket (In-app)
        await manager.broadcast_to_user(user_id, {
            "type": "NEW_NOTIFICATION",
            "notification": {
                "id": new_notification["id"],
                "type": type,
                "title": title,
                "message": message,
                "is_read": False,
                "created_at": new_notification["created_at"].isoformat()
            }
        })
        
        # 3. Send via Expo Push (System-level)
        user = await mongodb.users.find_one({"_id": ObjectId(user_id)})
        if user and "push_tokens" in user and user["push_tokens"]:
            # Count current unread notifications for badge
            unread_count = await mongodb.notifications.count_documents({
                "user_id": user_id, 
                "is_read": False
            })
            
            send_expo_push_notifications(
                tokens=user["push_tokens"],
                title=title,
                body=message,
                data={"notification_id": new_notification["id"], "type": type},
                badge=unread_count
            )
            
        return new_notification
    except Exception as e:
        logger.error(f"Error in create_and_send_notification: {str(e)}")
        return None
