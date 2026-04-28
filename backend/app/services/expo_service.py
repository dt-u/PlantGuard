import requests
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"

def send_expo_push_notifications(tokens: List[str], title: str, body: str, data: Dict[str, Any] = None, badge: int = None):
    if not tokens:
        return
    
    messages = []
    for token in tokens:
        if not token.startswith("ExponentPushToken"):
            continue
        
        message = {
            "to": token,
            "sound": "default",
            "title": title,
            "body": body,
            "data": data or {},
            "badge": badge
        }
        messages.append(message)
    
    if not messages:
        return

    try:
        response = requests.post(
            EXPO_PUSH_URL,
            json=messages,
            headers={
                "accept": "application/json",
                "accept-encoding": "gzip, deflate",
                "content-type": "application/json",
            }
        )
        response.raise_for_status()
        result = response.json()
        logger.info(f"Expo push result: {result}")
        return result
    except Exception as e:
        logger.error(f"Error sending Expo push: {str(e)}")
        return None
