#!/bin/bash

# LuminaOps Setup Script
echo "🚀 Setting up LuminaOps development environment..."

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cat > .env << EOF
# Database (SQLite for development)
DATABASE_URL=sqlite:///./lumina_ops.db

# Redis (Optional - will use in-memory fallback)
REDIS_URL=redis://localhost:6379

# File Storage (Local development)
STORAGE_PATH=./data/storage
ARTIFACTS_PATH=./data/artifacts

# Security
SECRET_KEY=$(openssl rand -hex 32 2>/dev/null || echo "development-secret-key-change-in-production")
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# MLflow (Local development)
MLFLOW_TRACKING_URI=file:./data/mlflow
MLFLOW_ARTIFACT_ROOT=./data/mlflow/artifacts

# Development
DEBUG=true
ENVIRONMENT=development
PYTHONPATH=./backend
EOF
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
echo "Installing Python packages..."
pip install -r requirements.txt

# Go back to root directory
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p data/{storage,artifacts,mlflow,logs}
mkdir -p logs
mkdir -p ml-services/notebooks

# Initialize data directories
echo "📊 Initializing data directories..."
touch data/logs/app.log
mkdir -p data/mlflow/artifacts

# Initialize database (will be created when app starts)
echo "🗃️ Database will be initialized automatically when the backend starts..."

echo "✅ Setup complete!"
echo ""
echo "🏃‍♂️ Quick start:"
echo "1. Start the backend server:"
echo "   cd backend && source venv/bin/activate && python main.py"
echo ""
echo "2. In another terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Access the services:"
echo "   • Web UI: http://localhost:3000"
echo "   • API: http://localhost:8000"
echo "   • API Docs: http://localhost:8000/docs"
echo ""
echo "4. Login credentials:"
echo "   • Username: admin"
echo "   • Password: admin"
echo ""
echo "🔧 Development commands:"
echo "   • Backend tests: cd backend && source venv/bin/activate && pytest"
echo "   • Frontend tests: cd frontend && npm test"
echo "   • Format code: cd backend && source venv/bin/activate && black ."
echo ""
echo "📚 Documentation: ./docs/"
echo ""
echo "💡 Tip: Use 'source backend/venv/bin/activate' to activate the Python environment"