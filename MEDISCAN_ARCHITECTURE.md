# MediScan AI: Comprehensive Technical Architecture

## Executive Summary

MediScan AI is a privacy-first multimodal triage assistant for rural clinics that analyzes text descriptions, medical images (rashes, wounds), and audio recordings (coughs) to provide preliminary diagnoses and urgency assessments. All processing occurs locally on the device with zero external data transmission, ensuring complete patient privacy.

---

## Architecture Overview

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     MEDISCAN AI SYSTEM                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         FRONTEND LAYER (Next.js Web App)                 │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │   │
│  │  │  Text      │  │  Image     │  │   Audio    │         │   │
│  │  │  Input     │  │ Upload     │  │  Recorder  │         │   │
│  │  │  Component │  │ Component  │  │ Component  │         │   │
│  │  └────────────┘  └────────────┘  └────────────┘         │   │
│  │         │                │                │              │   │
│  │         └────────────────┼────────────────┘              │   │
│  │                          ▼                               │   │
│  │            ┌──────────────────────────┐                  │   │
│  │            │  Multimodal Data Form    │                  │   │
│  │            │  (Validation & Encoding) │                  │   │
│  │            └──────────────────────────┘                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │                                       │
│                          ▼ (Local IndexedDB/Storage)            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         BACKEND LAYER (Python FastAPI)                   │   │
│  │                                                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │   Image      │  │    Audio     │  │     Text     │   │   │
│  │  │  Processor   │  │  Processor   │  │  Processor   │   │   │
│  │  │  (PyTorch +  │  │  (Librosa)   │  │  (Tokenizer) │   │   │
│  │  │   ResNet)    │  │              │  │              │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  │         │                │                │              │   │
│  │         └────────────────┼────────────────┘              │   │
│  │                          ▼                               │   │
│  │     ┌─────────────────────────────────┐                  │   │
│  │     │  Feature Extraction & Encoding  │                  │   │
│  │     │  - Visual features (ResNet)     │                  │   │
│  │     │  - Audio features (MFCC)        │                  │   │
│  │     │  - Text embeddings (ONNX)       │                  │   │
│  │     └─────────────────────────────────┘                  │   │
│  │                          │                               │   │
│  │                          ▼                               │   │
│  │     ┌─────────────────────────────────┐                  │   │
│  │     │  Medical Knowledge Retrieval    │                  │   │
│  │     │  (Vector DB: Milvus/FAISS)     │                  │   │
│  │     │  - Symptom matching             │                  │   │
│  │     │  - Disease correlations         │                  │   │
│  │     └─────────────────────────────────┘                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │                                       │
│                          ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │    LOCAL LLM INFERENCE LAYER                             │   │
│  │    (Privacy-First, Zero Data Transmission)               │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ Llama-3-8b or TinyLlama (ONNX quantized)        │   │   │
│  │  │ - Reasoning Engine (LangChain)                   │   │   │
│  │  │ - Medical context injection                      │   │   │
│  │  │ - Symptom-to-diagnosis mapping                   │   │   │
│  │  │ - Urgency scoring logic                          │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                          │                               │   │
│  │                          ▼                               │   │
│  │     ┌─────────────────────────────────┐                  │   │
│  │     │  Triage Assessment Generation   │                  │   │
│  │     │  - Preliminary diagnosis        │                  │   │
│  │     │  - Urgency level (Low/Med/High) │                  │   │
│  │     │  - Confidence scores            │                  │   │
│  │     │  - Recommended actions          │                  │   │
│  │     └─────────────────────────────────┘                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          │                                       │
│                          ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │    RESULTS LAYER (Frontend Display)                      │   │
│  │  - Triage assessment visualization                       │   │
│  │  - Clinical decision support                             │   │
│  │  - Patient history (local storage)                       │   │
│  │  - Offline capability                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack Details

### 1. Frontend Layer (Next.js)

**Purpose:** User interface for multimodal input capture and result visualization

**Key Components:**
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Local Storage:** IndexedDB for offline caching
- **Streaming:** Real-time result display during inference

