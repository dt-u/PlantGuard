import cv2
import random
import os
import uuid
import base64
import numpy as np
import asyncio
from ultralytics import YOLO
from .seed_data import DISEASES_SEED_DATA

# Define the results directory
RESULTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "results")
if not os.path.exists(RESULTS_DIR):
    os.makedirs(RESULTS_DIR)

class AIEngine:
    def __init__(self):
        # ... existing code ...
        self.shared_frames = {} # {camera_url: latest_frame}
        # Load the trained YOLO Doctor model (best.pt)
        model_path = os.path.join(os.path.dirname(__file__), "models", "best.pt")
        if os.path.exists(model_path):
            self.model = YOLO(model_path)
            print(f"Doctor Model (best.pt) loaded successfully from {model_path}")
        else:
            self.model = None
            print(f"WARNING: Doctor Model file not found at {model_path}. Running in mock mode.")

        # Load the trained YOLO Monitor model (monitor.pt)
        monitor_path = os.path.join(os.path.dirname(__file__), "models", "monitor.pt")
        if os.path.exists(monitor_path):
            self.monitor_model = YOLO(monitor_path)
            print(f"Monitor Model (monitor.pt) loaded successfully from {monitor_path}")
        else:
            self.monitor_model = None
            print(f"WARNING: Monitor Model file not found at {monitor_path}. Monitor using Doctor model as fallback.")
            self.monitor_model = self.model

    async def detect_image(self, image_path: str):
        """
        Runs real detection on an image using the loaded YOLO model.
        """
        try:
            if self.model is None:
                return await self.mock_detect_image(image_path)

            # Run inference
            results = self.model(image_path)
            result = results[0]
            
            # Generate output filename
            filename = f"processed_{uuid.uuid4()}.jpg"
            output_path = os.path.join(RESULTS_DIR, filename)
            
            # Save the annotated image
            result.save(filename=output_path)
            
            # Determine disease from highest confidence box
            if len(result.boxes) > 0:
                # Take the top detection
                top_box = result.boxes[0]
                class_id = int(top_box.cls[0].item())
                confidence = float(top_box.conf[0].item())
                
                # Directly map class_id to seed_data index (confirmed matching)
                if 0 <= class_id < len(DISEASES_SEED_DATA):
                    disease_name = DISEASES_SEED_DATA[class_id]["name"]
                else:
                    disease_name = "Healthy" # Fallback
            else:
                disease_name = "Healthy"
                confidence = 1.0

            return {
                "image_url": f"/results/{filename}",
                "disease_name": disease_name,
                "confidence": round(confidence, 2)
            }
        except Exception as e:
            print(f"Error in detect_image: {e}")
            return await self.mock_detect_image(image_path)

    async def mock_detect_image(self, image_path: str):
        """Fallback mock detection if real model fails or is missing"""
        img = cv2.imread(image_path)
        if img is None: raise ValueError("Image not found")
        height, width, _ = img.shape
        x1, y1 = random.randint(0, width//2), random.randint(0, height//2)
        cv2.rectangle(img, (x1, y1), (x1+100, y1+100), (0, 0, 255), 2)
        filename = f"processed_{uuid.uuid4()}.jpg"
        output_path = os.path.join(RESULTS_DIR, filename)
        cv2.imwrite(output_path, img)
        disease_entry = random.choice(DISEASES_SEED_DATA)
        return {
            "image_url": f"/results/{filename}",
            "disease_name": disease_entry["name"],
            "confidence": 0.5
        }

    async def detect_video(self, video_path: str, progress_callback=None):
        """
        Processes video using YOLO26 if available, else simulated.
        Reads frames, draws boxes, and saves the output video.
        """
        try:
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise ValueError("Could not open video")

            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fps = int(cap.get(cv2.CAP_PROP_FPS))
            if fps == 0: fps = 30
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            fourcc = cv2.VideoWriter_fourcc(*'avc1') 
            filename = f"processed_{uuid.uuid4()}.mp4"
            output_path = os.path.join(RESULTS_DIR, filename)
            
            out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
            
            alert_count = 0
            detailed_logs = []
            
            def process_frames():
                nonlocal alert_count, detailed_logs
                frame_idx = 0
                frame_skip = 10 # Optimized: skip more frames for Drone footage
                last_boxes = []
                last_logged_time = {}
                
                while cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        break
                        
                    current_time_sec = frame_idx / fps
                    
                    if frame_idx % frame_skip == 0:
                        if self.monitor_model:
                            # Optimization: resize once to standard YOLO size (640) 
                            # to avoid internal scaling overhead per frame
                            frame_resized = cv2.resize(frame, (640, 640))
                            res = self.monitor_model(frame_resized, verbose=False)
                            boxes_data = []
                            # Scale boxes back to original resolution
                            h_ratio = height / 640.0
                            w_ratio = width / 640.0
                            for box in res[0].boxes:
                                rx1, ry1, rx2, ry2 = box.xyxy[0].tolist()
                                x1, y1 = int(rx1 * w_ratio), int(ry1 * h_ratio)
                                x2, y2 = int(rx2 * w_ratio), int(ry2 * h_ratio)
                                conf = float(box.conf[0].item())
                                cls = int(box.cls[0].item())
                                boxes_data.append((x1, y1, x2, y2, conf, cls))
                            last_boxes = boxes_data
                        else:
                            # Simulated if no model loaded
                            if random.random() > 0.8:
                                x1 = random.randint(0, width // 2)
                                y1 = random.randint(0, height // 2)
                                x2 = x1 + random.randint(50, 200)
                                y2 = y1 + random.randint(50, 200)
                                last_boxes = [(x1, y1, x2, y2, 0.99, -1)]
                            else:
                                last_boxes = []

                    for box in last_boxes:
                        x1, y1, x2, y2, conf, cls = box
                        if cls == -1:
                            label = "Vật thể Mô phỏng"
                        else:
                            label = DISEASES_SEED_DATA[cls]["name"] if 0 <= cls < len(DISEASES_SEED_DATA) else f"Class {cls}"
                            
                        if conf > 0.5:
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                            cv2.putText(frame, f"{label} {conf:.2f}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                            
                            if current_time_sec - last_logged_time.get(label, -5) >= 5.0:
                                last_logged_time[label] = current_time_sec
                                alert_count += 1
                                m = int(current_time_sec // 60)
                                s = int(current_time_sec % 60)
                                time_str = f"{m:02d}:{s:02d}"
                                detailed_logs.append({
                                    "time": time_str,
                                    "msg": f"Tại {time_str} phát hiện rủi ro: [{label}]",
                                    "label": label,
                                    "x": (x1 + x2) / 2 / width,
                                    "y": (y1 + y2) / 2 / height,
                                    "type": "alert"
                                })

                    out.write(frame)
                    
                    if progress_callback and frame_idx % 30 == 0 and total_frames > 0:
                        progress_callback(int((frame_idx / total_frames) * 100))
                        
                    frame_idx += 1

            await asyncio.to_thread(process_frames)
                
            cap.release()
            out.release()
            
            if progress_callback: progress_callback(100)
            
            return {
                "video_url": f"/results/{filename}",
                "alert_count": alert_count,
                "detailed_logs": detailed_logs
            }
            
        except Exception as e:
             print(f"Error in detect_video: {e}")
             raise e

    async def save_capture(self, frame, label, conf, x, y, w, h):
        """Saves a frame as a pending capture for the dataset collector"""
        try:
            capture_id = str(uuid.uuid4())
            filename = f"cap_{capture_id}.jpg"
            captures_dir = os.path.join(RESULTS_DIR, "captures")
            if not os.path.exists(captures_dir):
                os.makedirs(captures_dir)
            
            filepath = os.path.join(captures_dir, filename)
            cv2.imwrite(filepath, frame)
            
            # Here we would normally save metadata to a database
            # For this implementation, we'll return the metadata to be handled by routes
            return {
                "capture_id": capture_id,
                "image_url": f"/results/captures/{filename}",
                "disease_name": label,
                "confidence": float(conf),
                "coordinates": {"cx": float(x), "cy": float(y), "w": float(w), "h": float(h)},
                "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }
        except Exception as e:
            print(f"Error saving capture: {e}")
            return None

    def _fix_url(self, camera_url: str):
        # Ensure protocol exists
        if not camera_url.startswith("http://") and not camera_url.startswith("https://"):
            camera_url = "http://" + camera_url

        # Auto-fix for DroidCam URLs
        if "4747" in camera_url and not any(x in camera_url for x in ["/video", "/mjpegfeed", "/video.force"]):
            if not camera_url.endswith("/"): camera_url += "/"
            camera_url += "video"
        return camera_url

    async def generate_frames(self, camera_url: str):
        """
        Generates frames from a camera stream (URL).
        Yields base64 encoded frames for WebSocket streaming.
        Uses background threading to prevent frame buffer lag and YOLO26 bottleneck.
        """
        import time
        import threading
        
        fixed_url = self._fix_url(camera_url)

        # Use a thread for the blocking VideoCapture.open() call
        def open_cap(url):
            return cv2.VideoCapture(url)

        print(f"Attempting to connect to camera: {fixed_url}...")
        cap = await asyncio.to_thread(open_cap, fixed_url)
        
        is_mock = not cap.isOpened()
        if is_mock:
            print(f"Failed to open camera: {fixed_url}. Switching to Simulation Mode.")

        # State for Threading
        running = True
        latest_frame = None
        latest_yolo_boxes = []

        def read_camera_thread():
            nonlocal latest_frame, running, is_mock
            while running:
                if is_mock:
                    time.sleep(0.1)
                    continue
                    
                ret, frame = cap.read()
                if ret:
                    latest_frame = frame
                    self.shared_frames[fixed_url] = frame # Share with auto-scan
                else:
                    print("Lost connection to camera in read thread.")
                    is_mock = True
                
                # Keep CPU usage in check
                time.sleep(0.005)

        def process_yolo_thread():
            nonlocal latest_frame, latest_yolo_boxes, running, is_mock
            while running:
                if is_mock or latest_frame is None:
                    time.sleep(0.1)
                    continue
                
                # Grab a copy of the latest frame to process
                frame_to_process = latest_frame.copy()
                frame_resized = cv2.resize(frame_to_process, (640, 480))
                
                if self.monitor_model:
                    try:
                        # Run YOLO inference
                        res = self.monitor_model(frame_resized, verbose=False)
                        
                        # Extract boxes to be drawn by the fast main loop
                        boxes = []
                        for box in res[0].boxes:
                            x1, y1, x2, y2 = box.xyxy[0].tolist()
                            conf = float(box.conf[0].item())
                            cls = int(box.cls[0].item())
                            boxes.append((int(x1), int(y1), int(x2), int(y2), conf, cls))
                        
                        latest_yolo_boxes = boxes
                    except Exception as e:
                        print("YOLO Process Error:", e)
                else:
                    # Mock logic if no model
                    if random.random() > 0.85:
                        x1 = random.randint(0, 300)
                        y1 = random.randint(0, 200)
                        x2 = x1 + random.randint(50, 150)
                        y2 = y1 + random.randint(50, 150)
                        latest_yolo_boxes = [(x1, y1, x2, y2, 0.99, 0)]
                    else:
                        latest_yolo_boxes = []
                
                # Prevent 100% thread CPU usage
                time.sleep(0.01)

        t_read = threading.Thread(target=read_camera_thread, daemon=True)
        t_yolo = threading.Thread(target=process_yolo_thread, daemon=True)
        
        t_read.start()
        t_yolo.start()

        import json
        last_logged_time = {}

        try:
            while True:
                detections_to_send = []
                current_time = time.time()
                
                if is_mock:
                    # Simulation Mode Frame
                    frame = np.zeros((480, 640, 3), dtype=np.uint8)
                    cv2.putText(frame, "Simulation Mode: No Camera", (50, 240), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                    cv2.putText(frame, f"URL: {camera_url}", (50, 280), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)
                    
                    if random.random() > 0.8:
                        x1 = random.randint(100, 500)
                        y1 = random.randint(100, 300)
                        w = 100
                        h = 100
                        cv2.rectangle(frame, (x1, y1), (x1+w, y1+h), (0, 255, 0), 2)
                        cv2.putText(frame, "Mock Object", (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                        
                        mock_label = "Vật thể Mô phỏng"
                        if current_time - last_logged_time.get(mock_label, 0) > 3.0:
                            detections_to_send.append({
                                "label": mock_label, 
                                "confidence": 0.99,
                                "x": (x1 + w/2) / 640,
                                "y": (y1 + h/2) / 480,
                                "w": w / 640,
                                "h": h / 480
                            })
                            last_logged_time[mock_label] = current_time
                            
                    frame_to_send = frame
                    await asyncio.sleep(0.1) # 10 FPS mock
                else:
                    if latest_frame is None:
                        await asyncio.sleep(0.01)
                        continue
                        
                    # Copy and resize the raw camera frame (for optimal ~30 FPS output)
                    frame_to_send = cv2.resize(latest_frame.copy(), (640, 480))
                    
                    # Instantly draw the latest available YOLO boxes
                    current_boxes = latest_yolo_boxes
                    for box in current_boxes:
                        x1, y1, x2, y2, conf, cls = box
                        
                        label = f"Class {cls}"
                        if 0 <= cls < len(DISEASES_SEED_DATA):
                            label = DISEASES_SEED_DATA[cls]["name"]
                            
                        # Draw bounding box and label
                        cv2.rectangle(frame_to_send, (x1, y1), (x2, y2), (0, 0, 255), 2)
                        cv2.putText(frame_to_send, f"{label} {conf:.2f}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
                        
                        # Throttle the event logs (once every 3.0 seconds per label)
                        if conf >= 0.5:
                            if current_time - last_logged_time.get(label, 0) > 3.0:
                                detections_to_send.append({
                                    "label": label, 
                                    "confidence": conf,
                                    "x": (x1 + x2) / 2 / 640,
                                    "y": (y1 + y2) / 2 / 480,
                                    "w": (x2 - x1) / 640,
                                    "h": (y2 - y1) / 480
                                })
                                last_logged_time[label] = current_time
                                
                    # Target roughly 30 FPS for the video stream
                    await asyncio.sleep(0.03)

                # Encode and yield with slightly lower quality (80) to reduce bandwidth/base64 overhead
                _, buffer = cv2.imencode('.jpg', frame_to_send, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
                frame_bytes = base64.b64encode(buffer).decode('utf-8')
                
                payload = {
                    "image": frame_bytes,
                    "detections": detections_to_send
                }
                yield json.dumps(payload)

        except Exception as e:
            print(f"Error in generate_frames loop: {e}")
        finally:
            running = False
            # Allow threads some time to finish cleanly
            t_read.join(timeout=1.0)
            t_yolo.join(timeout=1.0)
            if cap and cap.isOpened():
                cap.release()

    async def scan_single_frame(self, camera_url: str):
        """
        Connects to the camera stream, grabs a single frame, runs YOLO26,
        and returns the frame and detected boxes.
        Used by the background auto-scan task.
        """
        fixed_url = self._fix_url(camera_url)
        
        # Check if we have a shared frame first (avoids connection conflict)
        if fixed_url in self.shared_frames:
            frame = self.shared_frames[fixed_url].copy()
            print(f"Using shared frame for auto-scan: {fixed_url}")
        else:
            def capture_frame():
                # Add timeout/optimization flags if possible, or just standard read
                cap = cv2.VideoCapture(fixed_url)
                ret, frame = cap.read()
                cap.release()
                return frame if ret else None

            frame = await asyncio.to_thread(capture_frame)
            
        if frame is None:
            return None, []

        height, width, _ = frame.shape
        frame_resized = cv2.resize(frame, (640, 640))
        boxes_data = []

        if self.monitor_model:
            try:
                res = self.monitor_model(frame_resized, verbose=False)
                h_ratio = height / 640.0
                w_ratio = width / 640.0
                for box in res[0].boxes:
                    rx1, ry1, rx2, ry2 = box.xyxy[0].tolist()
                    x1, y1 = int(rx1 * w_ratio), int(ry1 * h_ratio)
                    x2, y2 = int(rx2 * w_ratio), int(ry2 * h_ratio)
                    conf = float(box.conf[0].item())
                    cls = int(box.cls[0].item())
                    boxes_data.append((x1, y1, x2, y2, conf, cls))
            except Exception as e:
                print("YOLO26 Scan Error:", e)
        else:
            # Simulation Mode for Wide Monitoring (Unhealthy Zone)
            if random.random() > 0.5: # 50% chance to detect something for demo
                x1 = random.randint(10, width // 2)
                y1 = random.randint(10, height // 2)
                x2 = x1 + random.randint(100, 300)
                y2 = y1 + random.randint(100, 300)
                x2 = min(x2, width - 10)
                y2 = min(y2, height - 10)
                boxes_data.append((x1, y1, x2, y2, random.uniform(0.7, 0.99), -2)) # -2 implies Unhealthy Zone pseudo-class

        return frame, boxes_data
