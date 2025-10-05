# LuminaOps AI Services API Documentation

## Base URL
```
http://localhost:8000/api/v1/ai
```

## AI Assistant Endpoints

### 1. Generate Text
Generate AI-powered text responses using multiple LLM providers.

**Endpoint:** `POST /llm/generate`

**Request Body:**
```json
{
  "prompt": "Explain machine learning in simple terms",
  "provider": "openai",
  "model_name": "gpt-4-turbo-preview",
  "temperature": 0.7,
  "max_tokens": 1000,
  "system_prompt": "You are a helpful AI assistant"
}
```

**Response:**
```json
{
  "response": "Machine learning is like teaching a computer to learn patterns...",
  "config": {
    "provider": "openai",
    "model": "gpt-4-turbo-preview",
    "temperature": 0.7
  }
}
```

**Supported Providers:**
- `openai`: GPT-4, GPT-3.5-turbo
- `anthropic`: Claude-3, Claude-2
- `huggingface`: Open-source models

### 2. Generate Code
Generate Python ML code based on task descriptions.

**Endpoint:** `POST /llm/generate-code`

**Request Body:**
```json
{
  "task_description": "Create a random forest classifier for customer churn prediction",
  "code_type": "python_ml",
  "language": "python"
}
```

## AutoML Endpoints

### 1. Train Model with JSON Data
Train AutoML models using structured JSON data.

**Endpoint:** `POST /automl/train`

**Request Body:**
```json
{
  "request": {
    "target_column": "target",
    "problem_type": "classification",
    "model_type": "flaml",
    "time_budget": 300,
    "test_size": 0.2
  },
  "data": {
    "feature1": [1.2, 2.1, 3.4, 4.2],
    "feature2": [0.8, 1.5, 2.2, 3.1],
    "target": [0, 0, 1, 1]
  }
}
```

**Response:**
```json
{
  "model_id": "model_123",
  "score": 0.95,
  "metrics": {
    "accuracy": 0.95,
    "f1_score": 0.94
  },
  "feature_importance": {
    "feature1": 0.7,
    "feature2": 0.3
  },
  "config": {
    "algorithm": "lgbm",
    "params": {...}
  }
}
```

### 2. Upload and Train
Train models by uploading CSV files.

**Endpoint:** `POST /automl/upload-and-train`

**Form Data:**
- `file`: CSV file
- `target_column`: Target column name
- `problem_type`: "classification" or "regression"  
- `model_type`: "flaml", "xgboost", "lightgbm"
- `time_budget`: Training time in seconds

## Vector Database Endpoints

### 1. Add Documents
Add documents to the vector database for semantic search.

**Endpoint:** `POST /vector-db/add-documents`

**Request Body:**
```json
[
  {
    "id": "doc1",
    "content": "Machine learning is a subset of artificial intelligence...",
    "metadata": {
      "category": "ml_basics",
      "source": "documentation"
    }
  }
]
```

### 2. Search Documents
Perform semantic search across stored documents.

**Endpoint:** `POST /vector-db/search`

**Request Body:**
```json
{
  "query": "What is supervised learning?",
  "top_k": 5
}
```

## Data Analysis Endpoints

### 1. Analyze Dataset
Get AI-powered insights from uploaded datasets.

**Endpoint:** `POST /assistant/analyze-data`

**Form Data:**
- `file`: CSV file
- `analysis_type`: "summary", "detailed", "recommendations"

### 2. Model Recommendations
Get AI recommendations for optimal ML models.

**Endpoint:** `POST /assistant/recommend-model`

**Request Body:**
```json
{
  "dataset_info": {
    "shape": [1000, 10],
    "columns": ["feature1", "feature2", "target"],
    "target_type": "categorical"
  },
  "problem_description": "Predict customer churn based on usage patterns"
}
```

## Authentication

Currently configured for development mode with authentication bypass. 
In production, add Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All endpoints return structured error responses:
```json
{
  "detail": "Error description",
  "status_code": 400
}
```

## Testing Examples

### cURL Examples

**Test AI Assistant:**
```bash
curl -X POST http://localhost:8000/api/v1/ai/llm/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain gradient descent", "temperature": 0.5}'
```

**Test AutoML:**
```bash
curl -X POST http://localhost:8000/api/v1/ai/automl/train \
  -H "Content-Type: application/json" \
  -d '{
    "request": {
      "target_column": "target",
      "problem_type": "classification",
      "model_type": "flaml"
    },
    "data": {
      "x1": [1,2,3,4], 
      "x2": [2,4,6,8], 
      "target": [0,0,1,1]
    }
  }'
```

## Status & Health Check

**Health Check:** `GET /health`
```json
{
  "status": "healthy",
  "service": "LuminaOps API",
  "version": "1.0.0"
}
```