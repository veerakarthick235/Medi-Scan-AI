# MediScan AI - Implementation Guide

## Project Structure

```
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
```

---

## Setup Instructions

### Prerequisites

- **Node.js 18+** - For Next.js frontend
- **Python 3.11+** - For FastAPI backend
- **4+ CPU cores** - For model inference
- **16GB RAM minimum** - For LLM and image processing
- **50GB disk space** - For models and knowledge base

### Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Access frontend at: `http://localhost:3000`

### Backend Setup

```bash
# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Download models (one-time setup)
python scripts/download_models.py

# Start FastAPI server
python app/main.py

# Or using Uvicorn directly
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Access API at: `http://127.0.0.1:8000`
API docs at: `http://127.0.0.1:8000/docs`

---

## Configuration

### Environment Variables

Create `.env` file in project root:

```bash
# Server configuration
HOST=127.0.0.1
PORT=8000

# Model configuration
PRELOAD_MODELS=false
LOG_LEVEL=INFO

# Storage paths
DATA_DIR=./data
MODELS_DIR=./models
KNOWLEDGE_DB=./data/mediscan_knowledge.db
```

### Model Configuration

Edit `backend/app/utils/config.py` for:
- Model names and versions
- Input/output sizes
- Processing parameters
- Storage locations

---

## API Endpoints

### 1. Triage Assessment

**POST** `/api/triage`

Request (multipart form-data):
```
- text_description (string): Patient symptoms [required]
- image (file): Medical image [optional]
- audio (file): Audio recording [optional]
- patient_id (string): Patient identifier [optional]
- clinic_id (string): Clinic identifier [optional]
```

Response:
```json
{
  "preliminary_diagnosis": "string",
  "urgency_level": "LOW|MEDIUM|HIGH",
  "confidence_score": 0.0-1.0,
  "reasoning": "string",
  "recommended_actions": ["string"],
  "processing_time": 4.25
}
```

Example cURL:
```bash
curl -X POST http://127.0.0.1:8000/api/triage \
  -F "text_description=persistent cough and fever" \
  -F "image=@wound.jpg" \
  -F "audio=@cough.wav"
```

### 2. Medical Knowledge Search

**POST** `/api/knowledge/search`

Request:
```json
{
  "query": "symptoms query",
  "symptoms": ["symptom1", "symptom2"],
  "limit": 10
}
```

Response:
```json
{
  "relevant_conditions": [...],
  "medical_references": [...],
  "search_time": 0.45
}
```

### 3. Assessment Feedback

**POST** `/api/feedback`

Request:
```json
{
  "assessment_id": "string",
  "actual_diagnosis": "string",
  "was_helpful": true,
  "clinician_notes": "string"
}
```

### 4. Health Check

**GET** `/health`

Returns operational status of all components.

---

## Component Integration

### Frontend Components

#### Header
- Application branding
- Privacy notice
- Real-time status

#### TriageForm
- Text symptom input
- Image upload with drag-drop
- Audio recording (microphone access required)
- Form validation
- Loading states

#### TriageResults
- Urgency level visualization
- Diagnosis confidence display
- Clinical reasoning explanation
- Action recommendations
- Clinical disclaimer

#### PatientHistory
- Assessment history list
- Filtering and sorting
- Patient demographic tracking
- Export/print functionality

### Backend Modules

#### ImageProcessor
- Image validation
- ResNet-50 feature extraction
- Lesion classification
- Severity assessment

#### AudioProcessor
- Audio preprocessing
- MFCC extraction
- Spectral analysis
- Cough classification
- Respiratory pattern detection

#### TriageAssistant (LLM)
- Medical context building
- LLM prompt generation
- Response parsing
- Structured output extraction

#### MedicalKnowledgeBase
- Vector database operations
- Semantic knowledge search
- Condition retrieval
- Clinical guideline access

#### TriageScorer
- Red flag detection
- Urgency level calculation
- Action recommendation generation
- Risk stratification

---

## Data Flow

### 1. Assessment Submission
```
Frontend (TriageForm)
  ↓ (multipart form data)
Backend (POST /api/triage)
  ↓
Request Validation
  ↓
  ├── Image Processing (if provided)
  │   ├── Preprocess image
  │   ├── Extract features
  │   └── Classify findings
  │
  ├── Audio Processing (if provided)
  │   ├── Preprocess audio
  │   ├── Extract MFCC features
  │   └── Classify cough/breathing
  │
  └── Medical Knowledge Retrieval
      ├── Embed symptoms
      └── Search vector DB
  ↓
LLM Reasoning
  ├── Create medical context
  ├── Generate assessment
  └── Parse structured output
  ↓
Urgency Scoring
  ├── Check red/yellow flags
  ├── Calculate urgency level
  └── Generate actions
  ↓
Response (JSON)
  ↓
Frontend (TriageResults)
  ├── Display urgency badge
  ├── Show diagnosis
  ├── Display reasoning
  └── List recommendations
```

