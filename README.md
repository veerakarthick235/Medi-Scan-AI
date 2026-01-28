# 🏥 MediScan AI  
### Privacy-First Multimodal AI Triage for Rural Clinics

⭐ **Local AI · Zero Cloud · Real-World Healthcare Impact**

MediScan AI is a **privacy-first, multimodal medical triage application** built to assist **rural and resource-limited clinics**. It performs **initial patient triage** using **text symptoms, medical images, and cough audio recordings**, with **all processing done locally**—no cloud, no data leakage.

> Designed for environments where **internet access, specialists, and time are limited**.

---

## 🚀 Why MediScan AI?

Most healthcare AI tools depend on cloud APIs.  
That makes them **unusable** or **unsafe** in rural clinics.

**MediScan AI is different:**

- 🔒 **100% local inference**
- 🧠 **Multimodal AI (text + image + audio)**
- 🚑 **Urgency-focused triage**
- 🧑‍⚕️ **Clinician-friendly outputs**
- ⚡ **Fast, offline-ready workflow**

This project demonstrates **real AI system engineering**, not just model demos.

---

## ✨ Key Features

### 🧾 Symptom Intake
- Free-text patient symptoms & medical history
- Supports duration, severity, and context

### 🖼️ Medical Image Processing (Optional)
- Upload images of rashes or wounds
- Local image preprocessing pipeline

### 🎙️ Cough Audio Analysis (Optional)
- Browser-based audio recording
- Feature extraction for respiratory risk signals

### 🧠 AI-Powered Triage Scoring
- Combines **text, image, and audio signals**
- Outputs:
  - **Urgency level** (Low / Medium / High)
  - **Risk summary**
  - **Actionable recommendation**

### 🔐 Privacy-First Architecture
- No cloud services
- No third-party APIs
- Suitable for **air-gapped clinical environments**

---

## 🧩 Tech Stack

**Frontend**
- Next.js (TypeScript)
- Modular React components
- Medical-grade UI

**Backend**
- Python + FastAPI
- Clean API architecture

**AI / ML**
- PyTorch (image processing)
- Librosa (audio feature extraction)
- Local LLM interface (pluggable)
- Vector database for offline medical knowledge

---

## 🧠 System Architecture

\`\`\`
Next.js Frontend
     ↓
FastAPI Backend
     ↓
Text | Image | Audio Processors
     ↓
Triage Scoring + Local Reasoning
     ↓
Structured Clinical Output
\`\`\`

---

## 📊 Example Output

\`\`\`json
{
  "urgency_level": "HIGH",
  "risk_summary": "Symptoms and cough analysis indicate elevated respiratory risk",
  "recommended_action": "Immediate referral to higher-level care"
}
\`\`\`

---

## 🚀 Running the Project

### Requirements
- Node.js 18+
- Python 3.10+
- Local machine (CPU-only supported)

### Backend
\`\`\`bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
\`\`\`

### Frontend
\`\`\`bash
cd app
npm install
npm run dev
\`\`\`

---

## 🔐 Privacy, Safety & Ethics

- No patient data leaves the device
- No telemetry or tracking
- Human-in-the-loop by design
- Intended as **Clinical Decision Support**, not diagnosis

## 🛣️ Roadmap

- Quantized offline LLM reasoning
- Multilingual UI
- Confidence calibration
- Encrypted local patient history
- Clinical validation studies

---

## 📜 License

MIT License

---

⭐ **If you find this project valuable, please consider starring the repository.**
