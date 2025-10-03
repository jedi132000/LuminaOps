from prometheus_client import Counter, Histogram, Gauge, generate_latest
from fastapi import FastAPI
import time

# Prometheus metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status_code']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

ACTIVE_CONNECTIONS = Gauge(
    'active_connections',
    'Number of active connections'
)

ML_JOBS_TOTAL = Counter(
    'ml_jobs_total',
    'Total ML jobs',
    ['job_type', 'status']
)

MODELS_DEPLOYED = Gauge(
    'models_deployed_total',
    'Total number of deployed models'
)

def setup_metrics(app: FastAPI):
    """Setup Prometheus metrics middleware."""
    
    @app.middleware("http")
    async def metrics_middleware(request, call_next):
        start_time = time.time()
        
        # Increment active connections
        ACTIVE_CONNECTIONS.inc()
        
        try:
            response = await call_next(request)
            
            # Record metrics
            duration = time.time() - start_time
            REQUEST_DURATION.labels(
                method=request.method,
                endpoint=request.url.path
            ).observe(duration)
            
            REQUEST_COUNT.labels(
                method=request.method,
                endpoint=request.url.path,
                status_code=response.status_code
            ).inc()
            
            return response
        
        finally:
            # Decrement active connections
            ACTIVE_CONNECTIONS.dec()
    
    @app.get("/metrics")
    async def get_metrics():
        """Prometheus metrics endpoint."""
        return generate_latest()

def record_ml_job(job_type: str, status: str):
    """Record ML job metrics."""
    ML_JOBS_TOTAL.labels(job_type=job_type, status=status).inc()

def update_deployed_models_count(count: int):
    """Update deployed models count."""
    MODELS_DEPLOYED.set(count)