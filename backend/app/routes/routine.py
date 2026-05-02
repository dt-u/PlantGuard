from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import Response
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import uuid
import urllib.parse
import json
from ..constants.routines import DISEASE_ROUTINES
from ..database.mongodb import routines_collection
from ..models.routine import UserRoutine, RoutineEvent

router = APIRouter()

class RoutineRequest(BaseModel):
    disease_name: str
    level: str # 'Mild', 'Moderate', 'Severe'
    action: str
    product: str
    is_tracking_enabled: bool = False
    user_id: Optional[str] = None

class SaveRoutineRequest(BaseModel):
    user_id: str
    plant_name: str
    disease_name: str
    disease_slug: Optional[str] = None
    image_url: Optional[str] = None
    is_strict_tracking: bool = True
    events: List[RoutineEvent]

@router.post("/generate")
async def generate_routine(req: RoutineRequest):
    """
    Generates a list of events for the mobile app to insert into the native calendar.
    """
    events = []
    now = datetime.now()
    
    # Check if we have a specific routine for this disease and level
    disease_data = DISEASE_ROUTINES.get(req.disease_name)
    if disease_data and req.level in disease_data:
        steps = disease_data[req.level]
        for step in steps:
            events.append({
                "id": str(uuid.uuid4()),
                "title": f"{step['task']}: {req.disease_name}",
                "description": step['desc'],
                "date": (now + timedelta(days=step['day'])).isoformat(),
                "type": "treatment" if step['day'] < steps[-1]['day'] else "checkup",
                "status": "pending"
            })
    else:
        # Fallback to current generic 1-3-7 logic
        events.append({
            "id": str(uuid.uuid4()),
            "title": f"Phác đồ: {req.disease_name}",
            "description": f"Thực hiện: {req.action}\nSản phẩm: {req.product}",
            "date": (now + timedelta(days=1)).isoformat(),
            "type": "treatment",
            "status": "pending"
        })
        events.append({
            "id": str(uuid.uuid4()),
            "title": f"Nhắc lại: {req.disease_name}",
            "description": f"Kiểm tra tình trạng và lặp lại bước: {req.action}",
            "date": (now + timedelta(days=3)).isoformat(),
            "type": "treatment",
            "status": "pending"
        })
        events.append({
            "id": str(uuid.uuid4()),
            "title": f"Tái khám định kỳ",
            "description": "Mở ứng dụng PlantGuard để phân tích lại cây.",
            "date": (now + timedelta(days=7)).isoformat(),
            "type": "checkup",
            "status": "pending"
        })

    return {"status": "success", "events": events}

@router.post("/save")
async def save_routine(req: SaveRoutineRequest):
    """
    Saves a routine to MongoDB for in-app tracking.
    """
    routine_dict = req.dict()
    routine_dict["created_at"] = datetime.now()
    
    result = await routines_collection.insert_one(routine_dict)
    if result.inserted_id:
        return {"status": "success", "id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Failed to save routine")

@router.get("/user/{user_id}")
async def get_user_routines(user_id: str):
    """
    Retrieves all routines for a specific user.
    """
    cursor = routines_collection.find({"user_id": user_id}).sort("created_at", -1)
    routines = await cursor.to_list(length=100)
    
    # Convert ObjectId to string
    for r in routines:
        r["_id"] = str(r["_id"])
    
    return routines

