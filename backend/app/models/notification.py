from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum
from .user import PyObjectId

class NotificationType(str, Enum):
    DRONE = "drone"
    SYSTEM = "system"
    ROUTINE = "routine"

class Notification(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    type: NotificationType
    title: str
    message: str
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
        json_encoders = {
            PyObjectId: str
        }
        arbitrary_types_allowed = True

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    type: NotificationType
    title: str
    message: str
    is_read: bool
    created_at: datetime