### 2. Privacy & Security Flow
```
Input Data (Frontend)
  ↓
Local Encryption (Optional)
  ↓
HTTPS Transport
  ↓
Backend Receives
  ↓
Process Locally
  (No external API calls)
  ↓
Store Features Only
  (Not raw images/audio)
  ↓
Encrypt at Rest (Optional)
  ↓
Response to Frontend
```

---

## Performance Optimization

### Image Processing
- Resize to 224x224 before inference
- Use JPEG compression (80% quality)
- ONNX quantization for 3x speedup
- Batch processing for multiple images

### Audio Processing
- Resample to 16kHz
- Use 20ms frame windows
- Cache MFCC computations
- Process in chunks for long recordings

### LLM Inference
- Use quantized models (INT8)
- Temperature = 0.3 for consistency
- Top-p = 0.9 for quality
- Streaming token generation

### Knowledge Base
- Local vector DB (no network calls)
- Efficient indexing (FAISS)
- Cached embeddings
- Pre-loaded common conditions

---

## Model Downloads

### Required Models

```bash
# Computer Vision (ResNet-50) ~170MB
python -c "import torchvision.models as m; m.resnet50(pretrained=True)"

# LLM (Llama 2 via Ollama) ~4GB
ollama pull llama2:7b-q4

# Embeddings (Optional) ~100MB
python -c "from sentence_transformers import SentenceTransformer; \
  SentenceTransformer('all-MiniLM-L6-v2')"
```

### Alternative Lightweight Models

- **Image**: MobileNetV2 (~10MB)
- **LLM**: TinyLlama (~2GB)
- **Audio**: Pre-computed spectrograms

---

## Testing

### Unit Tests
```bash
# Frontend
npm test

# Backend
pytest backend/tests/
```

### Integration Tests
```bash
# Test full assessment pipeline
python backend/tests/test_triage_pipeline.py
```

### API Testing
```bash
# Using Postman or curl
curl -X POST http://127.0.0.1:8000/api/triage \
  -F "text_description=test symptoms"
```

---

## Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t mediscan-ai .

# Run container
docker run -d \
  -p 3000:3000 \
  -p 8000:8000 \
  -v mediscan_data:/data \
  mediscan-ai:latest
```

### Cloud Deployment (with privacy considerations)

**Options:**
1. **Self-hosted on clinic server** (Recommended)
   - Full privacy control
   - No data transmission
   - Network isolated

2. **VPS with encrypted tunnel**
   - Clinic network security
   - Backup and redundancy
   - Professional hosting

3. **Hybrid deployment**
   - Local inference
   - Optional cloud backup
   - Encrypted synchronization

---

## Monitoring & Logging

### Application Logs

```bash
# View FastAPI logs
tail -f logs/mediscan.log

# Enable debug mode
export LOG_LEVEL=DEBUG
python app/main.py
```

### Performance Metrics

- Assessment processing time
- Model inference latency
- Memory usage
- API response times

### Health Checks

```bash
# Check API health
curl http://127.0.0.1:8000/health

# Monitor in real-time
watch -n 5 'curl http://127.0.0.1:8000/health'
```

---

## Troubleshooting

### Frontend Issues

| Issue | Solution |
|-------|----------|
| Images not uploading | Check browser console, verify file size <10MB |
| Audio recording fails | Ensure browser microphone permission granted |
| Slow form submission | Check network latency, backend responsiveness |

### Backend Issues

| Issue | Solution |
|-------|----------|
| Model loading fails | Verify model downloads, check disk space |
| Out of memory | Increase RAM, use quantized models |
| Slow inference | Check CPU load, enable GPU if available |
| API timeout | Increase timeout in FastAPI config |

### Data Issues

| Issue | Solution |
|-------|----------|
| Knowledge base empty | Run initialization script |
| Bad assessment results | Verify input data quality |
| Storage full | Archive old assessments, clean temp files |

---

## Next Steps

### Phase 1: Basic Triage
- ✅ Frontend UI complete
- ✅ Backend API structure complete
- [ ] Model integration (PyTorch/Ollama)
- [ ] Knowledge base initialization
- [ ] Local testing

### Phase 2: Full Integration
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Docker containerization
- [ ] Documentation polish

### Phase 3: Clinic Deployment
- [ ] Security hardening
- [ ] User training materials
- [ ] Backup/recovery procedures
- [ ] Monitoring dashboards

### Phase 4: Iteration
- [ ] Collect feedback
- [ ] Fine-tune models
- [ ] Expand knowledge base
- [ ] Scale to multiple clinics

---

## Support & Resources

### Documentation
- Technical Architecture: `MEDISCAN_ARCHITECTURE.md`
- API Documentation: `http://localhost:8000/docs`
- Code Comments: See inline documentation

### Community
- GitHub Issues: Report bugs and feature requests
- Clinical Validation: Test with local healthcare providers
- User Feedback: Collect improvement suggestions

### References
- [Ollama Documentation](https://ollama.ai)
- [LangChain Docs](https://docs.langchain.com)
- [Librosa Audio](https://librosa.org)
- [PyTorch](https://pytorch.org)

---

## License & Attribution

This project is designed for humanitarian and educational use in underserved healthcare settings. Please refer to license terms for usage restrictions and attribution requirements.

---

Last Updated: January 2025
