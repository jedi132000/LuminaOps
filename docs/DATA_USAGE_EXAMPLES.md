# 📊 LuminaOps Data Usage Examples

This guide provides step-by-step examples of how to use the sample datasets included in the LuminaOps repository with both the AI Assistant and AutoML Training features.

## 📁 Available Sample Datasets

### 1. `data/sample.csv` - Simple Customer Data (20 records)
**Use Case**: Quick testing and experimentation  
**Features**: `age`, `income`, `purchase_amount`, `satisfaction_score`  
**Target**: `churn` (0 = retained, 1 = churned)

### 2. `data/dummy.csv` - Rich Customer Dataset (50+ records)
**Use Case**: Comprehensive ML training with multiple features  
**Features**: Demographics, transaction history, behavioral data (20 columns)  
**Target**: `churn` (customer retention prediction)

### 3. `data/model_metrics_timeseries.csv` - Model Performance Data (80 records)
**Use Case**: Time series analysis and model monitoring  
**Features**: `accuracy`, `latency`, `throughput`, `error_rate` over time  
**Target**: Performance prediction and anomaly detection

---

## 🚀 Getting Started

### Step 1: Start the LuminaOps Backend
```bash
cd /Users/oladimejioladipo/Lumiaops/backend
PYTHONPATH=/Users/oladimejioladipo/Lumiaops/backend \
/Users/oladimejioladipo/Lumiaops/backend/venv/bin/python \
-m uvicorn main:app --reload --port 8000
```

### Step 2: Verify Backend is Running
```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy","service":"LuminaOps API","version":"1.0.0"}
```

---

## 🤖 AI Assistant Examples

### Example 1: Analyze Customer Dataset Structure
**Prompt for AI Assistant:**
```
"I have a customer dataset with the following columns: id, age, income, purchase_amount, satisfaction_score, churn. The churn column is binary (0=retained, 1=churned). Can you explain what insights I can derive from this data and suggest ML approaches?"
```

**cURL Command:**
```bash
curl -X POST http://localhost:8000/api/v1/ai/llm/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "I have a customer dataset with columns: age, income, purchase_amount, satisfaction_score, churn (0=retained, 1=churned). What insights can I derive and what ML approaches work best?",
    "temperature": 0.7
  }'
```

### Example 2: Get Feature Engineering Suggestions
**Prompt:**
```
"For customer churn prediction with features like age, income, purchase_amount, and satisfaction_score, what feature engineering techniques would improve model performance?"
```

### Example 3: Ask About Model Interpretation
**Prompt:**
```
"How can I interpret the results of a customer churn model? What metrics should I focus on and how do I explain the predictions to business stakeholders?"
```

---

## 🔬 AutoML Training Examples

### Example 1: Simple Customer Churn Prediction (sample.csv)

#### Using the Web Interface:
1. Navigate to **AutoML Training** page
2. Upload `data/sample.csv`
3. Configure:
   - **Target Column**: `churn`
   - **Problem Type**: `classification`
   - **AutoML Engine**: `flaml`
   - **Time Budget**: `60` seconds
4. Click **Start AutoML Training**

#### Using API (JSON Format):
```bash
curl -X POST http://localhost:8000/api/v1/ai/automl/train \
  -H "Content-Type: application/json" \
  -d '{
    "request": {
      "target_column": "churn",
      "problem_type": "classification",
      "model_type": "flaml",
      "time_budget": 60,
      "test_size": 0.2
    },
    "data": {
      "age": [32, 45, 28, 38, 29, 55, 26, 41, 34, 31],
      "income": [65000, 85000, 52000, 72000, 58000, 95000, 48000, 78000, 62000, 69000],
      "purchase_amount": [1250.50, 2100.75, 680.25, 1850.00, 420.80, 280.50, 350.75, 1950.25, 890.40, 1200.30],
      "satisfaction_score": [4.2, 4.8, 3.9, 4.5, 4.1, 4.7, 3.5, 4.6, 4.0, 4.3],
      "churn": [0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
    }
  }'
```

