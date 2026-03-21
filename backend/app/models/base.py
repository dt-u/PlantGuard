from pydantic import BaseModel
from typing import List, Optional

class Treatment(BaseModel):
    level: str  # Mild, Moderate, Severe
    action: str
    product: str
    identification_guide: str

class DiseaseInfo(BaseModel):
    name: str
    common_name: str
    is_healthy: bool = False
    description: str
    symptoms: List[str]
    treatments: List[Treatment]

class DiagnosisResponse(BaseModel):
    image_url: str
    disease: DiseaseInfo
    confidence: float
