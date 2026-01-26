# 🏥 MediScan AI  
**Privacy-First Multimodal AI Triage for Rural Clinics**

⭐ **Local AI. Zero Cloud. Real Clinical Impact.**

MediScan AI is a **privacy-first, multimodal medical triage assistant** designed for rural and resource-limited clinics.  
It helps healthcare workers perform **rapid initial patient assessment** using **text symptoms, medical images, and cough audio**, all processed **locally on the device**.

🚨 Built for environments where **internet access, specialists, and time are limited**.

---

## 🚀 Why MediScan AI Matters

- 🌍 **Rural-first healthcare**
- 🔒 **100% local inference** (no cloud, no APIs)
- 🧠 **Multimodal AI reasoning**
- ⚡ **Fast triage support**
- 👨‍⚕️ **Clinician-friendly output**

This project demonstrates **real-world AI system design**, not just models.

---

## ✨ Key Capabilities

### 🧾 Symptom Intelligence
- Free-text patient symptoms & medical history  
- Structured clinical intake  

### 🖼️ Medical Image Processing
- Upload rashes / wounds  
- Local preprocessing & inference pipeline  

### 🎙️ Audio-Based Cough Analysis
- Browser-based recording  
- Feature extraction for respiratory risk signals  

### 🧠 AI-Powered Triage Scoring
Combines **text + image + audio** to produce:
- **Urgency level** (Low / Medium / High)  
- **Risk summary**  
- **Actionable recommendations**  

### 🔐 Privacy by Design
- No cloud services  
- No external APIs  
- Suitable for **air-gapped medical environments**  

---

## 🧩 Tech Stack 

### Frontend
- Next.js (TypeScript)  
- Modular React components  
- Medical-grade UI  

### Backend
- Python + FastAPI  
- Clean API architecture  
- Pydantic validation  

### AI / ML
- PyTorch (image processing)  
- Librosa (audio feature extraction)  
- Local LLM interface (pluggable)  
- Vector database for medical knowledge retrieval  

---

### Project Structure
mediscan-ai/
├── app/                           # Next.js frontend
│   ├── page.tsx                   # Main triage interface
│   ├── layout.tsx                 # Root layout
│   ├── globals.css                # Design tokens & styling
│   └── api/                       # API routes (optional)
│
├── components/                    # React components
│   ├── Header.tsx                 # Application header
│   ├── TriageForm.tsx             # Multimodal input form
│   ├── TriageResults.tsx          # Assessment results display
│   ├── PatientHistory.tsx         # Patient assessment history
│   └── ui/                        # shadcn/ui components
│
├── backend/                       # Python FastAPI backend
│   ├── app/
│   │   ├── main.py                # FastAPI application
│   │   ├── api/
│   │   │   └── routes.py          # API endpoints
│   │   ├── processors/
│   │   │   ├── image_processor.py # ResNet-50 image analysis
│   │   │   └── audio_processor.py # Librosa audio analysis
│   │   ├── models/
│   │   │   ├── llm_engine.py      # Ollama/LangChain LLM
│   │   │   └── triage_scorer.py   # Urgency assessment logic
│   │   ├── knowledge/
│   │   │   └── vector_db.py       # Medical knowledge base
│   │   └── utils/
│   │       ├── config.py          # Configuration
│   │       └── logging.py         # Logging setup
│   └── requirements.txt           # Python dependencies
│
├── scripts/                       # Utility scripts
│   ├── setup.sh                   # Environment setup
│   ├── run_backend.sh             # Start FastAPI server
│   └── download_models.sh         # Download pre-trained models
│
├── MEDISCAN_ARCHITECTURE.md       # Detailed architecture document
└── IMPLEMENTATION_GUIDE.md        # This file

## 📂 Architecture Snapshot

```
Frontend (Next.js)
        ↓
FastAPI Backend
        ↓
Image | Audio | Text Processors
        ↓
Triage Scoring + Local LLM
        ↓
Structured Clinical Output
```

---

## 📊 Example Output

```json
{
  "urgency_level": "HIGH",
  "risk_summary": "Symptoms and cough audio suggest elevated respiratory risk",
  "recommended_action": "Immediate referral to higher-level care"
}
```

---

## 🔐 Privacy & Ethics

- No patient data leaves the device  
- No telemetry  
- Designed as **Clinical Decision Support**  
- **Human-in-the-loop** by default  

---

## 🧠 What This Project Demonstrates

✔ Full-stack AI system design  
✔ Multimodal ML pipelines  
✔ Privacy-first architecture  
✔ Real healthcare use case  
✔ Production-oriented backend structure  

---

## 🛣️ Roadmap

- Offline quantized LLM integration  
- Multilingual support  
- Confidence calibration  
- Encrypted patient history  
- Clinical validation  

---

## 📜 License

MIT License  

---

⭐ If you find this project valuable, consider **starring the repository**.