**Key Features:**
```
/app
  /layout.tsx
  /page.tsx (main triage interface)
  /dashboard.tsx (patient history, previous assessments)
/components
  /TextInput.tsx (symptom description)
  /ImageUpload.tsx (wound/rash images)
  /AudioRecorder.tsx (cough recording)
  /TriageResults.tsx (diagnosis & urgency display)
  /PatientHistory.tsx (local patient records)
/hooks
  /useMultimodalCapture.ts (combines all inputs)
  /useOfflineStorage.ts (IndexedDB management)
/services
  /api-client.ts (FastAPI communication)
  /offlineSync.ts (handles offline mode)
```

**Input Capture Pipeline:**
1. Text Input → Real-time validation, character limits
2. Image Upload → Client-side compression (JPEG, WebP), size validation
3. Audio Recording → WebAudio API, WAV/MP3 encoding, duration validation

**Data Flow to Backend:**
- Multipart FormData submission
- Binary images and audio streamed directly
- Text descriptions included with metadata
- No external API calls; communicates only with local FastAPI backend

---

### 2. Backend Layer (Python FastAPI)

**Purpose:** Data processing, feature extraction, and orchestration

**Installation & Dependencies:**
```bash
pip install fastapi uvicorn python-multipart
pip install torch torchvision torchaudio
pip install librosa soundfile
pip install langchain langchain-community
pip install milvus pymilvus
pip install pillow numpy scipy
pip install onnx onnxruntime
```

**Core API Endpoints:**

```python
# /app/api/endpoints
POST /api/triage
  Input: 
    - text_description (str)
    - image (file) - optional
    - audio (file) - optional
    - patient_id (str) - optional
  Output:
    - preliminary_diagnosis (str)
    - urgency_level (enum: LOW|MEDIUM|HIGH)
    - confidence_score (float: 0-1)
    - reasoning (str)
    - recommended_actions (list[str])
    - processing_time (float)

POST /api/medical-knowledge/search
  Input:
    - query (str)
    - symptoms (list[str])
  Output:
    - relevant_conditions (list)
    - medical_references (list)

POST /api/feedback
  Input:
    - assessment_id (str)
    - actual_diagnosis (str)
    - was_helpful (bool)
  Output:
    - feedback_saved (bool)
```

**Directory Structure:**
```
/backend
  /app
    /main.py (FastAPI app initialization)
    /api
      /routes.py (endpoint definitions)
      /schemas.py (Pydantic models)
    /processors
      /image_processor.py (ResNet inference)
      /audio_processor.py (Cough analysis)
      /text_processor.py (Symptom extraction)
    /models
      /feature_extractor.py (unified feature extraction)
      /llm_engine.py (LangChain integration)
      /triage_scorer.py (urgency assessment)
    /knowledge
      /vector_db.py (Milvus/FAISS operations)
      /medical_knowledge.py (knowledge base initialization)
    /utils
      /logging.py
      /config.py
  /requirements.txt
  /Dockerfile
```

---

### 3. Image Processing Module

**Computer Vision Pipeline:**

```python
# /backend/app/processors/image_processor.py

class ImageProcessor:
    def __init__(self):
        # Load pre-trained ResNet-50 (ImageNet weights)
        self.model = torchvision.models.resnet50(pretrained=True)
        # Fine-tune last layer for medical classification
        self.model.fc = torch.nn.Linear(2048, 256)  # Medical feature space
        
    def preprocess_image(self, image_path):
        """
        - Load and validate image (JPEG/PNG)
        - Resize to 224x224
        - Normalize using ImageNet statistics
        - Apply mild augmentation for robustness
        """
        
    def extract_features(self, image_path):
        """
        - ResNet-50 feature extraction (2048-dim vector)
        - Reduce to 256-dim medical feature space
        - Return: visual_features, confidence_map
        """
        
    def classify_lesion(self, visual_features):
        """
        - Classify wound/rash characteristics
        - Return: {type, severity, affected_area_percent}
        """
```

**Medical Image Classification:**
- Wound analysis: depth, size, infection indicators
- Rash analysis: distribution, color variation, texture
- Feature vector: 256-dimensional embedding
- Confidence scoring: per-classification metric

---

### 4. Audio Processing Module

**Cough Analysis Pipeline:**

