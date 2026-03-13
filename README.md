# Blood Moon V4 🌑
**A Privacy-Preserving Neural Forensics Suite for Deepfake Detection & OSINT Intelligence**

Built for the 11-11 Hackathon, Blood Moon V4 is a 100% local, zero-cloud platform designed to empower victims of synthetic media exploitation and equip cybercrime investigators with automated, legally sound intelligence.

## Core Features (V4 Phase 2 Innovations)

1. **Multi-Modal Deepfake Analysis:**
   - **Visual:** Analyzes pixel entropy, noise floor inconsistencies, and runs C2PA Provenance checks (JUMBF/XMP detection) to spot AI engine signatures.
   - **Hybrid ViT-CNN:** Simulates long-range spatial context validation against localized GAN texture patches.
   - **Physiological Liveness:** Eulerian Video Magnification (EVM) extracts sub-visible blood-flow pulses from facial ROI green channels to verify biological authenticity.
   - **Behavioral Biometrics:** OpenCV Haar cascades enforce strict spontaneous blink cadences (2-10s) and check Rotational Resilience for 3D render breakdown on head turns.
   - **Acoustic / Desync:** AASIST-inspired audio analysis detects Voice Cloning and TTS via spectral flatness. Audio-Visual Latent Lag detection cross-references lip movement mapping with prosody envelopes.

2. **WebRTC Live Mode & High-Fidelity Explainability:**
   - **Neural Thought Trace:** The Victim Portal streams real-time heuristic logic directly to the user during the analysis phase.
   - **Animated Authenticity Dial:** Forensic results are displayed via interactive SVG dash-array gauges mimicking secure lab environments.
   - **Saliency Maps:** Composites an 8x8 Grad-CAM heatmap over uploaded media to localize anomalies.

3. **100% Local Inference & Secure Cloud Hooks:**
   - No sensitive payload data ever leaves the user's encrypted local machine.
   - Utilizes `Ollama` with the `gemma3:1b` model to translate dense technical anomalies (like missing C2PA or EVM failure) into legally-admissible FIR narratives.
   - **Cloudflare Readiness:** Integrated Turnstile browser verification and Cloudflare AI Gateway observability routing for enterprise scaling.

4. **Automated OSINT Fingerprinting:**
   - The Investigator Portal chains real-time WHOIS domain tracing, Shodan InternetDB lookups, and IP Geolocation to automatically synthesize psychological profiles of threat actors.

## Technical Architecture
- **Frontend:** React, Vite, Framer Motion, Tailwind CSS
- **Backend:** FastAPI, Python 3.11, Uvicorn, Pillow, OpenCV-Python-Headless, Librosa
- **Local AI Context:** Ollama Runtime
- **Deployment:** Docker & Docker-Compose orchestration.

## Quick Start (Docker Orchestration)
The entire application has been containerized for rapid deployment across any host machine.

### Prerequisites
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Install [Ollama](https://ollama.com/) locally on your host machine to serve the LLM without bogging down the containers.
3. Pull the required small LLM model: `ollama run gemma3:1b`

### Run the App
```bash
# Clone the repository and navigate root
docker-compose up --build
```

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8000/docs`

## Repository Structure
- `/frontend`: React SPA dashboard with separate `VictimPortal` and `InvestigatorPortal` views.
- `/backend`: FastAPI microservices consisting of `audio_service`, `detection_service`, `osint_service`, and `llm_service`.
- `/backend/training`: PyTorch training pipelines for compiling the Deepfake Detection Challenge and ASVspoof 2021 datasets into static heuristic models.
- `/docker-compose.yml`: Root orchestrator.

## Team
Submitted for the 11-11 Hackathon.
