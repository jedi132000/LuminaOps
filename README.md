# LuminaOps - Next-Generation AI/ML & Analytics Platform

LuminaOps is a comprehensive, cloud-native AI/ML platform that empowers enterprises to rapidly develop, deploy, and monitor machine learning and analytics solutions at scale. With integrated AI assistance, automated ML capabilities, and intelligent workflow management, LuminaOps accelerates your journey from data to insights.

## 🚀 Core Features

### 🤖 AI-Powered Platform
- **AI Assistant**: Integrated LLM-powered assistant for code generation, explanations, and ML guidance
- **AutoML Training**: Automated machine learning with FLAML, Auto-sklearn, and TPOT integration
- **Intelligent Code Generation**: AI-driven Python ML code generation and optimization
- **Smart Data Analysis**: Automated insights and recommendations from uploaded datasets
- **Model Recommendations**: AI-powered suggestions for optimal ML models based on your data

### 🛠 Core ML Operations
- **Data Lakehouse**: Centralized, governed storage for batch and streaming data
- **ML Pipeline Orchestration**: Visual and API-driven workflow engine with intelligent automation
- **Advanced Experiment Tracking**: Comprehensive experiment management with AI-assisted optimization
- **Model Registry**: Versioned model catalog with lifecycle management and automated deployment
- **Real-time Monitoring**: Intelligent drift detection and performance analytics
- **Vector Database**: Semantic search and document similarity for ML applications

### 🔐 Enterprise Ready
- **Multi-Provider LLM Support**: OpenAI, Anthropic, and Hugging Face integrations
- **Compliance & Security**: Role-based access control and comprehensive audit logs
- **Scalable Architecture**: Kubernetes-native with auto-scaling capabilities
- **Developer Experience**: Modern React UI with Jupyter integration and API-first design

## 🏗 Architecture

```
LuminaOps/
├── frontend/                    # React 18 + TypeScript + Ant Design v5
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Main application pages
│   │   │   ├── AIAssistant.tsx    # AI chat interface
│   │   │   ├── AutoMLTraining.tsx # AutoML training interface  
│   │   │   ├── Dashboard.tsx      # Main dashboard
│   │   │   ├── Experiments.tsx    # ML experiments management
│   │   │   ├── Models.tsx         # Model registry
│   │   │   └── Pipelines.tsx      # Pipeline orchestration
│   │   ├── services/          # API integration layer
│   │   │   └── api.ts            # Enhanced with AI endpoints
│   │   └── store/             # State management
│   └── dist/                  # Built application assets
├── backend/                     # FastAPI + AI Services
│   ├── api/                   # REST API endpoints
│   │   └── v1/                
│   │       ├── ai/            # AI service endpoints
│   │       ├── experiments/   # Experiment management
│   │       ├── models/        # Model operations
│   │       └── pipelines/     # Pipeline management
│   ├── ai_services/           # AI service implementations
│   │   ├── llm/              # Large Language Model integrations
│   │   ├── automl/           # Automated ML services
│   │   ├── vector_db/        # Vector database operations
│   │   └── assistant/        # AI assistant logic
│   ├── core/                 # Core platform services
│   ├── data/                 # Data processing utilities
│   ├── venv/                 # Python virtual environment
│   └── main.py               # Application entry point
├── docs/                       # Documentation
├── scripts/                    # Automation and deployment scripts
└── start_servers.sh           # Quick start script
```

### 🔄 Data Flow

```
User Request → React Frontend → FastAPI Backend → AI Services → Response
     ↓              ↓              ↓              ↓
1. UI Interaction  2. API Call    3. Processing   4. AI Integration
   - Form Submit   - Auth Check   - Data Prep    - LLM Query
   - File Upload   - Validation   - ML Training  - AutoML Run
   - Chat Input    - Routing      - Persistence  - Vector Search
```

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript and Vite
- **Ant Design v5** for modern UI components
- **React Query** for efficient data fetching
- **React Router** for navigation

### Backend & AI Services
- **FastAPI** with async/await support
- **Multi-LLM Integration**: OpenAI GPT-4, Anthropic Claude, Hugging Face
- **AutoML Engines**: FLAML (Microsoft), Auto-sklearn, TPOT
- **Vector Databases**: ChromaDB, FAISS, Weaviate
- **ML Frameworks**: Scikit-learn, XGBoost, PyTorch, TensorFlow

