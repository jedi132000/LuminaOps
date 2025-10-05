#!/Users/oladimejioladipo/Lumiaops/backend/venv/bin/python
"""
LuminaOps Data Usage Demo Script

This script demonstrates how to use the sample datasets with the LuminaOps API.
Run this to test AI Assistant and AutoML features with real data.

Prerequisites:
1. Start the LuminaOps backend server with venv:
   cd /Users/oladimejioladipo/Lumiaops/backend
   PYTHONPATH=/Users/oladimejioladipo/Lumiaops/backend \
   /Users/oladimejioladipo/Lumiaops/backend/venv/bin/python \
   -m uvicorn main:app --reload --port 8000

2. Ensure datasets are in /Users/oladimejioladipo/Lumiaops/data/ directory
3. Virtual environment includes: requests, pandas, matplotlib

Usage:
    /Users/oladimejioladipo/Lumiaops/backend/venv/bin/python demo_data_usage.py [--skip-ai] [--skip-automl]
"""python3
"""
LuminaOps Data Usage Demo Script

This script demonstrates how to use all sample datasets with the LuminaOps API.
Run this to test AI Assistant and AutoML features with real data.

Prerequisites:
1. Start the LuminaOps backend server
2. Ensure datasets are in ../data/ directory
3. Install required packages: requests, pandas, matplotlib

Usage:
    python demo_data_usage.py [--skip-ai] [--skip-automl]
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path

import pandas as pd
import requests

# Configuration
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api/v1/ai"
DATA_DIR = Path("/Users/oladimejioladipo/Lumiaops/data")

class LuminaOpsDemo:
    def __init__(self):
        self.session = requests.Session()
        self.results = {}
        
    def check_server(self):
        """Check if the LuminaOps server is running"""
        try:
            response = self.session.get(f"{BASE_URL}/health", timeout=5)
            if response.status_code == 200:
                print("✅ Server is running:", response.json())
                return True
        except requests.ConnectionError:
            pass
        
        print("❌ Server not running! Please start the backend first:")
        print("   cd /Users/oladimejioladipo/Lumiaops/backend")
        print("   PYTHONPATH=/Users/oladimejioladipo/Lumiaops/backend \\")
        print("   /Users/oladimejioladipo/Lumiaops/backend/venv/bin/python \\")
        print("   -m uvicorn main:app --reload --port 8000")
        return False
    
    def load_datasets(self):
        """Load all available datasets"""
        datasets = {}
        
        # Sample dataset (simple)
        sample_path = DATA_DIR / "sample.csv"
        if sample_path.exists():
            datasets['sample'] = pd.read_csv(sample_path)
            print(f"📊 Loaded sample.csv: {datasets['sample'].shape}")
        
        # Dummy dataset (comprehensive)  
        dummy_path = DATA_DIR / "dummy.csv"
        if dummy_path.exists():
            datasets['dummy'] = pd.read_csv(dummy_path)
            print(f"📊 Loaded dummy.csv: {datasets['dummy'].shape}")
        
        # Time series dataset
        metrics_path = DATA_DIR / "model_metrics_timeseries.csv"
        if metrics_path.exists():
            datasets['metrics'] = pd.read_csv(metrics_path)
            print(f"📊 Loaded model_metrics_timeseries.csv: {datasets['metrics'].shape}")
        
        if not datasets:
            print("❌ No datasets found in", DATA_DIR)
            sys.exit(1)
            
        return datasets
    
    def test_ai_assistant(self, datasets):
        """Test AI Assistant with different prompts"""
        print("\n🤖 Testing AI Assistant...")
        
        prompts = [
            {
                "name": "Dataset Analysis",
                "prompt": f"""I have customer data with {len(datasets['sample'])} records. 
                The churn rate is {(datasets['sample']['churn'].sum() / len(datasets['sample']) * 100):.1f}%.
                Features include: age, income, purchase_amount, satisfaction_score.
                What insights can you provide about customer behavior patterns?"""
            },
            {
                "name": "ML Strategy", 
                "prompt": "What's the best approach for predicting customer churn with limited data? Should I focus on model complexity or feature engineering?"
            },
            {
                "name": "Business Impact",
                "prompt": "If my churn prediction model shows satisfaction_score as the most important feature, what specific business actions should I recommend?"
            }
        ]
        
        ai_results = {}
        for i, test in enumerate(prompts, 1):
            print(f"\n{i}. Testing: {test['name']}")
            
            try:
                response = self.session.post(
                    f"{API_BASE}/llm/generate",
                    json={
                        "prompt": test['prompt'],
                        "temperature": 0.7,
                        "max_tokens": 500
                    },
                    timeout=30
                )
                
                if response.status_code == 200:
                    result = response.json()['response']
                    ai_results[test['name']] = result
                    print(f"✅ Response length: {len(result)} characters")
                    print(f"Preview: {result[:150]}...")
                else:
                    print(f"❌ Failed: {response.status_code} - {response.text}")
                    
            except Exception as e:
                print(f"❌ Error: {e}")
        
        self.results['ai_assistant'] = ai_results
        return ai_results
    
    def test_automl_simple(self, datasets):
        """Test AutoML with simple customer data"""
        print("\n🔬 Testing AutoML - Simple Customer Churn...")
        
        df = datasets['sample']
        
        # Prepare data
        training_data = {
            "age": df['age'].tolist(),
            "income": df['income'].tolist(), 
            "purchase_amount": df['purchase_amount'].tolist(),
            "satisfaction_score": df['satisfaction_score'].tolist(),
            "churn": df['churn'].tolist()
        }
        
        request_data = {
            "request": {
                "target_column": "churn",
                "problem_type": "classification",
                "model_type": "flaml",
                "time_budget": 60,
                "test_size": 0.2
            },
            "data": training_data
        }
        
        try:
            print("🔄 Training model (60 seconds)...")
            response = self.session.post(
                f"{API_BASE}/automl/train",
                json=request_data,
                timeout=90
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Model trained successfully!")
                print(f"   Model ID: {result['model_id']}")
                print(f"   Accuracy: {result['score']:.3f}")
                print(f"   Metrics: {result['metrics']}")
                print(f"   Top Features: {dict(list(result['feature_importance'].items())[:3])}")
                
                self.results['automl_simple'] = result
                return result
                
            else:
                print(f"❌ Training failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"❌ Error: {e}")
            
        return None
    
    def test_automl_advanced(self, datasets):
        """Test AutoML with rich customer data"""
        print("\n🔬 Testing AutoML - Advanced Customer Analysis...")
        
        df = datasets['dummy']
        
        # Select key features
        features = ['age', 'income', 'satisfaction_score', 'website_visits', 
                   'customer_lifetime_value', 'marketing_spend']
        
        # Prepare data with available features
        training_data = {}
        for feature in features:
            if feature in df.columns:
                training_data[feature] = df[feature].tolist()
        training_data['churn'] = df['churn'].tolist()
        
        request_data = {
            "request": {
                "target_column": "churn", 
                "problem_type": "classification",
                "model_type": "xgboost",
                "time_budget": 120,
                "test_size": 0.25
            },
            "data": training_data
        }
        
        try:
            print("🔄 Training advanced model (120 seconds)...")
            response = self.session.post(
                f"{API_BASE}/automl/train",
                json=request_data,
                timeout=150
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Advanced model trained!")
                print(f"   Model ID: {result['model_id']}")
                print(f"   Accuracy: {result['score']:.3f}")
                print(f"   Algorithm: {result['config'].get('algorithm', 'Unknown')}")
                print(f"   Feature Importance:")
                
                # Sort and display feature importance
                importance = result['feature_importance']
                for feature, score in sorted(importance.items(), key=lambda x: x[1], reverse=True):
                    print(f"     {feature}: {score:.3f}")
                
                self.results['automl_advanced'] = result
                return result
                
            else:
                print(f"❌ Advanced training failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"❌ Error: {e}")
            
        return None
    
    def test_automl_timeseries(self, datasets):
        """Test AutoML with time series regression"""
        print("\n🔬 Testing AutoML - Time Series Regression...")
        
        df = datasets['metrics']
        
        # Pivot the time series data
        pivot_df = df.pivot_table(index='date', columns='metric_name', values='value')
        pivot_df = pivot_df.dropna().reset_index()
        
        if len(pivot_df) < 10:
            print("❌ Insufficient time series data")
            return None
        
        # Prepare regression data (predict accuracy from other metrics)
        training_data = {
            "latency": pivot_df['latency'].tolist(),
            "throughput": pivot_df['throughput'].tolist(), 
            "error_rate": pivot_df['error_rate'].tolist(),
            "accuracy": pivot_df['accuracy'].tolist()
        }
        
        request_data = {
            "request": {
                "target_column": "accuracy",
                "problem_type": "regression", 
                "model_type": "flaml",
                "time_budget": 90,
                "test_size": 0.3
            },
            "data": training_data
        }
        
        try:
            print("🔄 Training regression model (90 seconds)...")
            response = self.session.post(
                f"{API_BASE}/automl/train",
                json=request_data,
                timeout=120
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Regression model trained!")
                print(f"   Model ID: {result['model_id']}")
                print(f"   R² Score: {result['score']:.3f}")
                print(f"   Metrics: {result['metrics']}")
                print(f"   Predictive Features:")
                
                importance = result['feature_importance']
                for feature, score in sorted(importance.items(), key=lambda x: x[1], reverse=True):
                    print(f"     {feature}: {score:.3f}")
                
                self.results['automl_timeseries'] = result
                return result
                
            else:
                print(f"❌ Regression training failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"❌ Error: {e}")
            
        return None
    
    def generate_summary_report(self):
        """Generate a summary report of all tests"""
        print("\n" + "="*60)
        print("📋 LUMINAOPS DEMO SUMMARY REPORT")
        print("="*60)
        
        if 'ai_assistant' in self.results:
            print("\n🤖 AI Assistant Tests:")
            for name, result in self.results['ai_assistant'].items():
                print(f"   ✅ {name}: {len(result)} characters")
        
        print("\n🔬 AutoML Training Results:")
        
        if 'automl_simple' in self.results:
            result = self.results['automl_simple']
            print(f"   ✅ Simple Churn Model: {result['score']:.1%} accuracy")
            
        if 'automl_advanced' in self.results:
            result = self.results['automl_advanced'] 
            print(f"   ✅ Advanced Churn Model: {result['score']:.1%} accuracy")
            
        if 'automl_timeseries' in self.results:
            result = self.results['automl_timeseries']
            print(f"   ✅ Time Series Regression: {result['score']:.3f} R² score")
        
        print("\n🎯 Key Insights:")
        
        # Compare models if available
        if 'automl_simple' in self.results and 'automl_advanced' in self.results:
            simple_score = self.results['automl_simple']['score']
            advanced_score = self.results['automl_advanced']['score']
            improvement = ((advanced_score - simple_score) / simple_score) * 100
            print(f"   📈 Advanced model improved accuracy by {improvement:.1f}%")
        
        # Feature insights
        if 'automl_simple' in self.results:
            importance = self.results['automl_simple']['feature_importance']
            top_feature = max(importance.items(), key=lambda x: x[1])
            print(f"   🎯 Most important feature: {top_feature[0]} ({top_feature[1]:.3f})")
        
        print("\n✅ Demo completed successfully!")
        print("   Try the web interface at http://localhost:3000")
        print("   API documentation: /docs/API_REFERENCE.md")
        
    def save_results(self, filename="demo_results.json"):
        """Save results to JSON file"""
        output_file = Path(filename)
        with open(output_file, 'w') as f:
            json.dump(self.results, f, indent=2, default=str)
        print(f"💾 Results saved to {output_file}")

def main():
    parser = argparse.ArgumentParser(description="LuminaOps Data Usage Demo")
    parser.add_argument("--skip-ai", action="store_true", help="Skip AI Assistant tests")
    parser.add_argument("--skip-automl", action="store_true", help="Skip AutoML tests")
    parser.add_argument("--save-results", help="Save results to JSON file")
    
    args = parser.parse_args()
    
    print("🚀 LuminaOps Data Usage Demo")
    print("="*40)
    
    demo = LuminaOpsDemo()
    
    # Check server
    if not demo.check_server():
        return 1
    
    # Load datasets
    datasets = demo.load_datasets()
    
    # Run tests based on arguments
    if not args.skip_ai and 'sample' in datasets:
        demo.test_ai_assistant(datasets)
    
    if not args.skip_automl:
        if 'sample' in datasets:
            demo.test_automl_simple(datasets)
        
        if 'dummy' in datasets:
            demo.test_automl_advanced(datasets)
            
        if 'metrics' in datasets:
            demo.test_automl_timeseries(datasets)
    
    # Generate summary
    demo.generate_summary_report()
    
    # Save results if requested
    if args.save_results:
        demo.save_results(args.save_results)
    
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n⏹️ Demo interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Demo failed: {e}")
        sys.exit(1)