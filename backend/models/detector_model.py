import torch
import torch.nn as nn

class DeepfakeDetectorCNN(nn.Module):
    """
    Advanced CNN architecture for Deepfake Detection.
    Includes deeper convolutional paths and batch normalization for higher precision.
    """
    def __init__(self, num_classes=1):
        super(DeepfakeDetectorCNN, self).__init__()
        
        # Block 1: Initial feature extraction
        self.conv1 = nn.Conv2d(3, 16, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(16)
        self.relu1 = nn.ReLU()
        self.pool1 = nn.MaxPool2d(2, 2)
        
        # Block 2: Spatial complexity
        self.conv2 = nn.Conv2d(16, 32, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(32)
        self.relu2 = nn.ReLU()
        self.pool2 = nn.MaxPool2d(2, 2)
        
        # Block 3: Deep features
        self.conv3 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm2d(64)
        self.relu3 = nn.ReLU()
        self.pool3 = nn.MaxPool2d(2, 2)
        
        # Global Average Pooling
        self.gap = nn.AdaptiveAvgPool2d((1, 1))
        
        # Fully Connected Block
        self.fc1 = nn.Linear(64, 32)
        self.relu_fc = nn.ReLU()
        self.dropout = nn.Dropout(0.3)
        self.fc2 = nn.Linear(32, num_classes)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = self.pool1(self.relu1(self.bn1(self.conv1(x))))
        x = self.pool2(self.relu2(self.bn2(self.conv2(x))))
        x = self.pool3(self.relu3(self.bn3(self.conv3(x))))
        x = self.gap(x)
        x = x.view(x.size(0), -1)
        x = self.dropout(self.relu_fc(self.fc1(x)))
        x = self.fc2(x)
        return self.sigmoid(x)

def get_model():
    return DeepfakeDetectorCNN()