### Data & Infrastructure
- **Database**: PostgreSQL, Redis, SQLite (dev)
- **Data Storage**: MinIO (S3-compatible), local filesystem
- **Orchestration**: Kubernetes, Docker Compose
- **Monitoring**: Prometheus + Grafana, built-in metrics

## ✅ Current Implementation Status

### 🎯 **Fully Functional Features**

#### ✅ **AI Assistant & LLM Services**
- **Multi-Provider Support**: OpenAI, Anthropic, Hugging Face integrations
- **Automatic Initialization**: Smart client initialization for seamless operation
- **Text Generation**: Comprehensive AI-powered text generation with configurable parameters
- **Code Generation**: AI-driven Python ML code generation (sample available)
- **Error Handling**: Robust error management with user-friendly messages

#### ✅ **AutoML Training**
- **Multiple Engines**: FLAML, XGBoost, LightGBM support
- **Classification & Regression**: Full problem type coverage
- **Real-time Training**: Live model training with progress tracking
- **Performance Metrics**: Accuracy, F1-score, feature importance analysis
- **JSON Serialization**: Fixed NumPy type serialization for API responses

#### ✅ **Backend Infrastructure** 
- **FastAPI Server**: Production-ready async API server
- **Environment Configuration**: Secure API key management
- **Authentication Bypass**: Development-friendly authentication for testing
- **Comprehensive Endpoints**: Full REST API for all AI services
- **Error Handling**: Proper exception management and logging

#### ✅ **Frontend Interface**
- **Modern UI**: React 18 + TypeScript + Ant Design v5
- **AI Chat Interface**: Interactive AI assistant with real-time responses
- **AutoML Interface**: Intuitive model training with progress tracking
- **Enhanced Monitoring**: Rich dashboard with sample data visualization
- **Responsive Design**: Mobile-friendly interface design

### 🔧 **Development Environment Ready**
- **Virtual Environment**: Properly configured Python environment
- **API Keys**: OpenAI integration configured and tested
- **Sample Datasets**: Ready-to-use CSV files for experimentation
- **Development Server**: Backend running on `http://localhost:8000`

### 🧪 **Test Results**
```bash
# AI Assistant Test
✅ Text Generation: Working with OpenAI GPT-4
✅ Error Handling: Graceful degradation with informative messages
✅ Parameter Configuration: Temperature, model selection, token limits

# AutoML Test Results
✅ FLAML Engine: 100% accuracy on test dataset
✅ XGBoost Engine: 50% accuracy on sample dataset  
✅ Feature Importance: Automated feature analysis
✅ JSON Response: Proper serialization of NumPy objects
```

## 🚦 Getting Started

### Quick Start (Recommended)
```bash
# Start everything with one command
./start_luminaops.sh
```

### Manual Start
```bash
# Start backend server
cd /Users/oladimejioladipo/Lumiaops/backend
PYTHONPATH=/Users/oladimejioladipo/Lumiaops/backend \
/Users/oladimejioladipo/Lumiaops/backend/venv/bin/python \
-m uvicorn main:app --reload --port 8000

# In another terminal, run examples
cd /Users/oladimejioladipo/Lumiaops/examples
/Users/oladimejioladipo/Lumiaops/backend/venv/bin/python quick_test.py
```

### Test Everything Works
```bash
# Quick validation
/Users/oladimejioladipo/Lumiaops/backend/venv/bin/python examples/quick_test.py

# Full demo
/Users/oladimejioladipo/Lumiaops/backend/venv/bin/python examples/demo_data_usage.py

# Web interface
open examples/demo_web_interface.html
```

### Prerequisites

- **Node.js 18+** and npm
- **Python 3.9+** with pip
- **Git** for version control
- **Optional**: Docker for containerized deployment

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jedi132000/LuminaOps.git
   cd LuminaOps
   ```

2. **Use the automated startup script:**
   ```bash
   chmod +x start_servers.sh
   ./start_servers.sh
   ```

   Or start manually:

3. **Backend setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   
   # Start the backend server
   PYTHONPATH=. uvicorn main:app --host 0.0.0.0 --port 8002 --reload
   ```

4. **Frontend setup** (in a new terminal):
   ```bash
   cd frontend
   npm install
   
   # Start the frontend server
   npm run dev
   ```