```python
# /backend/app/processors/audio_processor.py

class AudioProcessor:
    def __init__(self):
        self.sr = 16000  # Sample rate
        
    def preprocess_audio(self, audio_path):
        """
        - Load audio file (WAV/MP3)
        - Resample to 16kHz
        - Normalize amplitude
        - Segment into 2-3 second windows
        """
        
    def extract_acoustic_features(self, audio_signal):
        """
        - MFCC (Mel-Frequency Cepstral Coefficients): 13-40 coefficients
        - Spectral features: energy, spectral centroid, rolloff
        - Temporal features: onset strength, tempogram
        - Return: feature_matrix (time_steps x features)
        """
        
    def classify_cough_type(self, features):
        """
        - Dry vs productive cough
        - Severity assessment
        - Duration and frequency analysis
        - Return: {type, severity_score, pattern_indicators}
        """
        
    def detect_respiratory_patterns(self, features):
        """
        - Identify abnormal breathing patterns
        - Wheezing detection
        - Return: respiratory_indicators
        """
```

**Feature Extraction:**
- MFCC (26-dim): frequency-domain representation
- Spectral features (8-dim): energy characteristics
- Temporal features (4-dim): timing patterns
- Total audio feature vector: 38-dimensional embedding

---

### 5. Medical Knowledge Retrieval System

**Vector Database Integration (Milvus/FAISS):**

```python
# /backend/app/knowledge/vector_db.py

class MedicalKnowledgeBase:
    def __init__(self):
        # Local vector DB: Milvus or FAISS
        self.client = MilvusClient(db_path="./mediscan_knowledge.db")
        
    def initialize_knowledge_base(self):
        """
        Load and embed medical reference materials:
        - ICD-10 diagnostic codes
        - Symptom descriptions
        - Disease manifestations
        - Treatment protocols
        - Clinical decision rules
        """
        
    def search_similar_conditions(self, symptoms, visual_features, audio_features):
        """
        Multi-modal semantic search:
        1. Embed input features into vector space
        2. Search for semantically similar conditions
        3. Return top-k matches with similarity scores
        """
        
    def retrieve_clinical_context(self, condition_id):
        """
        Fetch associated medical knowledge:
        - Diagnostic criteria
        - Differential diagnoses
        - Treatment options
        - Severity classification
        """
```

**Knowledge Base Content:**
- Medical textbooks (digitized, indexed)
- Clinical guidelines (WHO, CDC, local protocols)
- Symptom-disease mappings
- Image atlases (wound types, rash patterns)
- Decision trees for triage

---

### 6. Local LLM Inference Engine

**LangChain + Local Llama Integration:**

```python
# /backend/app/models/llm_engine.py

from langchain.llms import Ollama
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

class TriageAssistant:
    def __init__(self):
        # Initialize local Llama model (quantized ONNX)
        self.llm = Ollama(
            model="llama2:7b-q4",  # or TinyLlama
            temperature=0.3,  # Low temp for consistency
            top_p=0.9
        )
        
    def create_medical_context(self, 
                               symptoms_text,
                               visual_findings,
                               audio_findings,
                               retrieved_knowledge):
        """
        Build context-rich prompt for LLM:
        
        Context:
        - Patient symptoms: {symptoms}
        - Visual examination findings: {visual_findings}
        - Respiratory findings: {audio_findings}
        - Relevant medical knowledge: {retrieved_knowledge}
        
        Task: Provide preliminary triage assessment
        """
        
    def generate_triage_assessment(self, context):
        """
        LLM chain execution:
        1. Symptom interpretation
        2. Differential diagnosis generation
        3. Urgency scoring
        4. Recommendation generation
        """
        
    def extract_structured_output(self, llm_output):
        """
        Parse LLM response into structured format:
        {
            "preliminary_diagnosis": str,
            "urgency_level": "LOW|MEDIUM|HIGH",
            "confidence_score": float,
            "reasoning": str,
            "recommended_actions": list[str]
        }
        """
```

**Inference Optimization:**
- Model quantization: ONNX INT8 for 80% faster inference
- Batch processing: multiple assessments in parallel
- Memory management: streaming token generation
- Latency target: <5 seconds per assessment

---

### 7. Triage Logic & Urgency Assessment

**Clinical Decision Rules Engine:**

