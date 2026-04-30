from pydantic import BaseModel, Field, field_validator
from typing import Optional
from bson import ObjectId
from datetime import datetime
from pydantic_core import core_schema
import uuid

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        return core_schema.no_info_plain_validator_function(cls.validate)

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

class Treatment(BaseModel):
    # Use UUID as primary key for better scalability
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Primary Key - UUID")
    
    disease_id: str = Field(..., description="Disease identifier")
    level: str = Field(..., description="Treatment severity level")
    identification_guide: str = Field(..., description="Guide to identify the treatment need")
    action: str = Field(..., description="Action to take")
    product_name: str = Field(..., description="Product name for purchase")
    
    # Affiliate link fields
    affiliate_url: Optional[str] = Field(None, description="Affiliate link for the product")
    search_fallback_keyword: Optional[str] = Field(None, description="Fallback search keyword if no affiliate link")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str, datetime: lambda dt: dt.isoformat()}
    }

    @field_validator('affiliate_url')
    @classmethod
    def validate_affiliate_url(cls, v):
        if v is not None:
            if not v.startswith(('http://', 'https://')):
                raise ValueError('Affiliate URL must start with http:// or https://')
        return v

    @field_validator('search_fallback_keyword')
    @classmethod
    def validate_search_keyword(cls, v):
        if v is not None:
            if len(v.strip()) == 0:
                raise ValueError('Search keyword cannot be empty')
        return v

class TreatmentCreate(BaseModel):
    disease_id: str
    level: str
    identification_guide: str
    action: str
    product_name: str
    affiliate_url: Optional[str] = None
    search_fallback_keyword: Optional[str] = None

class TreatmentUpdate(BaseModel):
    level: Optional[str] = None
    identification_guide: Optional[str] = None
    action: Optional[str] = None
    product_name: Optional[str] = None
    affiliate_url: Optional[str] = None
    search_fallback_keyword: Optional[str] = None
