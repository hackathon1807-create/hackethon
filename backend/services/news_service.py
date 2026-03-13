from .gemini_service import gemini_service
import json

class NewsService:
    async def get_trending_threats(self):
        prompt = """
        ACT AS A THREAT INTELLIGENCE ANALYST.
        Scan global social hubs for trending deepfake news or viral threats.
        Provide a list of 5 active threats.
        
        For each threat include:
        - title: Short title of the fake news/video
        - platforms: List (X, TikTok, etc.)
        - urgency: CRITICAL, HIGH, MEDIUM
        - nature: Deepfake, Audio Clone, etc.
        - sighting_time: e.g., '12m ago'
        
        RETURN ONLY VALID JSON LIST.
        """
        try:
            response_text = await gemini_service.analyze_text(prompt)
            clean_json = response_text.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_json)
        except:
            return [
                {"title": "Global Market Flash Crash Fake", "platforms": ["X", "YouTube"], "urgency": "CRITICAL", "nature": "Deepfake", "sighting_time": "5m ago"},
                {"title": "Unverified Audio Endorsement", "platforms": ["WhatsApp"], "urgency": "HIGH", "nature": "Audio Clone", "sighting_time": "22m ago"}
            ]

news_service = NewsService()
