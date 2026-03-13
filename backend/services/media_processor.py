import cv2
import librosa
import numpy as np
from typing import List
import tempfile
import os

class MediaProcessor:
    @staticmethod
    def extract_frames(video_path: str, max_frames: int = 5) -> List[np.ndarray]:
        """
        Extracts representative frames from a video file.
        """
        frames = []
        cap = cv2.VideoCapture(video_path)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        if total_frames <= 0:
            return []

        # Extract frames at regular intervals
        interval = max(1, total_frames // max_frames)
        for i in range(0, total_frames, interval):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i)
            ret, frame = cap.read()
            if ret:
                # Resize for Gemini context efficiency
                frame = cv2.resize(frame, (640, 360))
                frames.append(frame)
            if len(frames) >= max_frames:
                break
        
        cap.release()
        return frames

    @staticmethod
    def analyze_audio_features(audio_path: str):
        """
        Extracts basic spectral features from audio to help detect AI cloning artifacts.
        """
        try:
            y, sr = librosa.load(audio_path, sr=None)
            # Spectral centroid (brightness of sound)
            centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
            # Spectral bandwidth
            bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
            
            return {
                "mean_centroid": float(np.mean(centroid)),
                "mean_bandwidth": float(np.mean(bandwidth)),
                "is_monotone": bool(np.std(centroid) < 100) # Simple heuristic for robotic voice
            }
        except Exception as e:
            return {"error": str(e)}

media_processor = MediaProcessor()
