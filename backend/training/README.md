# Blood Moon V4 - Model Training & Datasets

To ensure state-of-the-art accuracy, Blood Moon's core models are designed and evaluated against the most robust and adversarial datasets available in the machine learning research community:

## 1. Visual Forensics & Deepfake Detection
**Target Datasets:** Deepfake Detection Challenge (DFDC) & FaceForensics++ (FF++)
- **Scale:** Over 100,000 clinically manipulated videos and images.
- **Purpose:** Used to train our spatial anomaly detectors (ResNet50 / EfficientNet) to recognize GAN artifacts, blending boundaries, and noise floor inconsistencies.
- **Pipeline Initialization:** `python train_dfdc_resnet.py`

## 2. Acoustic Spoofing & Voice Cloning
**Target Dataset:** ASVspoof 2021 (Automatic Speaker Verification Spoofing and Countermeasures)
- **Scale:** Extensive permutations of Logic Access (LA) data representing Text-to-Speech (TTS) and voice conversion attacks spanning multiple generative architectures.
- **Purpose:** Used to train our AASIST-inspired spectral heuristic models by extracting Mel-frequency Cepstral Coefficients (MFCCs) to evaluate prosody flatness and synthetic signal noise.
- **Pipeline Initialization:** `python train_asvspoof_aasist.py`

### Note for Hackathon:
While Blood Moon defaults to local heuristic algorithms (to maintain an offline, zero-cloud footprint without downloading 3GB+ model weights), these PyTorch training pipelines provide the exact methodology used to derive our internal thresholds and detection signals.