**Expected Response:**
```json
{
  "model_id": "model_001",
  "score": 0.85,
  "metrics": {
    "accuracy": 0.85,
    "f1_score": 0.72
  },
  "feature_importance": {
    "satisfaction_score": 0.45,
    "purchase_amount": 0.30,
    "income": 0.15,
    "age": 0.10
  },
  "config": {
    "algorithm": "lgbm",
    "params": {...}
  }
}
```

### Example 2: Rich Customer Analysis (dummy.csv)

#### High-Performance Training Configuration:
```bash
curl -X POST http://localhost:8000/api/v1/ai/automl/upload-and-train \
  -F "file=@/Users/oladimejioladipo/Lumiaops/data/dummy.csv" \
  -F "target_column=churn" \
  -F "problem_type=classification" \
  -F "model_type=flaml" \
  -F "time_budget=300"
```

#### JSON API Format (Using Top Features):
```bash
curl -X POST http://localhost:8000/api/v1/ai/automl/train \
  -H "Content-Type: application/json" \
  -d '{
    "request": {
      "target_column": "churn",
      "problem_type": "classification", 
      "model_type": "xgboost",
      "time_budget": 180
    },
    "data": {
      "age": [32, 45, 28, 38, 29, 55, 26, 41, 34],
      "income": [65000, 85000, 52000, 72000, 58000, 95000, 48000, 78000, 62000],
      "satisfaction_score": [4.2, 4.8, 3.9, 4.5, 4.1, 4.7, 3.5, 4.6, 4.0],
      "website_visits": [12, 18, 9, 15, 7, 5, 6, 16, 10],
      "customer_lifetime_value": [5200.75, 8900.25, 3200.50, 7200.00, 2800.60, 4500.25, 1800.30, 8100.40, 4200.80],
      "churn": [0, 0, 0, 0, 0, 0, 1, 0, 0]
    }
  }'
```

### Example 3: Time Series Regression (model_metrics_timeseries.csv)

#### Predict Model Accuracy Over Time:
```bash
# First, transform the time series data into a suitable format
curl -X POST http://localhost:8000/api/v1/ai/automl/train \
  -H "Content-Type: application/json" \
  -d '{
    "request": {
      "target_column": "accuracy",
      "problem_type": "regression",
      "model_type": "flaml",
      "time_budget": 120
    },
    "data": {
      "day": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      "latency": [45.2, 43.8, 47.1, 44.5, 46.3, 42.9, 48.7, 45.6, 44.2, 46.8],
      "throughput": [850, 865, 840, 875, 860, 890, 835, 870, 880, 855],
      "error_rate": [0.023, 0.021, 0.025, 0.020, 0.024, 0.018, 0.027, 0.022, 0.019, 0.025],
      "accuracy": [0.942, 0.945, 0.939, 0.948, 0.941, 0.952, 0.936, 0.944, 0.950, 0.940]
    }
  }'
```

---

## 🎯 Complete Workflow Examples

### Workflow 1: Customer Churn Analysis Pipeline

#### Step 1: Ask AI Assistant for Guidance
```bash
curl -X POST http://localhost:8000/api/v1/ai/llm/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "I want to build a customer churn prediction model. I have customer data including age, income, purchase behavior, and satisfaction scores. What should be my step-by-step approach?",
    "temperature": 0.5
  }'
```

#### Step 2: Train AutoML Model
```bash
curl -X POST http://localhost:8000/api/v1/ai/automl/upload-and-train \
  -F "file=@/Users/oladimejioladipo/Lumiaops/data/sample.csv" \
  -F "target_column=churn" \
  -F "problem_type=classification" \
  -F "model_type=flaml" \
  -F "time_budget=120"
```

#### Step 3: Get Model Interpretation Advice
```bash
curl -X POST http://localhost:8000/api/v1/ai/llm/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "My churn model achieved 85% accuracy. The most important features are satisfaction_score (0.45), purchase_amount (0.30), income (0.15), and age (0.10). How do I interpret these results and what actions should the business take?",
    "temperature": 0.6
  }'
```

### Workflow 2: Model Performance Monitoring

