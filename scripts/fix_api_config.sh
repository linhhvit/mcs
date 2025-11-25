#!/bin/bash
# Script to fix API configuration for frontend

echo "🔧 Fixing Frontend API Configuration"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        echo "⚠️  .env.example not found. Creating default .env..."
        cat > .env << 'ENVEOF'
# Database Configuration
POSTGRES_USER=mcs_user
POSTGRES_PASSWORD=mcs_password
POSTGRES_DB=mcs_db
DATABASE_URL=postgresql://mcs_user:mcs_password@postgres:5432/mcs_db

# Port Configuration
POSTGRES_PORT=5432
BACKEND_PORT=8000
FRONTEND_PORT=8501

# Application Settings
SECRET_KEY=dev-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Backend Settings
BACKEND_HOST=0.0.0.0

# Frontend Settings - Use localhost for browser access
API_BASE_URL=http://localhost:8000

# Environment
ENVIRONMENT=development
DEBUG=true
ENVEOF
    fi
fi

# Update API_BASE_URL in .env if it exists
if grep -q "API_BASE_URL" .env; then
    # Check if it's using backend hostname
    if grep -q "API_BASE_URL=http://backend" .env; then
        echo "Updating API_BASE_URL to use localhost..."
        backend_port=$(grep "BACKEND_PORT" .env | cut -d'=' -f2 | tr -d ' ' || echo "8000")
        sed -i.bak "s|API_BASE_URL=.*|API_BASE_URL=http://localhost:${backend_port}|" .env
        echo "✓ Updated API_BASE_URL to http://localhost:${backend_port}"
    else
        echo "✓ API_BASE_URL already configured correctly"
    fi
else
    echo "Adding API_BASE_URL to .env..."
    backend_port=$(grep "BACKEND_PORT" .env | cut -d'=' -f2 | tr -d ' ' || echo "8000")
    echo "API_BASE_URL=http://localhost:${backend_port}" >> .env
    echo "✓ Added API_BASE_URL to .env"
fi

# Restart frontend to apply changes
echo ""
echo "Restarting frontend container..."
docker-compose restart frontend

echo ""
echo "✓ Configuration updated!"
echo ""
echo "Current API_BASE_URL:"
grep "API_BASE_URL" .env || echo "Not found"
echo ""
echo "💡 Frontend will now use localhost to connect to backend API"
echo "💡 Access frontend at: http://localhost:${FRONTEND_PORT:-8501}"

