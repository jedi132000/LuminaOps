from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
from io import StringIO
# Temporarily disabled for development: from api.v1.endpoints.auth import verify_token
from ai_services.llm.llm_service import llm_service, code_service, LLMConfig, LLMProvider
from ai_services.vector_db.vector_service import vector_db_service, Document
from ai_services.automl.automl_service import automl_service, AutoMLConfig, ProblemType, ModelType

router = APIRouter()

def convert_numpy_types(obj):
    """Convert numpy types to native Python types for JSON serialization"""
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [convert_numpy_types(item) for item in obj]
    else:
        return obj

# LLM Endpoints
class LLMRequest(BaseModel):
    prompt: str
    provider: Optional[str] = "openai"
    model_name: Optional[str] = "gpt-4-turbo-preview"
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1000
    system_prompt: Optional[str] = None

class CodeGenerationRequest(BaseModel):
    task_description: str
    code_type: Optional[str] = "python_ml"
    language: Optional[str] = "python"

@router.post("/llm/generate")
async def generate_text(request: LLMRequest):
    """Generate text using LLM"""
    try:
        config = LLMConfig(
            provider=LLMProvider(request.provider),
            model_name=request.model_name,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        
        response = await llm_service.generate_text(
            request.prompt,
            config,
            request.system_prompt
        )
        
        return {
            "response": response,
            "config": {
                "provider": request.provider,
                "model": request.model_name,
                "temperature": request.temperature
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text generation failed: {str(e)}")

@router.post("/llm/generate-code")
async def generate_code(request: CodeGenerationRequest):
    """Generate code using AI"""
    try:
        code = await code_service.generate_code(
            request.task_description,
            request.code_type,
            request.language
        )
        
        return {
            "code": code,
            "task_description": request.task_description,
            "code_type": request.code_type,
            "language": request.language
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code generation failed: {str(e)}")

@router.post("/llm/explain-code")
async def explain_code(code: str):
    """Explain code using AI"""
    try:
        explanation = await code_service.explain_code(code)
        
        return {
            "explanation": explanation,
            "code": code
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code explanation failed: {str(e)}")

# Vector Database Endpoints
class DocumentRequest(BaseModel):
    id: str
    content: str
    metadata: Dict[str, Any] = {}

class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 10

@router.post("/vector-db/add-documents")
async def add_documents(documents: List[DocumentRequest]):
    """Add documents to vector database"""
    try:
        # Initialize vector DB if not already done
        if not hasattr(vector_db_service, 'db_service') or not vector_db_service.db_service:
            await vector_db_service.initialize()
        
        docs = [Document(id=doc.id, content=doc.content, metadata=doc.metadata) for doc in documents]
        success = await vector_db_service.add_documents(docs)
        
        return {
            "success": success,
            "message": f"Added {len(documents)} documents",
            "document_ids": [doc.id for doc in documents]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add documents: {str(e)}")

@router.post("/vector-db/search")
async def search_documents(request: SearchRequest):
    """Search documents in vector database"""
    try:
        # Initialize vector DB if not already done
        if not hasattr(vector_db_service, 'db_service') or not vector_db_service.db_service:
            await vector_db_service.initialize()
        
        results = await vector_db_service.search(request.query, request.top_k)
        
        return {
            "query": request.query,
            "results": [
                {
                    "id": result.document.id,
                    "content": result.document.content,
                    "metadata": result.document.metadata,
                    "score": result.score,
                    "distance": result.distance
                }
                for result in results
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

# AutoML Endpoints
class AutoMLTrainRequest(BaseModel):
    target_column: str
    problem_type: str  # classification, regression
    model_type: Optional[str] = "flaml"
    time_budget: Optional[int] = 300
    test_size: Optional[float] = 0.2
    model_id: Optional[str] = None

@router.post("/automl/upload-and-train")
async def upload_and_train_automl(
    file: UploadFile = File(...),
    target_column: str = "target",
    problem_type: str = "classification",
    model_type: str = "flaml",
    time_budget: int = 300
):
    """Upload dataset and train AutoML model"""
    try:
        # Read uploaded CSV file
        content = await file.read()
        df = pd.read_csv(StringIO(content.decode('utf-8')))
        
        # Validate target column exists
        if target_column not in df.columns:
            raise HTTPException(
                status_code=400, 
                detail=f"Target column '{target_column}' not found in dataset"
            )
        
        # Create AutoML config
        config = AutoMLConfig(
            problem_type=ProblemType(problem_type),
            model_type=ModelType(model_type),
            time_budget=time_budget
        )
        
        # Train model
        result = await automl_service.train_automl(df, target_column, config)
        
        # Convert numpy types to Python types for JSON serialization
        response = {
            "model_id": len(automl_service.models),
            "score": result.score,
            "metrics": result.metrics,
            "feature_importance": result.feature_importance,
            "config": result.config,
            "dataset_info": {
                "shape": df.shape,
                "columns": df.columns.tolist(),
                "target_column": target_column
            }
        }
        
        return convert_numpy_types(response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AutoML training failed: {str(e)}")

@router.post("/automl/train")
async def train_automl_model(
    request: AutoMLTrainRequest,
    data: Dict[str, Any]  # JSON data
):
    """Train AutoML model with JSON data"""
    try:
        # Convert JSON to DataFrame
        df = pd.DataFrame(data)
        
        # Validate target column
        if request.target_column not in df.columns:
            raise HTTPException(
                status_code=400,
                detail=f"Target column '{request.target_column}' not found"
            )
        
        # Create config
        config = AutoMLConfig(
            problem_type=ProblemType(request.problem_type),
            model_type=ModelType(request.model_type or "flaml"),
            time_budget=request.time_budget or 300,
            test_size=request.test_size or 0.2
        )
        
        # Train model
        result = await automl_service.train_automl(
            df, 
            request.target_column, 
            config,
            request.model_id
        )
        
        model_id = request.model_id or len(automl_service.models)
        
        # Convert numpy types to Python types for JSON serialization
        response = {
            "model_id": model_id,
            "score": result.score,
            "metrics": result.metrics,
            "feature_importance": result.feature_importance,
            "config": result.config
        }
        
        return convert_numpy_types(response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AutoML training failed: {str(e)}")

@router.get("/automl/models")
async def list_automl_models():
    """List all trained AutoML models"""
    try:
        models = []
        for model_id in automl_service.results.keys():
            model_info = await automl_service.get_model_info(model_id)
            models.append(model_info)
        
        return {"models": models}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list models: {str(e)}")

@router.get("/automl/models/{model_id}")
async def get_automl_model(model_id: str):
    """Get information about a specific AutoML model"""
    try:
        model_info = await automl_service.get_model_info(model_id)
        return model_info
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Model not found: {str(e)}")

@router.post("/automl/predict/{model_id}")
async def predict_automl(
    model_id: str,
    data: List[Dict[str, Any]]
):
    """Make predictions using trained AutoML model"""
    try:
        # Convert data to DataFrame
        df = pd.DataFrame(data)
        
        # Make predictions
        predictions = await automl_service.predict(model_id, df)
        
        return {
            "model_id": model_id,
            "predictions": predictions.tolist(),
            "input_shape": df.shape
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# AI Assistant Endpoints
@router.post("/assistant/analyze-data")
async def analyze_data_with_ai(
    file: UploadFile = File(...),
    analysis_type: str = "summary"
):
    """Analyze uploaded dataset using AI"""
    try:
        # Read uploaded file
        content = await file.read()
        df = pd.read_csv(StringIO(content.decode('utf-8')))
        
        # Generate data analysis prompt
        data_info = {
            "shape": df.shape,
            "columns": df.columns.tolist(),
            "dtypes": df.dtypes.to_dict(),
            "null_counts": df.isnull().sum().to_dict(),
            "sample_data": df.head().to_dict()
        }
        
        prompt = f"""
Analyze this dataset and provide insights:

Dataset Info:
- Shape: {data_info['shape']}
- Columns: {data_info['columns']}
- Data types: {data_info['dtypes']}
- Missing values: {data_info['null_counts']}

Sample data:
{data_info['sample_data']}

Please provide:
1. Dataset overview and summary
2. Data quality assessment
3. Potential ML use cases
4. Recommended preprocessing steps
5. Feature engineering suggestions
"""
        
        analysis = await llm_service.generate_text(
            prompt,
            system_prompt="You are a data scientist analyzing datasets. Provide detailed, actionable insights."
        )
        
        return {
            "analysis": analysis,
            "dataset_info": data_info,
            "analysis_type": analysis_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data analysis failed: {str(e)}")

@router.post("/assistant/recommend-model")
async def recommend_model(
    dataset_info: Dict[str, Any],
    problem_description: str
):
    """Get AI recommendations for ML model selection"""
    try:
        prompt = f"""
Based on the following dataset and problem description, recommend the best ML approaches:

Dataset Information:
{dataset_info}

Problem Description:
{problem_description}

Please provide:
1. Problem type classification (classification, regression, clustering, etc.)
2. Recommended algorithms with rationale
3. Expected challenges and solutions
4. Performance metrics to focus on
5. Feature engineering recommendations
6. Deployment considerations
"""
        
        recommendation = await llm_service.generate_text(
            prompt,
            system_prompt="You are an ML expert providing model recommendations. Be specific and practical."
        )
        
        return {
            "recommendation": recommendation,
            "dataset_info": dataset_info,
            "problem_description": problem_description
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model recommendation failed: {str(e)}")