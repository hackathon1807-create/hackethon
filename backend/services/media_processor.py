import cv2
import os
import tempfile
import numpy as np
from typing import List

class MediaProcessor:
    def __init__(self):
        self.max_frames = 10 # Sample size for hackathon performance

    async def extract_frames(self, media_path: str) -> List[np.ndarray]:
        """Extracts frames from a video file for CNN analysis."""
        frames = []
        try:
            cap = cv2.VideoCapture(media_path)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            if total_frames <= 0:
                return []

            # Sample frames evenly
            step = max(1, total_frames // self.max_frames)
            
            for i in range(0, total_frames, step):
                cap.set(cv2.CAP_PROP_POS_FRAMES, i)
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Resize for model input (simulated)
                frame_resized = cv2.resize(frame, (224, 224))
                frames.append(frame_resized)
                
                if len(frames) >= self.max_frames:
                    break
                    
            cap.release()
        except Exception as e:
            print(f"Frame Extraction Error: {str(e)}")
            
        return frames

    async def process_image(self, image_path: str) -> np.ndarray:
        """Processes a single image for CNN analysis."""
        img = cv2.imread(image_path)
        if img is not None:
            return cv2.resize(img, (224, 224))
        return None

media_processor = MediaProcessor()
