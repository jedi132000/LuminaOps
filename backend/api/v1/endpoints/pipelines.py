from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from api.v1.endpoints.auth import verify_token

router = APIRouter()

class PipelineCreate(BaseModel):
    name: str
    description: Optional[str] = None
    steps: List[Dict[str, Any]] = []
    schedule: Optional[str] = None  # cron expression
    tags: List[str] = []

class PipelineResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    status: str  # draft, active, paused, failed
    steps: List[Dict[str, Any]]
    schedule: Optional[str]
    tags: List[str]
    created_at: datetime
    updated_at: datetime
    created_by: str
    last_run: Optional[datetime] = None

@router.get("/", response_model=List[PipelineResponse])
async def list_pipelines(username: str = Depends(verify_token)):
    """List all ML pipelines."""
    return [
        PipelineResponse(
            id="pipeline_001",
            name="Data Processing Pipeline",
            description="ETL pipeline for customer data",
            status="active",
            steps=[
                {"type": "extract", "source": "database"},
                {"type": "transform", "operations": ["clean", "normalize"]},
                {"type": "load", "destination": "data_lake"}
            ],
            schedule="0 2 * * *",  # Daily at 2 AM
            tags=["etl", "production"],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            created_by=username,
            last_run=datetime.utcnow()
        )
    ]

@router.post("/", response_model=PipelineResponse)
async def create_pipeline(pipeline: PipelineCreate, username: str = Depends(verify_token)):
    """Create a new ML pipeline."""
    return PipelineResponse(
        id=f"pipeline_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
        name=pipeline.name,
        description=pipeline.description,
        status="draft",
        steps=pipeline.steps,
        schedule=pipeline.schedule,
        tags=pipeline.tags,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        created_by=username
    )

@router.get("/{pipeline_id}", response_model=PipelineResponse)
async def get_pipeline(pipeline_id: str, username: str = Depends(verify_token)):
    """Get a specific pipeline by ID."""
    return PipelineResponse(
        id=pipeline_id,
        name="Sample Pipeline",
        description="A sample ML pipeline",
        status="active",
        steps=[{"type": "train", "model": "linear_regression"}],
        schedule=None,
        tags=["sample"],
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        created_by=username
    )

@router.post("/{pipeline_id}/run")
async def run_pipeline(pipeline_id: str, username: str = Depends(verify_token)):
    """Trigger a pipeline run."""
    return {
        "message": f"Pipeline {pipeline_id} execution started",
        "run_id": f"run_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
        "status": "running"
    }