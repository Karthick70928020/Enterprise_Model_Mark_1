#!/bin/bash

set -e

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

echo "💾 Starting Project Aegis Backup..."

# Backup databases
echo "Backing up databases..."
cp primary_device.db $BACKUP_DIR/ 2>/dev/null || echo "No primary database found"
cp secondary_device.db $BACKUP_DIR/ 2>/dev/null || echo "No secondary database found"

# Backup cryptographic keys
echo "Backing up cryptographic keys..."
cp -r keys $BACKUP_DIR/ 2>/dev/null || echo "No keys directory found"

# Backup audit trails
echo "Backing up audit trails..."
cp -r secure_storage $BACKACKUP_DIR/ 2>/dev/null || echo "No secure storage found"

# Backup configuration
echo "Backing up configuration..."
cp .env $BACKUP_DIR/ 2>/dev/null || echo "No .env file found"
cp -r config $BACKUP_DIR/ 2>/dev/null || echo "No config directory found"

echo "✅ Backup completed: $BACKUP_DIR"
echo ""
echo "Backup contents:"
ls -la $BACKUP_DIR/
