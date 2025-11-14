#!/bin/bash

set -e

echo "🚀 Setting up Project Aegis..."

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Create virtual environments
echo "📦 Creating virtual environments..."
python3 -m venv primary_device/venv
python3 -m venv secondary_device/venv

# Install primary device dependencies
echo "📦 Installing primary device dependencies..."
source primary_device/venv/bin/activate
pip install --upgrade pip
pip install -r requirements/primary_requirements.txt

# Install secondary device dependencies
echo "📦 Installing secondary device dependencies..."
source secondary_device/venv/bin/activate
pip install --upgrade pip
pip install -r requirements/secondary_requirements.txt

# Setup frontend
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p keys backup_keys secure_storage

# Copy environment file
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual configuration"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Run 'make start' to start all services"
echo "3. Access dashboard at http://localhost:3000"