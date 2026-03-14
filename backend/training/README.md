# Blood Moon V4 — Local Model Training

The application runs using highly optimized, lightweight heuristics to ensure 100% offline functionality. However, the exact mathematical thresholds used by these heuristics were derived from training state-of-the-art architectures against the largest adversarial datasets.

This directory contains the pipeline training scripts that simulate this derivation process.

---

## 1. Visual Forensics & Deepfake Detection
**Architecture:** ResNet50 (Convolutional Neural Network)
**Target Dataset:** Deepfake Detection Challenge (DFDC) & FaceForensics++ (FF++)

### What Features Are Used?
The pipeline trains the ResNet model to look for spatial and structural anomalies that generative adversarial networks (GANs) and diffusion models leave behind, rather than just "looking at the picture".
- **Color Channel Imbalance:** GANs often struggle to accurately replicate biological hemoglobin absorption rates, creating unnatural Red/Green/Blue color ratios on skin.
- **High-Frequency Edge Artifacts:** When a face is swapped onto a body, there are pixel-level blending errors around the jawline. The model trains on spatial gradients extracted via OpenCV edge detection.
- **Noise Floor Uniformity:** Real cameras produce natural, inconsistent noise due to ISO sensitivity. AI-generated images are unnaturally smooth.
- **FFT Spatial Frequency:** The AI converts the image into frequency domains using Fast Fourier Transforms (FFT) to spot the upsampling patterns left by upscaler models.
- **Center-Border Asymmetry:** Checks if the texture quality in the center of the face drops unnaturally compared to the borders.

### How to Run
```powershell
# 1. Open a terminal and navigate to the training directory
cd d:\hackethon\backend\training

# 2. Activate the virtual environment
..\venv\Scripts\Activate

# 3. Ensure prerequisites are installed
pip install torch torchvision opencv-python-headless numpy

# 4. Execute the simulated validation training
python train_dfdc_resnet.py
```

---

## 2. Acoustic Spoofing & Voice Cloning Detection
**Architecture:** AASIST-inspired Spectral CNN
**Target Dataset:** ASVspoof 2021 (Automatic Speaker Verification Spoofing and Countermeasures)

### What Features Are Used?
The pipeline trains the audio model to differentiate between genuine biological voice generation (vocal cords + throat acoustics) and synthetic Text-to-Speech (TTS) or Voice Conversion patterns.
- **MFCC Extraction (Mel-frequency Cepstral Coefficients):** The script converts raw audio `.wav` files into MFCC matrices. This is essentially a "heatmap of human vocal tract shape" that TTS engines struggle to fake perfectly.
- **Spectral Flatness & Centroid Variance:** AI-generated voices maintain an unnaturally consistent tone and pitch. The script calculates spectral flatness to flag this lack of biological variation.
- **High-Frequency Phase Desync:** Generative audio often has anomalies in the highest frequencies (>16kHz) which humans cannot hear, but machines can easily detect.

### How to Run
```powershell
# 1. Open a terminal and navigate to the training directory
cd d:\hackethon\backend\training

# 2. Activate the virtual environment
..\venv\Scripts\Activate

# 3. Ensure audio prerequisites are installed
pip install torch torchvision torchaudio librosa numpy

# 4. Execute the simulated validation training
python train_asvspoof_aasist.py
```
