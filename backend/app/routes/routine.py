from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import Response
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import uuid

router = APIRouter()

class RoutineRequest(BaseModel):
    disease_name: str
    level: str # 'Mild', 'Moderate', 'Severe'
    action: str
    product: str
    is_tracking_enabled: bool = False
    user_id: Optional[str] = None

class RoutineEvent(BaseModel):
    id: str
    title: str
    description: str
    date: str # ISO format string
    type: str # 'treatment', 'checkup'

@router.post("/generate")
async def generate_routine(req: RoutineRequest):
    """
    Generates a list of events for the mobile app to insert into the native calendar.
    """
    events = []
    now = datetime.now()
    
    # Day 1: Immediate action
    events.append(RoutineEvent(
        id=str(uuid.uuid4()),
        title=f"Phác đồ: {req.disease_name} ({req.level})",
        description=f"Thực hiện: {req.action}\nSản phẩm/Công cụ: {req.product}",
        date=(now + timedelta(days=1)).isoformat(),
        type="treatment"
    ))
    
    # Day 3: Follow-up treatment
    events.append(RoutineEvent(
        id=str(uuid.uuid4()),
        title=f"Nhắc lại: {req.disease_name}",
        description=f"Kiểm tra tình trạng lây lan và lặp lại bước: {req.action}",
        date=(now + timedelta(days=3)).isoformat(),
        type="treatment"
    ))
    
    # Day 7: Check-up
    events.append(RoutineEvent(
        id=str(uuid.uuid4()),
        title=f"Tái khám định kỳ: {req.disease_name}",
        description="Mở ứng dụng PlantGuard để chụp ảnh phân tích lại cây của bạn xem bệnh đã thuyên giảm chưa.",
        date=(now + timedelta(days=7)).isoformat(),
        type="checkup"
    ))
    
    # Optional tracking persistence
    if req.is_tracking_enabled and req.user_id:
        # TODO: Save to MongoDB for in-app tracking
        print(f"Tracking enabled for user {req.user_id}. Routine generated.")

    return {"status": "success", "events": events}

@router.post("/download.ics")
async def download_ics(req: RoutineRequest):
    """
    Generates an .ics file content for Web users to import into their calendar.
    """
    now = datetime.now()
    dtstamp = now.strftime('%Y%m%dT%H%M%SZ')
    
    # Event 1
    d1 = now + timedelta(days=1)
    e1_start = d1.strftime('%Y%m%dT080000') # default 8 AM
    e1_end = d1.strftime('%Y%m%dT090000')
    
    # Event 2
    d3 = now + timedelta(days=3)
    e2_start = d3.strftime('%Y%m%dT080000')
    e2_end = d3.strftime('%Y%m%dT090000')
    
    # Event 3
    d7 = now + timedelta(days=7)
    e3_start = d7.strftime('%Y%m%dT080000')
    e3_end = d7.strftime('%Y%m%dT090000')

    ics_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//PlantGuard//NONSGML v1.0//EN
BEGIN:VEVENT
UID:{uuid.uuid4()}@plantguard.com
DTSTAMP:{dtstamp}
DTSTART:{e1_start}
DTEND:{e1_end}
SUMMARY:Phác đồ: {req.disease_name} ({req.level})
DESCRIPTION:Thực hiện: {req.action}\\nSản phẩm: {req.product}
END:VEVENT
BEGIN:VEVENT
UID:{uuid.uuid4()}@plantguard.com
DTSTAMP:{dtstamp}
DTSTART:{e2_start}
DTEND:{e2_end}
SUMMARY:Nhắc lại: {req.disease_name}
DESCRIPTION:Kiểm tra tình trạng và lặp lại bước: {req.action}
END:VEVENT
BEGIN:VEVENT
UID:{uuid.uuid4()}@plantguard.com
DTSTAMP:{dtstamp}
DTSTART:{e3_start}
DTEND:{e3_end}
SUMMARY:Tái khám định kỳ: {req.disease_name}
DESCRIPTION:Mở ứng dụng PlantGuard để phân tích lại cây của bạn.
END:VEVENT
END:VCALENDAR"""

    return Response(content=ics_content, media_type="text/calendar", headers={
        "Content-Disposition": f"attachment; filename=plantguard_routine_{req.disease_name.replace(' ', '_')}.ics"
    })
