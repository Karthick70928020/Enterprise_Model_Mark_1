#!/bin/bash

set -e

echo "🚀 Starting Project Aegis..."

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $1 is already in use. Please free the port and try again."
        exit 1
    fi
}

# Check ports
check_port 8000
check_port 8001
check_port 3000

# Start Secondary Device
echo "🔐 Starting Secondary Device..."
cd secondary_device
source venv/bin/activate
python app/main.py &
SECONDARY_PID=$!
cd ..

# Wait for secondary device to start
echo "⏳ Waiting for Secondary Device to initialize..."
sleep 5

# Start Primary Device
echo "🛡️ Starting Primary Device..."
cd primary_device
source venv/bin/activate
python app/main.py &
PRIMARY_PID=$!
cd ..

# Wait for primary device to start
echo "⏳ Waiting for Primary Device to initialize..."
sleep 5

# Start Frontend
echo "🎨 Starting Frontend Dashboard..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ All services started successfully!"
echo ""
echo "📊 Access Points:"
echo "   Frontend Dashboard: http://localhost:3000"
echo "   Primary Device API: http://localhost:8000/docs"
echo "   Secondary Device API: http://localhost:8001/docs"
echo ""
echo "🛑 Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $PRIMARY_PID $SECONDARY_PID $FRONTEND_PID 2>/dev/null || true
    echo "✅ All services stopped."
    exit 0
}

# Set trap for cleanup
trap cleanup INT TERM

# Wait for all processes
wait