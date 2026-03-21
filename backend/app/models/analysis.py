from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DiagnosisRecord(BaseModel):
    id: Optional[str] = None
    image_url: str
    disease_name: str
    confidence: float
    symptoms: List[str]
    description: str
    treatments: List[dict]
    is_healthy: bool
    created_at: Optional[datetime] = None
    user_id: Optional[str] = "default_user"

class AnalysisResponse(BaseModel):
    video_url: str
    alert_count: int
