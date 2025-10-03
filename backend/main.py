from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

from core.config import settings
from core.database import engine, Base
from api.v1.api import api_router
from core.monitoring import setup_metrics

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting LuminaOps API Server...")
    
    # Create database tables (simplified for development)
    try:
        # For SQLite, we'll create tables on first request
        print("📊 Database initialization deferred to first request...")
    except Exception as e:
        print(f"⚠️ Database setup warning: {e}")
    
    # Monitoring is already setup during app creation
    
    print("✅ LuminaOps API Server started successfully!")
    yield
    
    # Shutdown
    print("⏹️ Shutting down LuminaOps API Server...")

# Create FastAPI application
app = FastAPI(
    title="LuminaOps API",
    description="Next-Generation AI/ML & Analytics Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Setup monitoring before other middleware
setup_metrics(app)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring and load balancers."""
    return {
        "status": "healthy",
        "service": "LuminaOps API",
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with basic API information."""
    return {
        "message": "Welcome to LuminaOps API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    print("🚀 Starting LuminaOps API Server...")
    print(f"📊 Environment: {settings.ENVIRONMENT}")
    print(f"🐛 Debug mode: {settings.DEBUG}")
    print("📖 API docs available at: http://localhost:8002/docs")
    print("🔍 Interactive API explorer: http://localhost:8002/redoc")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8002,
        reload=settings.DEBUG,
        lifespan="on"
    )