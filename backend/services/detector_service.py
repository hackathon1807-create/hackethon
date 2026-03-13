import torch
import torchvision.transforms as transforms
from PIL import Image
from models.detector_model import get_model
import os

class CustomDetectorService:
    def __init__(self, model_path="detector_weights.pth"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = get_model().to(self.device)
        
        if os.path.exists(model_path):
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
            print(f"📦 Custom model weights loaded from {model_path}")
        else:
            print("⚠️ No pre-trained weights found. Using initialized model.")
        
        self.model.eval()
        
        self.transform = transforms.Compose([
            transforms.Resize((128, 128)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

    def predict(self, image: Image.Image):
        """
        Runs inference on a PIL image.
        Returns a score (0-100) where higher means more authentic.
        """
        # Convert PIL to Tensor
        img_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            output = self.model(img_tensor)
            # Output is a sigmoid probability of being 'fake' (1 is fake)
            # So we invert it for 'authenticity' (100 - x)
            fake_prob = output.item()
            authenticity_score = (1.0 - fake_prob) * 100
            
        return int(authenticity_score)

# Optional: Global instance
detector_service = None

def get_detector():
    global detector_service
    if detector_service is None:
        detector_service = CustomDetectorService()
    return detector_service