@router.get("/export_ics")
async def export_ics(disease_name: str, events: str):
    """
    Exports a routine to an .ics file via GET (for simple browser downloads).
    """
    try:
        event_data = json.loads(events)
        
        # Extract fields from event_data
        action = event_data.get("action", "N/A")
        product = event_data.get("product_name") or event_data.get("product") or "N/A"
        
        now = datetime.now()
        dtstamp = now.strftime('%Y%m%dT%H%M%SZ')
        
        # Create events for day 1, 3, 7
        ics_events = []
        days = [1, 3, 7]
        for day in days:
            d = now + timedelta(days=day)
            start = d.strftime('%Y%m%dT080000')
            end = d.strftime('%Y%m%dT090000')
            
            summary = f"Phác đồ ({day}d): {disease_name}"
            description = f"Thực hiện: {action}\\nSản phẩm: {product}"
            
            ics_events.append(f"""BEGIN:VEVENT
UID:{uuid.uuid4()}@plantguard.com
DTSTAMP:{dtstamp}
DTSTART:{start}
DTEND:{end}
SUMMARY:{summary}
DESCRIPTION:{description}
END:VEVENT""")

        ics_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//PlantGuard//NONSGML v1.0//EN
{"\n".join(ics_events)}
END:VCALENDAR"""

        encoded_filename = urllib.parse.quote(f"routine_{disease_name.replace(' ', '_')}.ics")
        return Response(content=ics_content, media_type="text/calendar", headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate ICS: {str(e)}")


@router.get("/{routine_id}")
async def get_routine_detail(routine_id: str):
    """
    Retrieves detail for a specific routine.
    """
    from bson import ObjectId
    routine = await routines_collection.find_one({"_id": ObjectId(routine_id)})
    if routine:
        routine["_id"] = str(routine["_id"])
        return routine
    raise HTTPException(status_code=404, detail="Routine not found")

@router.put("/{routine_id}/event/{event_id}")
async def update_event_status(routine_id: str, event_id: str, status: str = Body(..., embed=True)):
    """
    Updates the status of a specific event in a routine.
    """
    from bson import ObjectId
    
    result = await routines_collection.update_one(
        {"_id": ObjectId(routine_id), "events.id": event_id},
        {"$set": {"events.$.status": status}}
    )
    
    if result.modified_count > 0:
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Routine or event not found")

@router.put("/{routine_id}/settings")
async def update_routine_settings(routine_id: str, settings: dict = Body(...)):
    """
    Updates general settings for a routine (e.g. is_strict_tracking).
    """
    from bson import ObjectId
    
    update_data = {}
    if "is_strict_tracking" in settings:
        update_data["is_strict_tracking"] = settings["is_strict_tracking"]
    
    if not update_data:
        return {"status": "success", "message": "No changes made"}

    result = await routines_collection.update_one(
        {"_id": ObjectId(routine_id)},
        {"$set": update_data}
    )
    
    if result.modified_count > 0:
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Routine not found")

@router.delete("/{routine_id}")
async def delete_routine(routine_id: str):
    """
    Deletes a specific routine by ID.
    """
    from bson import ObjectId
    result = await routines_collection.delete_one({"_id": ObjectId(routine_id)})
    if result.deleted_count > 0:
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Routine not found")

@router.post("/sync_google_calendar")
async def sync_google_calendar(payload: dict = Body(...)):
    """
    Simulates or performs syncing with Google Calendar.
    In a real app, this would use Google API or send an .ics invitation to Gmail.
    """
    user_id = payload.get("user_id")
    email = payload.get("email") 
    events = payload.get("events", [])
    plant_name = payload.get("plant_name", "Cây của tôi")
    
    if not email:
        raise HTTPException(status_code=400, detail="User Gmail is required for sync")

    return {
        "status": "success", 
        "message": f"Đã gửi yêu cầu đồng bộ tới Google Calendar của tài khoản {email}. Vui lòng kiểm tra ứng dụng Lịch của bạn trong giây lát."
    }

@router.post("/download.ics")
async def download_ics(req: RoutineRequest):
    # Keep existing implementation for backward compatibility or web fallback
    now = datetime.now()
    dtstamp = now.strftime('%Y%m%dT%H%M%SZ')
    
    # Simplified for brevity
    d1 = now + timedelta(days=1)
    e1_start = d1.strftime('%Y%m%dT080000')
    e1_end = d1.strftime('%Y%m%dT090000')
    
    ics_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//PlantGuard//NONSGML v1.0//EN
BEGIN:VEVENT
UID:{uuid.uuid4()}@plantguard.com
DTSTAMP:{dtstamp}
DTSTART:{e1_start}
DTEND:{e1_end}
SUMMARY:Phác đồ: {req.disease_name}
DESCRIPTION:Thực hiện: {req.action}\\nSản phẩm: {req.product}
END:VEVENT
END:VCALENDAR"""

    encoded_filename = urllib.parse.quote(f"routine_{req.disease_name.replace(' ', '_')}.ics")
    return Response(content=ics_content, media_type="text/calendar", headers={
        "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"
    })
