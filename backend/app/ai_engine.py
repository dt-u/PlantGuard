import cv2
import random
import os
import uuid
import base64
import numpy as np
import asyncio

# Define the results directory
RESULTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "results")
if not os.path.exists(RESULTS_DIR):
    os.makedirs(RESULTS_DIR)

class AIEngine:
    def __init__(self):
        # In a real scenario, load the models here
        # self.model = YOLO("yolov8n.pt")
        pass

    async def detect_image(self, image_path: str):
        """
        Simulates detection on an image.
        Draws a random bounding box and labels it.
        """
        try:
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError("Could not open or find the image")

            height, width, _ = img.shape
            
            # Simulate detection
            # Draw a box
            x1 = random.randint(0, width // 2)
            y1 = random.randint(0, height // 2)
            x2 = random.randint(x1 + 50, width)
            y2 = random.randint(y1 + 50, height)
            
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(img, "Mock_Disease", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
            
            # Generate output filename
            filename = f"processed_{uuid.uuid4()}.jpg"
            output_path = os.path.join(RESULTS_DIR, filename)
            
            cv2.imwrite(output_path, img)
            
            # In a real app, you would determine disease from class_id
            disease_name = random.choice(["Tomato Blight", "Corn Rust", "Healthy"])
            
            return {
                "image_url": f"/results/{filename}",
                "disease_name": disease_name,
                "confidence": round(random.uniform(0.7, 0.99), 2)
            }
        except Exception as e:
            print(f"Error in detect_image: {e}")
            raise e

    async def detect_video(self, video_path: str):
        """
        Simulates video processing.
        Reads frames, draws random boxes, and saves the output video.
        """
        try:
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise ValueError("Could not open video")

            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fps = int(cap.get(cv2.CAP_PROP_FPS))
            
            # Use XVID for simplicity/compatibility in some cases, or mp4v
            fourcc = cv2.VideoWriter_fourcc(*'mp4v') 
            filename = f"processed_{uuid.uuid4()}.mp4"
            output_path = os.path.join(RESULTS_DIR, filename)
            
            out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
            
            alert_count = 0
            
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Randomly draw boxes on some frames
                if random.random() > 0.7:
                     x1 = random.randint(0, width // 2)
                     y1 = random.randint(0, height // 2)
                     x2 = x1 + random.randint(50, 200)
                     y2 = y1 + random.randint(50, 200)
                     
                     cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                     cv2.putText(frame, "Alert", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
                     alert_count += 1

                out.write(frame)
                
            cap.release()
            out.release()
            
            return {
                "video_url": f"/results/{filename}",
                "alert_count": alert_count
            }
            
        except Exception as e:
             print(f"Error in detect_video: {e}")
             raise e

    async def generate_frames(self, camera_url: str):
        """
        Generates frames from a camera stream (URL).
        Yields base64 encoded frames for WebSocket streaming.
        Supports automatic reconnection/mocking if connection fails.
        """
        cap = cv2.VideoCapture(camera_url)
        
        # Determine if we are in mock mode (failed connection)
        is_mock = not cap.isOpened()
        
        try:
            while True:
                if is_mock:
                    # Generate a black frame with text
                    frame = np.zeros((480, 640, 3), dtype=np.uint8)
                    cv2.putText(frame, "Simulation Mode: No Camera", (50, 240), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                    cv2.putText(frame, f"Connecting to: {camera_url}", (50, 280), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)
                    
                    # Add random detection boxes to simulate AI working
                    if random.random() > 0.8:
                        x1 = random.randint(100, 500)
                        y1 = random.randint(100, 300)
                        cv2.rectangle(frame, (x1, y1), (x1+100, y1+100), (0, 255, 0), 2)
                        cv2.putText(frame, "Mock Object", (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                        
                    await asyncio.sleep(0.1) # Simulate ~10 FPS
                else:
                    ret, frame = cap.read()
                    if not ret:
                        # End of stream or error, switch to mock or break
                        print("Stream ended, switching to mock...")
                        is_mock = True
                        continue

                    # Resize for performance if needed
                    frame = cv2.resize(frame, (640, 480))
                    
                    # --- YOLO Detection Simulation ---
                    # In a real app, you'd run self.model(frame) here.
                    # We will randomly draw boxes.
                    if random.random() > 0.85:
                         x1 = random.randint(0, 300)
                         y1 = random.randint(0, 200)
                         x2 = x1 + random.randint(50, 150)
                         y2 = y1 + random.randint(50, 150)
                         
                         cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                         cv2.putText(frame, "Person", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                    
                    # Yield control to event loop briefly
                    await asyncio.sleep(0.01) 

                # Encode frame to JPEG
                _, buffer = cv2.imencode('.jpg', frame)
                frame_bytes = base64.b64encode(buffer).decode('utf-8')
                
                yield frame_bytes

        except Exception as e:
            print(f"Error in generate_frames: {e}")
        finally:
            if cap and cap.isOpened():
                cap.release()