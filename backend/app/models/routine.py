from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class RoutineEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    date: datetime
    status: str = "pending" # pending, completed, missed, skipped
    type: str = "treatment" # treatment, checkup

class UserRoutine(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    plant_name: str
    disease_name: str
    disease_slug: Optional[str] = None
    image_url: Optional[str] = None
    is_strict_tracking: bool = True
    remind_via_email: bool = False
    created_at: datetime = Field(default_factory=datetime.now)
    events: List[RoutineEvent] = []

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
