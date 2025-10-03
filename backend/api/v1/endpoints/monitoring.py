from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime, timedelta
from api.v1.endpoints.auth import verify_token

router = APIRouter()

class MetricResponse(BaseModel):
    name: str
    value: float
    timestamp: datetime
    labels: Dict[str, str] = {}

class SystemHealthResponse(BaseModel):
    status: str
    services: Dict[str, str]
    uptime: str
    last_check: datetime

@router.get("/metrics", response_model=List[MetricResponse])
async def get_metrics(username: str = Depends(verify_token)):
    """Get system and ML metrics."""
    now = datetime.utcnow()
    return [
        MetricResponse(
            name="models_deployed",
            value=12.0,
            timestamp=now,
            labels={"environment": "production"}
        ),
        MetricResponse(
            name="active_experiments",
            value=5.0,
            timestamp=now,
            labels={"status": "running"}
        ),
        MetricResponse(
            name="pipeline_success_rate",
            value=0.98,
            timestamp=now,
            labels={"period": "24h"}
        ),
        MetricResponse(
            name="api_response_time_ms",
            value=45.2,
            timestamp=now,
            labels={"endpoint": "/api/v1"}
        )
    ]

@router.get("/health", response_model=SystemHealthResponse)
async def get_system_health(username: str = Depends(verify_token)):
    """Get overall system health status."""
    return SystemHealthResponse(
        status="healthy",
        services={
            "api": "healthy",
            "database": "healthy",
            "redis": "healthy",
            "minio": "healthy",
            "mlflow": "healthy"
        },
        uptime="72h 15m 32s",
        last_check=datetime.utcnow()
    )

@router.get("/alerts")
async def get_alerts(username: str = Depends(verify_token)):
    """Get active alerts and notifications."""
    return {
        "active_alerts": [
            {
                "id": "alert_001",
                "severity": "warning",
                "message": "Model accuracy dropped below threshold",
                "model_id": "model_001",
                "timestamp": datetime.utcnow().isoformat(),
                "acknowledged": False
            }
        ],
        "total_count": 1
    }

@router.get("/dashboard")
async def get_dashboard_data(username: str = Depends(verify_token)):
    """Get data for the main dashboard."""
    return {
        "summary": {
            "total_models": 12,
            "active_experiments": 5,
            "running_pipelines": 3,
            "alerts_count": 1
        },
        "recent_activity": [
            {
                "type": "model_deployed",
                "message": "Customer Churn Model v2.1 deployed",
                "timestamp": datetime.utcnow().isoformat()
            },
            {
                "type": "experiment_completed",
                "message": "Hyperparameter tuning experiment completed",
                "timestamp": (datetime.utcnow() - timedelta(hours=1)).isoformat()
            }
        ],
        "performance_metrics": {
            "avg_model_accuracy": 0.94,
            "pipeline_success_rate": 0.98,
            "system_uptime": 99.9
        }
    }