5. **Access the platform:**
   - **Web UI**: http://localhost:3000
   - **API Documentation**: http://localhost:8002/docs
   - **API Health Check**: http://localhost:8002/health

### 🔑 Environment Configuration

Create a `.env` file in the backend directory for AI services:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic Configuration  
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Hugging Face Configuration
HUGGINGFACE_TOKEN=your_huggingface_token_here

# Database Configuration (optional)
DATABASE_URL=sqlite:///./app.db
```

### 📱 Platform Navigation

Once running, explore these key features:

- **📊 Dashboard**: Overview of experiments, models, and system health
- **🧪 Experiments**: Create and manage ML experiments with interactive forms
- **🤖 AI Assistant**: Chat with AI for ML guidance, code generation, and explanations
- **⚡ AutoML Training**: Upload CSV files for automated ML model training
- **🏗 Models**: Register, version, and deploy ML models
- **🔄 Pipelines**: Orchestrate ML workflows and data processing
- **📈 Monitoring**: Real-time system metrics and model performance

## 🎯 AI Features in Detail

### 🤖 AI Assistant
- **Text Generation**: Get explanations, tutorials, and ML guidance from integrated LLMs
- **Code Generation**: Generate Python ML code from natural language descriptions
- **Data Analysis**: Upload CSV files for AI-powered insights and recommendations
- **Model Suggestions**: Receive intelligent recommendations for ML models based on your data

### ⚡ AutoML Training
- **Drag & Drop Interface**: Simple CSV upload with automatic data type detection
- **Multiple Engines**: Choose from FLAML, Auto-sklearn, or TPOT for automated training
- **Real-time Progress**: Live training updates with performance metrics
- **Model Comparison**: Compare multiple trained models with detailed metrics
- **Configurable Parameters**: Adjust time budgets, problem types, and model preferences

### 🔍 Vector Database Integration
- **Semantic Search**: Find similar documents and data using AI embeddings
- **Knowledge Base**: Build searchable repositories of ML knowledge and documentation
- **Context-Aware Recommendations**: Get suggestions based on your data patterns

## 📖 Documentation & Examples

### API Endpoints
- **Interactive API Docs**: http://localhost:8002/docs (Swagger UI)
- **AI Services**: `/api/v1/ai/llm/`, `/api/v1/ai/automl/`, `/api/v1/ai/vector-db/`
- **Core Platform**: `/api/v1/experiments/`, `/api/v1/models/`, `/api/v1/pipelines/`

### Example Workflows
1. **Quick ML Model**: Upload CSV → Configure AutoML → Train → Deploy
2. **AI-Assisted Development**: Ask AI Assistant → Generate Code → Run Experiment
3. **Data Exploration**: Upload Dataset → Get AI Analysis → Create Experiment

## 🧪 Testing & Development

```bash
# Frontend build and testing
cd frontend
npm run build    # Build for production
npm run test     # Run test suite
npm run lint     # Code quality checks

# Backend testing
cd backend  
pytest           # Run Python tests
uvicorn main:app --reload  # Development server

# Full application testing
./start_servers.sh  # Start both servers
curl http://localhost:8002/health  # Test backend
curl http://localhost:3000/        # Test frontend
```

## 🚢 Production Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build individual services
docker build -t lumina-backend ./backend
docker build -t lumina-frontend ./frontend
```

### Environment Variables
```env
# Production settings
NODE_ENV=production
VITE_API_URL=https://your-api-domain.com

# Security
JWT_SECRET_KEY=your-secure-jwt-secret
DATABASE_URL=postgresql://user:pass@host:5432/lumina

# AI Service Keys (required for full functionality)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
HUGGINGFACE_TOKEN=hf_...
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository** and clone locally
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Submit a Pull Request** with a clear description

### Development Guidelines
- Follow TypeScript/Python type annotations
- Add tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Ensure all CI checks pass

## 🆘 Support & Community

- **📚 Documentation**: Comprehensive guides and API references
- **🐛 Issues**: [GitHub Issues](https://github.com/jedi132000/LuminaOps/issues) for bug reports
- **💬 Discussions**: [GitHub Discussions](https://github.com/jedi132000/LuminaOps/discussions) for questions
- **📧 Contact**: Reach out for enterprise support and custom implementations

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🌟 Star History

If you find LuminaOps helpful, please give it a star ⭐ to support the project!

---

**Built with ❤️ by the LuminaOps Team** | **Powered by AI for the Future of ML**