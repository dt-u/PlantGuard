from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
import bcrypt
from datetime import datetime
from typing import List
from bson import ObjectId

from ..models.user import User, UserCreate, UserLogin, UserUpdate, UserResponse
from ..database.mongodb import mongodb

router = APIRouter(tags=["authentication"])
security = HTTPBearer()

def hash_password(password: str) -> str:
    # Hash password using bcrypt directly
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Verify password using bcrypt directly
    password_bytes = plain_password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = await mongodb.users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed_password = hash_password(user_data.password)
        
        # Create new user
        new_user = {
            "email": user_data.email,
            "name": user_data.name,
            "password": hashed_password,
            "created_at": datetime.utcnow(),
            "preferences": {}
        }
        
        # Insert user
        result = await mongodb.users.insert_one(new_user)
        
        # Return user response
        return UserResponse(
            id=str(result.inserted_id),
            email=user_data.email,
            name=user_data.name,
            created_at=new_user["created_at"],
            preferences={}
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions (like duplicate email)
        raise
    except Exception as e:
        # Handle other exceptions
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.post("/login", response_model=UserResponse)
async def login(user_data: UserLogin):
    """Login user"""
    try:
        # Find user by email
        user = await mongodb.users.find_one({"email": user_data.email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Verify password
        if not verify_password(user_data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            name=user["name"],
            created_at=user["created_at"],
            preferences=user.get("preferences")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@router.get("/users", response_model=List[UserResponse])
async def get_all_users():
    """Get all users (for admin purposes)"""
    try:
        users = []
        async for user in mongodb.users.find():
            users.append(UserResponse(
                id=str(user["_id"]),
                email=user["email"],
                name=user["name"],
                created_at=user["created_at"],
                preferences=user.get("preferences")
            ))
        return users
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch users: {str(e)}")

@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_update: UserUpdate):
    """Update user information"""
    try:
        update_data = {k: v for k, v in user_update.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided to update")

        result = await mongodb.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")

        updated_user = await mongodb.users.find_one({"_id": ObjectId(user_id)})
        return UserResponse(
            id=str(updated_user["_id"]),
            email=updated_user["email"],
            name=updated_user["name"],
            created_at=updated_user["created_at"],
            preferences=updated_user.get("preferences")
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update user: {str(e)}")

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """Get user by ID"""
    try:
        user = await mongodb.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            name=user["name"],
            created_at=user["created_at"],
            preferences=user.get("preferences")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch user: {str(e)}")
