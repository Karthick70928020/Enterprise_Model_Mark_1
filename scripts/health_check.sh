#!/bin/bash

echo "🔍 Project Aegis Health Check"

check_service() {
    local name=$1
    local url=$2
    
    if curl -s --head --request GET $url | grep "200 OK" > /dev/null; then
        echo "✅ $name: Healthy"
        return 0
    else
        echo "❌ $name: Unhealthy"
        return 1
    fi
}

echo ""
echo "Checking services..."

# Check Primary Device
check_service "Primary Device" "http://localhost:8000/health"

# Check Secondary Device  
check_service "Secondary Device" "http://localhost:8001/health"

# Check Frontend
check_service "Frontend" "http://localhost:3000"

echo ""
echo "Health check complete!"