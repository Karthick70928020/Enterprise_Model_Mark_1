# Project Aegis - Unified Security System

Enterprise-grade AI-driven cybersecurity platform with dual-device architecture for real-time threat detection and cryptographic audit trails.

## 🚀 Features

- **AI-Powered Threat Detection**: Autoencoder + Isolation Forest for anomaly detection
- **Cryptographic Security**: Hardware-secured key management with TOTP
- **Immutable Audit Trail**: SHA-256 hash-chained logging
- **Real-time Monitoring**: WebSocket-based live updates
- **Zero Trust Architecture**: Continuous verification and policy enforcement

## 🏗️ Architecture

- **Primary Device**: AI Security Engine (Port 8000)
- **Secondary Device**: Cryptographic Control Unit (Port 8001) 
- **Frontend Dashboard**: React TypeScript (Port 3000)

## 🛠️ Quick Start

```bash
# Setup all components
make setup

# Start all services
make start

# Access dashboard: http://localhost:3000

**project-aegis/Makefile**
```makefile
.PHONY: setup start stop clean test docs

setup:
	@echo "Setting up Project Aegis..."
	chmod +x scripts/setup.sh
	./scripts/setup.sh

start:
	@echo "Starting Project Aegis..."
	chmod +x scripts/start_all.sh
	./scripts/start_all.sh

stop:
	@echo "Stopping all services..."
	pkill -f "python app/main.py" || true
	pkill -f "uvicorn" || true
	pkill -f "vite" || true

clean:
	@echo "Cleaning project..."
	rm -rf primary_device/venv secondary_device/venv frontend/node_modules
	rm -rf primary_device.db secondary_device.db secure_storage
	rm -rf keys backup_keys
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -delete
	find . -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true

test:
	@echo "Running tests..."
	cd tests && python -m pytest -v

docs:
	@echo "Starting documentation server..."
	cd docs && python -m http.server 8002

status:
	@echo "Service Status:"
	@pgrep -f "python app/main.py" >/dev/null && echo "✓ Backend services running" || echo "✗ Backend services stopped"
	@pgrep -f "vite" >/dev/null && echo "✓ Frontend running" || echo "✗ Frontend stopped"

.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make setup    - Install dependencies and setup environment"
	@echo "  make start    - Start all services"
	@echo "  make stop     - Stop all services"
	@echo "  make clean    - Clean project and remove dependencies"
	@echo "  make test     - Run test suite"
	@echo "  make docs     - Start documentation server"
	@echo "  make status   - Check service status"