#### Step 1: Train Performance Prediction Model
```bash
curl -X POST http://localhost:8000/api/v1/ai/automl/upload-and-train \
  -F "file=@/Users/oladimejioladipo/Lumiaops/data/model_metrics_timeseries.csv" \
  -F "target_column=accuracy" \
  -F "problem_type=regression" \
  -F "model_type=xgboost" \
  -F "time_budget=180"
```

#### Step 2: Ask for Monitoring Strategy
```bash
curl -X POST http://localhost:8000/api/v1/ai/llm/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "I have a model monitoring dataset with accuracy, latency, throughput, and error_rate metrics over time. How can I detect when my model performance is degrading and set up alerts?",
    "temperature": 0.4
  }'
```

---

## 🎨 Frontend Usage Examples

### Using the Web Interface

#### 1. AI Assistant Chat Examples:
Navigate to **AI Assistant** → **Text Generation**

**Example Prompts:**
- "Explain the difference between precision and recall in the context of churn prediction"
- "What preprocessing steps should I apply to customer data before training?"
- "How do I handle class imbalance in churn prediction?"
- "Generate Python code to visualize customer segmentation"

#### 2. AutoML Training Examples:
Navigate to **AutoML Training**

**Quick Start with sample.csv:**
1. Upload `data/sample.csv`
2. Set Target Column: `churn`
3. Problem Type: `Classification`
4. Engine: `FLAML`
5. Time Budget: `60 seconds`
6. Click **Start AutoML Training**

**Advanced with dummy.csv:**
1. Upload `data/dummy.csv`  
2. Set Target Column: `churn`
3. Problem Type: `Classification`
4. Engine: `FLAML`
5. Time Budget: `300 seconds`
6. Monitor training progress and results

---

## 🔍 Expected Results & Insights

### Sample.csv Results:
- **Expected Accuracy**: 70-90% (small dataset)
- **Key Insights**: Satisfaction score most predictive of churn
- **Business Impact**: Focus on improving customer satisfaction

### Dummy.csv Results:
- **Expected Accuracy**: 85-95% (richer features)
- **Key Features**: Website visits, lifetime value, satisfaction
- **Recommendations**: Multi-channel engagement strategy

### Model Metrics Results:
- **Prediction Target**: Model accuracy trends
- **Use Case**: Proactive model maintenance
- **Alerts**: When accuracy drops below threshold

---

## 🚀 Advanced Usage Patterns

### 1. Ensemble Model Comparison
Train the same dataset with different engines:
```bash
# FLAML
curl -X POST http://localhost:8000/api/v1/ai/automl/train \
  -H "Content-Type: application/json" \
  -d '{"request": {"target_column": "churn", "model_type": "flaml"}, "data": {...}}'

# XGBoost  
curl -X POST http://localhost:8000/api/v1/ai/automl/train \
  -H "Content-Type: application/json" \
  -d '{"request": {"target_column": "churn", "model_type": "xgboost"}, "data": {...}}'
```

### 2. A/B Testing Model Variants
Compare different feature sets and time budgets to optimize performance.

### 3. Continuous Learning Pipeline
Use the time series data to simulate model decay and retraining scenarios.

---

## 🎯 Pro Tips

1. **Start Small**: Use `sample.csv` for initial testing
2. **Feature Selection**: Focus on high-importance features from results
3. **Time Budget**: Start with 60s, increase for better models
4. **Validation**: Always check model performance on business metrics
5. **Interpretation**: Use AI Assistant to explain model results
6. **Monitoring**: Set up alerts based on model performance trends

---

## 🛠️ Troubleshooting

### Common Issues:
- **Server Not Running**: Check if backend is started on port 8000
- **File Upload Errors**: Ensure CSV files have proper headers
- **Low Accuracy**: Try different engines or increase time budget
- **API Errors**: Check request format matches examples above

### Support Commands:
```bash
# Check server status
curl http://localhost:8000/health

# List trained models
curl http://localhost:8000/api/v1/ai/automl/models

# Test AI assistant
curl -X POST http://localhost:8000/api/v1/ai/llm/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, test message"}'
```

This guide provides comprehensive examples for utilizing all available datasets with the LuminaOps AI platform. Each example includes both API commands and expected outcomes to help you get started quickly! 🚀