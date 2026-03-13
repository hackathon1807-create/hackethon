import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from models.detector_model import get_model
import os
import cv2
import PIL.Image
import torchvision.transforms as transforms

class DFDCDataset(Dataset):
    """
    Dataset loader for pre-processed DFDC frames.
    Expects data/processed/real and data/processed/fake directories.
    """
    def __init__(self, root_dir, transform=None):
        self.root_dir = root_dir
        self.transform = transform
        self.samples = []
        
        # Labeled subfolders
        for label, class_name in enumerate(['real', 'fake']):
            class_dir = os.path.join(root_dir, class_name)
            if not os.path.exists(class_dir):
                continue
            for img_name in os.listdir(class_dir):
                if img_name.endswith(('.jpg', '.png', '.jpeg')):
                    self.samples.append((os.path.join(class_dir, img_name), label))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, label = self.samples[idx]
        image = PIL.Image.open(img_path).convert('RGB')
        
        if self.transform:
            image = self.transform(image)
        
        return image, torch.tensor([label]).float()

def train_model(data_dir="data/processed", epochs=10, batch_size=32):
    print("Initializing Custom Training Sequence for DFDC Dataset...")
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = get_model().to(device)
    
    criterion = nn.BCELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    transform = transforms.Compose([
        transforms.Resize((128, 128)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    if not os.path.exists(data_dir):
        print(f"Error: Data directory {data_dir} not found. Running synthetic mode.")
        # Fallback to synthetic for demo purposes if data not found
        class SyntheticDataset(Dataset):
            def __init__(self, size=100):
                self.size = size
                self.data = torch.randn(size, 3, 128, 128)
                self.labels = torch.randint(0, 2, (size, 1)).float()
            def __len__(self): return self.size
            def __getitem__(self, idx): return self.data[idx], self.labels[idx]
        dataset = SyntheticDataset()
    else:
        dataset = DFDCDataset(data_dir, transform=transform)
    
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
    
    model.train()
    for epoch in range(epochs):
        running_loss = 0.0
        for i, (inputs, labels) in enumerate(dataloader):
            inputs, labels = inputs.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
        
        avg_loss = running_loss/len(dataloader) if len(dataloader) > 0 else 0
        print(f"Epoch [{epoch+1}/{epochs}] - Loss: {avg_loss:.4f}")

    torch.save(model.state_dict(), "detector_weights.pth")
    print("Training sequence complete. Model weights secured in 'detector_weights.pth'.")

if __name__ == "__main__":
    train_model()
