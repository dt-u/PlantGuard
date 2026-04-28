from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from ..database.mongodb import mongodb
from ..models.notification import Notification, NotificationResponse

router = APIRouter()

@router.post("/register-push-token")
async def register_push_token(user_id: str = Body(...), token: str = Body(...)):
    """Register a push token for a user."""
    try:
        # Add token to user's push_tokens list if not already there
        await mongodb.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$addToSet": {"push_tokens": token}}
        )
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error registering push token: {str(e)}")

@router.post("/unregister-push-token")
async def unregister_push_token(user_id: str = Body(...), token: str = Body(...)):
    """Remove a push token for a user (e.g., on logout)."""
    try:
        await mongodb.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$pull": {"push_tokens": token}}
        )
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error unregistering push token: {str(e)}")

@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(
    user_id: str = Query(..., description="ID of the user to fetch notifications for"),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    """Fetch notifications for a specific user."""
    try:
        cursor = mongodb.notifications.find({"user_id": user_id}).sort("created_at", -1).skip(skip).limit(limit)
        notifications = await cursor.to_list(length=limit)
        
        return [
            NotificationResponse(
                id=str(n.pop("_id")),
                **n
            ) for n in notifications
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching notifications: {str(e)}")

@router.get("/unread-count")
async def get_unread_count(user_id: str):
    """Get the number of unread notifications for a user."""
    try:
        count = await mongodb.notifications.count_documents({"user_id": user_id, "is_read": False})
        return {"count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error counting notifications: {str(e)}")

@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_as_read(notification_id: str):
    """Mark a single notification as read."""
    try:
        result = await mongodb.notifications.find_one_and_update(
            {"_id": ObjectId(notification_id)},
            {"$set": {"is_read": True}},
            return_document=True
        )
        if not result:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        result["id"] = str(result.pop("_id"))
        return NotificationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating notification: {str(e)}")

@router.patch("/read-all")
async def mark_all_as_read(user_id: str):
    """Mark all notifications for a user as read."""
    try:
        await mongodb.notifications.update_many(
            {"user_id": user_id, "is_read": False},
            {"$set": {"is_read": True}}
        )
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating notifications: {str(e)}")

@router.delete("/clear")
async def clear_notifications(user_id: str):
    """Delete all notifications for a user."""
    try:
        await mongodb.notifications.delete_many({"user_id": user_id})
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing notifications: {str(e)}")
