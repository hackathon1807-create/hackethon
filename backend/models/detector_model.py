import torch
import torch.nn as nn

class DeepfakeDetectorCNN(nn.Module):
    """
    A compact CNN architecture for Deepfake Detection.
    Inspired by MesoNet, optimized for hackathon speed and local execution.
    """
    def __init__(self, num_classes=1):
        super(DeepfakeDetectorCNN, self).__init__()
        
        # Convolutional Block 1
        self.conv1 = nn.Conv2d(3, 8, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(8)
        self.relu1 = nn.ReLU()
        self.pool1 = nn.MaxPool2d(2, 2)
        
        # Convolutional Block 2
        self.conv2 = nn.Conv2d(8, 16, kernel_size=5, padding=2)
        self.bn2 = nn.BatchNorm2d(16)
        self.relu2 = nn.ReLU()
        self.pool2 = nn.MaxPool2d(2, 2)
        
        # Global Average Pooling
        self.gap = nn.AdaptiveAvgPool2d((1, 1))
        
        # Fully Connected Block
        self.fc = nn.Linear(16, num_classes)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = self.pool1(self.relu1(self.bn1(self.conv1(x))))
        x = self.pool2(self.relu2(self.bn2(self.conv2(x))))
        x = self.gap(x)
        x = x.view(x.size(0), -1)
        x = self.fc(x)
        return self.sigmoid(x)

def get_model():
    return DeepfakeDetectorCNN()
