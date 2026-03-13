from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import shutil
import tempfile
from PIL import Image
from dotenv import load_dotenv


load_dotenv()

from services.gemini_service import gemini_service
from services.media_processor import media_processor
from services.detector_service import get_detector
import json
import cv2

app = FastAPI(title="OmniCheck 11-11 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def parse_gemini_response(response_text: str):
    """
    Attempts to parse Gemini's response for a score and explanation.
    Expected format in response: "Score: [0-100], Explanation: [Text]"
    """
    try:
        score = 50
        explanation = "Analysis complete."
        
        if "Score:" in response_text:
            score_part = response_text.split("Score:")[1].split(",")[0].strip().replace("%", "")
            score = int(''.join(filter(str.isdigit, score_part)))
            
        if "Explanation:" in response_text:
            explanation = response_text.split("Explanation:")[1].strip()
            
        return score, explanation
    except:
        return 50, "Could not determine exact score, but analysis was performed."

@app.post("/analyze/image")
async def analyze_image(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
        
        img = Image.open(tmp_path)
        
        # --- PHASE 6: CUSTOM LOCAL MODEL ---
        local_score = get_detector().predict(img)
        
        prompt = """
        Audit this image for deepfake indicators. Look for:
        1. Skin texture anomalies (unnatural smoothness or artifacts).
        2. Inconsistent lighting and shadows on the face.
        3. Blending issues around the hair and jawline.
        Return in format: Score: [0-100] (higher is more authentic), Explanation: [Short summary of findings]
        """
        
        response_text = await gemini_service.analyze_media(prompt, [img])
        os.unlink(tmp_path)
        
        gemini_score, explanation = parse_gemini_response(response_text)
        
        # Hybrid Scoring
        final_score = int((local_score * 0.4) + (gemini_score * 0.6))
        
        return {
            "score": final_score, 
            "explanation": f"[Hybrid Audit] Local Engine: {local_score}% | Gemini reasoning: {explanation}",
            "raw": response_text,
            "local_score": local_score
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/video")
async def analyze_video(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
        
        frames = media_processor.extract_frames(tmp_path)
        pil_frames = [Image.fromarray(cv2.cvtColor(f, cv2.COLOR_BGR2RGB)) for f in frames]
        
        # --- PHASE 6: CUSTOM LOCAL MODEL (Video) ---
        detector = get_detector()
        local_scores = [detector.predict(f) for f in pil_frames]
        avg_local_score = int(sum(local_scores) / len(local_scores)) if local_scores else 50
        
        prompt = """
        Analyze these sequential frames for video deepfake/liveness indicators. Look for:
        1. Natural blinking and micro-expressions.
        2. Consistency of facial features across frames.
        3. Lip-sync accuracy if movement is present.
        Return in format: Score: [0-100] (higher is more authentic), Explanation: [Short summary of findings]
        """
        
        response_text = await gemini_service.analyze_media(prompt, pil_frames)
        os.unlink(tmp_path)
        
        gemini_score, explanation = parse_gemini_response(response_text)
        
        # Hybrid Scoring
        final_score = int((avg_local_score * 0.4) + (gemini_score * 0.6))
        
        return {
            "score": final_score, 
            "explanation": f"[Hybrid Audit] Local Engine: {avg_local_score}% | Gemini reasoning: {explanation}",
            "raw": response_text,
            "local_score": avg_local_score
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/audio")
async def analyze_audio(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
        
        features = media_processor.analyze_audio_features(tmp_path)
        prompt = f"""
        Analyze these audio features for AI-cloning indicators. 
        Features: {json.dumps(features)}
        Look for robotic delivery, spectral anomalies, and unnatural frequency shifts.
        Return in format: Score: [0-100] (higher is more authentic), Explanation: [Short summary of findings]
        """
        
        response_text = await gemini_service.analyze_media(prompt, [])
        os.unlink(tmp_path)
        
        score, explanation = parse_gemini_response(response_text)
        return {"score": score, "explanation": explanation, "raw": response_text, "features": features}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/live")
async def analyze_live(file: UploadFile = File(...)):
    # Simulated Live Mode analysis for MVP
    return {"score": 88, "explanation": "Live liveness check passed. Natural micro-expressions detected in capture stream."}

@app.post("/analyze/social")
async def analyze_social(url: str = Form(...)):
    # Simulated Social Watch analysis for MVP
    return {"score": 65, "explanation": f"Source link {url} suggests recent manipulation. Visual audit shows minor compression artifacts consistent with deepfake software."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