```python
# /backend/app/models/triage_scorer.py

class TriageScorer:
    def calculate_urgency_level(self, 
                               symptoms,
                               visual_severity,
                               audio_indicators,
                               llm_assessment):
        """
        Multi-factor urgency scoring:
        
        RED FLAGS (High urgency):
        - Respiratory distress
        - Severe dehydration indicators
        - Significant wound infection
        - Altered consciousness
        - Severe pain
        
        YELLOW FLAGS (Medium urgency):
        - Persistent cough (>2 weeks)
        - Moderate wound/rash
        - Mild fever with complications
        - Breathing difficulties
        
        GREEN FLAGS (Low urgency):
        - Mild symptoms
        - No fever
        - Stable vital indicators
        - Non-emergency presentation
        
        Return: urgency_score (0-100) → categorical
        """
        
    def generate_action_recommendations(self, urgency_level, diagnosis):
        """
        Clinical pathways:
        - HIGH: Immediate referral, emergency measures
        - MEDIUM: Urgent follow-up, specific treatment
        - LOW: Home care, follow-up in days
        """
```

---

## Data Flow & Privacy Architecture

### End-to-End Privacy Model

**1. Data Capture (Frontend)**
- All input captured locally in browser
- No automatic transmission
- User explicitly submits data

**2. Data Transmission**
- HTTPS encrypted connection to local FastAPI backend
- No third-party API calls
- No cloud transmission
- Data stays within clinic network

**3. Local Processing**
- All models run on clinic server/device
- Models pre-downloaded, no online fetching
- Results generated locally
- No external dependencies

**4. Data Storage**
- IndexedDB: Local browser caching (patient-specific)
- Database: Optional local PostgreSQL for historical records
- Encryption at rest: AES-256 for sensitive data
- No backup to cloud without explicit consent

**5. Result Delivery**
- Results returned immediately to frontend
- Displayed in browser
- Optionally stored locally for reference
- No external logging

### Database Schema (Optional Local Storage)

```sql
-- Clinic Staff & Patients
CREATE TABLE patients (
    id UUID PRIMARY KEY,
    clinic_id UUID NOT NULL,
    created_at TIMESTAMP,
    age_group ENUM,
    gender VARCHAR
);

CREATE TABLE assessments (
    id UUID PRIMARY KEY,
    patient_id UUID REFERENCES patients,
    timestamp TIMESTAMP,
    symptoms_text TEXT,
    preliminary_diagnosis TEXT,
    urgency_level ENUM('LOW', 'MEDIUM', 'HIGH'),
    confidence_score FLOAT,
    was_accurate BOOLEAN,  -- feedback
    actual_diagnosis TEXT,  -- feedback
    clinician_notes TEXT
);

CREATE TABLE medical_images (
    id UUID PRIMARY KEY,
    assessment_id UUID REFERENCES assessments,
    image_hash VARCHAR UNIQUE,  -- no raw images stored
    extracted_features VECTOR,
    classification_result JSONB
);

CREATE TABLE cough_recordings (
    id UUID PRIMARY KEY,
    assessment_id UUID REFERENCES assessments,
    audio_hash VARCHAR UNIQUE,
    extracted_features VECTOR,
    cough_type VARCHAR,
    severity_score FLOAT
);
```

---

## Deployment Architecture

### Option 1: Docker Container (Recommended for Clinics)

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download models (during build)
RUN python -c "
    import torch
    torchvision.models.resnet50(pretrained=True)
    # Download Llama model
    from ollama import pull
    pull('llama2:7b-q4')
"

# Copy application
COPY . .

# Expose API port
EXPOSE 8000

# Run FastAPI server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Deployment Command:**
```bash
docker run -d \
  -p 8000:8000 \
  -v mediscan_data:/app/data \
  -e CLINIC_NAME="Rural Clinic Name" \
  mediscan-ai:latest
```

### Option 2: Standalone Server (No Docker)

```bash
# System requirements
# - CPU: 4+ cores
# - RAM: 16GB minimum (32GB recommended for LLM)
# - Storage: 50GB (models + knowledge base)
# - Network: Local LAN connection

# Installation
git clone <mediscan-repo>
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Download models
python scripts/download_models.py

# Start server
python app/main.py
```

---

## Integration Points & APIs

### Frontend ↔ Backend Communication

**Request/Response Flow:**

```typescript
// Frontend: /services/api-client.ts

async function submitTriageAssessment(
  symptoms: string,
  imageFile?: File,
  audioFile?: File
): Promise<TriageResult> {
  const formData = new FormData();
  formData.append('text_description', symptoms);
  if (imageFile) formData.append('image', imageFile);
  if (audioFile) formData.append('audio', audioFile);
  
  const response = await fetch('/api/triage', {
    method: 'POST',
    body: formData
  });
  
  const result: TriageResult = await response.json();
  return result;
}
```

