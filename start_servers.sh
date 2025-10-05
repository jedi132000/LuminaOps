#!/bin/bash

# LuminaOps Startup Script
echo "🚀 Starting LuminaOps Application..."

# Kill existing processes
echo "🔄 Cleaning up existing processes..."
lsof -ti:8002 | xargs kill -9 2>/dev/null || echo "Port 8002 is free"
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "Port 3000 is free"
pkill -f "npm run dev" || true
sleep 2

# Start Backend
echo "🐍 Starting Backend Server..."
cd /Users/oladimejioladipo/Lumiaops/backend
PYTHONPATH=/Users/oladimejioladipo/Lumiaops/backend /Users/oladimejioladipo/Lumiaops/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8002 &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Test backend
echo "🧪 Testing Backend..."
if curl -s http://localhost:8002/health | grep -q "healthy"; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Start Frontend
echo "⚛️  Starting Frontend Server..."
cd /Users/oladimejioladipo/Lumiaops/frontend
/opt/homebrew/bin/npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

# Test frontend
echo "🧪 Testing Frontend..."
if curl -s -I http://localhost:3000/ | grep -q "200 OK"; then
    echo "✅ Frontend is serving content"
else
    echo "⚠️  Frontend may need manual verification"
fi

echo ""
echo "🎉 LuminaOps Application Started Successfully!"
echo "📊 Backend API: http://localhost:8002"
echo "📖 API Docs: http://localhost:8002/docs"
echo "⚛️  Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Keep script running
wait $BACKEND_PID $FRONTEND_PID