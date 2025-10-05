#!/bin/bash
"""
LuminaOps Startup Script
Starts the backend server with proper virtual environment configuration
"""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project paths
BACKEND_DIR="/Users/oladimejioladipo/Lumiaops/backend"
VENV_PYTHON="/Users/oladimejioladipo/Lumiaops/backend/venv/bin/python"
EXAMPLES_DIR="/Users/oladimejioladipo/Lumiaops/examples"

echo -e "${BLUE}🚀 LuminaOps Startup Script${NC}"
echo -e "${BLUE}================================${NC}"

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Backend directory not found: $BACKEND_DIR${NC}"
    exit 1
fi

# Check if virtual environment exists
if [ ! -f "$VENV_PYTHON" ]; then
    echo -e "${RED}❌ Virtual environment not found: $VENV_PYTHON${NC}"
    exit 1
fi

# Check if server is already running
if curl -s http://localhost:8000/health >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️ Server already running on port 8000${NC}"
    echo -e "${GREEN}✅ LuminaOps is ready!${NC}"
    echo ""
    echo -e "${BLUE}📋 Available Examples:${NC}"
    echo -e "   • Quick Test: ${EXAMPLES_DIR}/quick_test.py"
    echo -e "   • Full Demo: ${EXAMPLES_DIR}/demo_data_usage.py"  
    echo -e "   • Web Demo: open ${EXAMPLES_DIR}/demo_web_interface.html"
    echo -e "   • Jupyter: ${EXAMPLES_DIR}/Interactive_Data_Examples.ipynb"
    exit 0
fi

echo -e "${YELLOW}📋 Starting LuminaOps Backend...${NC}"
echo -e "   Backend Dir: $BACKEND_DIR"
echo -e "   Python: $VENV_PYTHON"
echo -e "   Port: 8000"
echo ""

# Change to backend directory
cd "$BACKEND_DIR" || exit 1

# Start the server with proper configuration
echo -e "${BLUE}🔄 Starting uvicorn server...${NC}"
PYTHONPATH="$BACKEND_DIR" "$VENV_PYTHON" -m uvicorn main:app --reload --port 8000 &

# Get the process ID
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Check if server started successfully
if curl -s http://localhost:8000/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Server started successfully!${NC}"
    echo -e "   PID: $SERVER_PID"
    echo -e "   URL: http://localhost:8000"
    echo -e "   Health: http://localhost:8000/health"
    echo ""
    echo -e "${BLUE}📋 Available Examples:${NC}"
    echo -e "   • Quick Test: $VENV_PYTHON ${EXAMPLES_DIR}/quick_test.py"
    echo -e "   • Full Demo: $VENV_PYTHON ${EXAMPLES_DIR}/demo_data_usage.py"
    echo -e "   • Web Demo: open ${EXAMPLES_DIR}/demo_web_interface.html"
    echo ""
    echo -e "${YELLOW}💡 To stop the server: kill $SERVER_PID${NC}"
    echo -e "${YELLOW}💡 Or use Ctrl+C if running in foreground${NC}"
else
    echo -e "${RED}❌ Server failed to start${NC}"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi