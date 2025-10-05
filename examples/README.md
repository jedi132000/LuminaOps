# 📊 LuminaOps Data Usage Examples

This directory contains comprehensive examples demonstrating how to use the sample datasets with the LuminaOps AI platform.

## 📁 Available Examples

### 📚 Documentation
- **[DATA_USAGE_EXAMPLES.md](../docs/DATA_USAGE_EXAMPLES.md)** - Complete guide with step-by-step examples
- **[API_REFERENCE.md](../docs/API_REFERENCE.md)** - Full API documentation

### 💻 Interactive Examples
- **[Interactive_Data_Examples.ipynb](Interactive_Data_Examples.ipynb)** - Jupyter notebook with live examples
- **[demo_data_usage.py](demo_data_usage.py)** - Python script to test all features
- **[demo_web_interface.html](demo_web_interface.html)** - Web-based demo interface

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
cd ../backend
PYTHONPATH=. python -m uvicorn main:app --port 8000
```

### 2. Choose Your Demo Method

#### Option A: Web Interface (Easiest)
```bash
# Open in browser
open demo_web_interface.html
```

#### Option B: Python Script
```bash
# Install dependencies
pip install requests pandas matplotlib

# Run demo
python demo_data_usage.py
```

#### Option C: Jupyter Notebook
```bash
# Install jupyter
pip install jupyter matplotlib seaborn

# Start notebook
jupyter notebook Interactive_Data_Examples.ipynb
```

## 📊 Sample Datasets

### 1. `../data/sample.csv` - Simple Customer Data
- **Records**: 20 customers
- **Features**: age, income, purchase_amount, satisfaction_score
- **Target**: churn (0=retained, 1=churned)
- **Use Case**: Quick testing and basic churn prediction

### 2. `../data/dummy.csv` - Rich Customer Dataset
- **Records**: 50+ customers with comprehensive data
- **Features**: Demographics, behavior, transactions (20 columns)
- **Target**: churn prediction with advanced features
- **Use Case**: Production-grade model training

### 3. `../data/model_metrics_timeseries.csv` - Model Performance
- **Records**: 80+ time series measurements
- **Metrics**: accuracy, latency, throughput, error_rate over time
- **Use Case**: Model monitoring and performance prediction

## 🎯 Example Workflows

### Workflow 1: Customer Churn Analysis
1. **AI Assistant**: Ask about churn prediction strategies
2. **Simple AutoML**: Train basic model with `sample.csv`
3. **Advanced AutoML**: Train enhanced model with `dummy.csv`
4. **Compare Results**: Analyze performance improvements

### Workflow 2: Model Monitoring
1. **Load Time Series**: Use `model_metrics_timeseries.csv`
2. **Train Regression**: Predict accuracy from performance metrics
3. **AI Insights**: Get recommendations for monitoring strategy
4. **Set Alerts**: Implement proactive model maintenance

### Workflow 3: Feature Engineering
1. **Analyze Correlations**: Identify important features
2. **Ask AI**: Get feature engineering suggestions
3. **Test Variants**: Compare different feature sets
4. **Optimize**: Iterate based on results

## 📋 Expected Results

### AI Assistant Examples
```json
{
  "response": "Based on your customer data analysis...",
  "insights": "Focus on satisfaction scores for churn prevention",
  "recommendations": "Implement customer success programs"
}
```

### AutoML Training Results
```json
{
  "model_id": "model_123",
  "score": 0.85,
  "metrics": {"accuracy": 0.85, "f1_score": 0.72},
  "feature_importance": {
    "satisfaction_score": 0.45,
    "purchase_amount": 0.30,
    "income": 0.15,
    "age": 0.10
  }
}
```

## 🔧 Configuration Options

### AI Assistant Parameters
```python
{
    "prompt": "Your question here",
    "provider": "openai",  # or "anthropic", "huggingface"
    "temperature": 0.7,    # 0.0-1.0, creativity level
    "max_tokens": 500      # Response length limit
}
```

### AutoML Training Options
```python
{
    "target_column": "churn",
    "problem_type": "classification",  # or "regression"
    "model_type": "flaml",            # or "xgboost"
    "time_budget": 120,               # seconds
    "test_size": 0.2                  # validation split
}
```

## 🛠️ Troubleshooting

### Common Issues

#### Server Connection Error
```bash
# Check if backend is running
curl http://localhost:8000/health

# Start backend if needed
cd ../backend && python -m uvicorn main:app --port 8000
```

#### File Not Found Error
```bash
# Ensure you're in the examples directory
pwd
# Should show: .../LuminaOps/examples

# Check data files exist
ls ../data/
# Should show: dummy.csv, sample.csv, model_metrics_timeseries.csv
```

#### API Key Configuration
```bash
# Check if OpenAI API key is configured
grep OPENAI_API_KEY ../backend/.env

# If missing, add to backend/.env:
# OPENAI_API_KEY=your_api_key_here
```

### Performance Tips

1. **Start Small**: Use `sample.csv` for initial testing
2. **Increase Time Budget**: Allow more time for complex models
3. **Feature Selection**: Focus on high-importance features
4. **Model Comparison**: Test different algorithms
5. **Batch Processing**: Run multiple experiments together

## 📈 Next Steps

### Production Deployment
1. Enable authentication in API endpoints
2. Configure production database (PostgreSQL)
3. Set up monitoring and logging
4. Implement model serving infrastructure
5. Add CI/CD pipeline

### Advanced Features
1. Custom model deployments
2. Real-time inference endpoints
3. A/B testing frameworks
4. Model explainability tools
5. Data drift monitoring

### Integration Examples
1. Connect to external data sources
2. Integrate with business intelligence tools
3. Set up automated retraining pipelines
4. Build custom dashboards
5. Implement MLOps workflows

## 🎨 Customization

### Adding Your Own Data
1. Prepare CSV with proper headers
2. Ensure target column is clearly defined
3. Handle missing values appropriately
4. Test with small samples first

### Custom AI Prompts
1. Be specific about your domain
2. Include relevant context
3. Ask for actionable insights
4. Request code examples when needed

### Model Optimization
1. Experiment with different algorithms
2. Tune hyperparameters
3. Try feature engineering
4. Validate with business metrics

---

**Happy Learning with LuminaOps! 🚀**

For more information, see the main [README.md](../README.md) and [API documentation](../docs/API_REFERENCE.md).