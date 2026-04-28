from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        schema = handler(core_schema)
        schema.update(type="string")
        return schema

class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    name: str
    password: str  # In production, this should be hashed
    created_at: datetime
    preferences: Optional[Dict[str, Any]] = Field(default_factory=dict)
    push_tokens: Optional[list[str]] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str
        }
        arbitrary_types_allowed = True

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None
    push_tokens: Optional[list[str]] = None

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    created_at: datetime
    preferences: Optional[Dict[str, Any]] = None
    push_tokens: Optional[list[str]] = None
    
    class Config:
        arbitrary_types_allowed = True
