#!/Users/oladimejioladipo/Lumiaops/backend/venv/bin/python
"""
Quick test script to verify LuminaOps data usage examples work
"""

import sys
import requests
from pathlib import Path

def test_server():
    """Test if server is running"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Server is running:", response.json())
            return True
    except requests.ConnectionError:
        pass
    
    print("❌ Server not running!")
    print("Start with:")
    print("cd /Users/oladimejioladipo/Lumiaops/backend")
    print("PYTHONPATH=/Users/oladimejioladipo/Lumiaops/backend \\")
    print("/Users/oladimejioladipo/Lumiaops/backend/venv/bin/python \\")
    print("-m uvicorn main:app --reload --port 8000")
    return False

def test_data_files():
    """Test if data files exist"""
    data_dir = Path("/Users/oladimejioladipo/Lumiaops/data")
    files = ["sample.csv", "dummy.csv", "model_metrics_timeseries.csv"]
    
    missing = []
    for file in files:
        file_path = data_dir / file
        if file_path.exists():
            print(f"✅ Found {file}")
        else:
            print(f"❌ Missing {file}")
            missing.append(file)
    
    return len(missing) == 0

def test_ai_assistant():
    """Test AI Assistant"""
    try:
        response = requests.post(
            "http://localhost:8000/api/v1/ai/llm/generate",
            json={"prompt": "What is customer churn?", "temperature": 0.7},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ AI Assistant working")
            print(f"   Response length: {len(result['response'])} characters")
            return True
        else:
            print(f"❌ AI Assistant failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ AI Assistant error: {e}")
        return False

def test_automl_simple():
    """Test simple AutoML"""
    try:
        data = {
            "request": {
                "target_column": "churn",
                "problem_type": "classification",
                "model_type": "flaml",
                "time_budget": 30
            },
            "data": {
                "age": [32, 45, 28, 38],
                "income": [65000, 85000, 52000, 72000],
                "churn": [0, 0, 1, 0]
            }
        }
        
        response = requests.post(
            "http://localhost:8000/api/v1/ai/automl/train",
            json=data,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ AutoML working")
            print(f"   Model accuracy: {result['score']:.3f}")
            return True
        else:
            print(f"❌ AutoML failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ AutoML error: {e}")
        return False

def main():
    print("🔍 LuminaOps Quick Test")
    print("=" * 30)
    
    # Test components
    server_ok = test_server()
    if not server_ok:
        return 1
    
    print()
    data_ok = test_data_files()
    
    print()
    ai_ok = test_ai_assistant()
    
    print()
    automl_ok = test_automl_simple()
    
    print("\n" + "=" * 30)
    print("📋 Test Results:")
    print(f"   Server: {'✅' if server_ok else '❌'}")
    print(f"   Data Files: {'✅' if data_ok else '❌'}")  
    print(f"   AI Assistant: {'✅' if ai_ok else '❌'}")
    print(f"   AutoML: {'✅' if automl_ok else '❌'}")
    
    if all([server_ok, data_ok, ai_ok, automl_ok]):
        print("\n🎉 All tests passed! LuminaOps is ready to use.")
        print("   Try the full demo: ./demo_data_usage.py")
        print("   Or open: ./demo_web_interface.html")
        return 0
    else:
        print("\n⚠️ Some tests failed. Check the output above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())