```python
# Backend: /app/api/routes.py

@app.post("/api/triage")
async def submit_triage(
    text_description: str = Form(...),
    image: Optional[UploadFile] = File(None),
    audio: Optional[UploadFile] = File(None),
    patient_id: Optional[str] = Form(None)
):
    # 1. Preprocess inputs
    # 2. Extract features from each modality
    # 3. Search medical knowledge base
    # 4. Generate LLM assessment
    # 5. Score urgency
    # 6. Return structured result
    
    return TriageResult(
        preliminary_diagnosis=diagnosis,
        urgency_level=urgency,
        confidence_score=confidence,
        reasoning=reasoning,
        recommended_actions=actions
    )
```

---

## Performance & Optimization

### Inference Latency Targets

| Component | Latency | Optimization |
|-----------|---------|--------------|
| Image Processing | 500-800ms | ResNet-50 quantized ONNX |
| Audio Processing | 300-500ms | Cached MFCC computation |
| Knowledge Retrieval | 200-400ms | Vector DB indexing |
| LLM Inference | 2-4s | Llama quantization, batching |
| Total End-to-End | <5 seconds | Parallel processing |

### Resource Requirements

```yaml
Minimum Configuration:
  CPU: 4 cores @ 2.0 GHz
  RAM: 16 GB
  Storage: 50 GB (SSD)
  GPU: Optional (RTX 2060 or better for 2-3x speedup)

Recommended Configuration:
  CPU: 8+ cores @ 3.0+ GHz
  RAM: 32 GB
  Storage: 100 GB SSD
  GPU: RTX 3060/4060 (12GB VRAM)
```

---

## Security & Privacy Checklist

- [x] All models run locally (zero cloud transmission)
- [x] HTTPS encryption for clinic network
- [x] No external API dependencies
- [x] Encrypted patient data at rest
- [x] Session-based authentication (clinic staff)
- [x] Audit logs for all assessments
- [x] Data retention policies
- [x] User consent mechanisms
- [x] Role-based access control (clinic staff/admin)
- [x] Regular security updates for dependencies

---

## Implementation Roadmap

### Phase 1: MVP (Weeks 1-4)
- [ ] Frontend UI for symptom text input
- [ ] Basic image upload with ResNet classification
- [ ] FastAPI backend with image processing
- [ ] LLM integration with basic prompting
- [ ] Simple urgency scoring

### Phase 2: Full Multimodal (Weeks 5-8)
- [ ] Audio recording & cough analysis
- [ ] Medical knowledge base integration
- [ ] Enhanced LLM reasoning with LangChain
- [ ] Confidence scoring

### Phase 3: Optimization & Deployment (Weeks 9-12)
- [ ] Model quantization & optimization
- [ ] Docker containerization
- [ ] Patient history tracking
- [ ] Clinical validation testing

### Phase 4: Clinic Rollout (Weeks 13+)
- [ ] Deployment to pilot clinics
- [ ] User training & support
- [ ] Feedback collection & iteration
- [ ] Scale to additional clinics

---

## Next Steps

1. **Set up development environment:**
   - Clone repository
   - Install Python dependencies
   - Download pre-trained models

2. **Build frontend UI components:**
   - Symptom input form
   - Image upload widget
   - Audio recorder

3. **Implement backend API:**
   - FastAPI server initialization
   - Image processing pipeline
   - Audio processing pipeline

4. **Integrate LLM:**
   - Download Llama model
   - Set up LangChain chains
   - Test inference latency

5. **Deploy locally:**
   - Docker containerization
   - Network configuration
   - Security hardening

---

## References & Resources

- **Computer Vision:** PyTorch, torchvision, ResNet-50 pretrained models
- **Audio Processing:** Librosa, SciPy signal processing
- **LLM Inference:** LangChain, Ollama, Llama-3-8b/TinyLlama
- **Vector Database:** Milvus (recommended) or FAISS (lightweight alternative)
- **Frontend:** Next.js 16, shadcn/ui, Tailwind CSS
- **Backend:** FastAPI, Uvicorn, Python 3.11+
