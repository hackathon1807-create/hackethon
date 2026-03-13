import google.generativeai as genai
import os
from typing import List

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def analyze_media(self, prompt: str, media_parts: List):
        """
        Sends media parts (images, video frames, etc.) to Gemini 1.5 Flash for multimodal reasoning.
        """
        try:
            response = self.model.generate_content([prompt] + media_parts)
            return response.text
        except Exception as e:
            return f"Error during Gemini analysis: {str(e)}"

gemini_service = GeminiService()
