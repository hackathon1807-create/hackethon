import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            # For hackathon demo, we will use a dummy key if not provided, 
            # though real analysis requires it.
            api_key = "DUMMY_KEY"
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def analyze_text(self, prompt: str):
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Analysis Error: {str(e)}"

    async def analyze_image(self, image_path: str, prompt: str):
        # Implementation for image analysis
        pass

gemini_service = GeminiService()
