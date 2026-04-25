from ..database.mongodb import mongodb
from ..websocket import manager
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

async def send_push_notification(user_id: str, title: str, body: str, n_type: str = "system", data: dict = None):
    """
    Sends a notification:
    1. Saves to MongoDB for persistent storage
    2. Broadcasts via WebSocket for real-time Web/Mobile updates
    3. Placeholder for external push services (FCM/Expo)
    """
    try:
        # 1. Save to MongoDB
        notification_doc = {
            "user_id": str(user_id),
            "type": n_type,
            "title": title,
            "message": body,
            "is_read": False,
            "created_at": datetime.now(),
            "data": data or {}
        }
        
        result = await mongodb.notifications.insert_one(notification_doc)
        notification_id = str(result.inserted_id)
        
        # 2. Broadcast via WebSocket
        await manager.broadcast_to_user(str(user_id), {
            "type": "NEW_NOTIFICATION",
            "notification": {
                "id": notification_id,
                "title": title,
                "message": body,
                "type": n_type,
                "created_at": notification_doc["created_at"].isoformat(),
                "data": data or {}
            }
        })
        
        logger.info(f"🔔 [NOTIFIED {user_id}] {title}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error sending notification: {e}")
        return False
