#!/bin/bash
# Helper script to verify the MCS system is running

echo "🔍 Verifying MCS System Status"
echo ""

# Load environment variables if .env exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

POSTGRES_PORT=${POSTGRES_PORT:-5432}
BACKEND_PORT=${BACKEND_PORT:-8000}
FRONTEND_PORT=${FRONTEND_PORT:-8501}

# Check if containers are running
echo "📦 Checking containers..."
containers=("mcs_postgres" "mcs_backend" "mcs_frontend")
all_running=true

for container in "${containers[@]}"; do
    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        echo "   ✓ $container is running"
    else
        echo "   ✗ $container is not running"
        all_running=false
    fi
done

echo ""

# Check service health
if [ "$all_running" = true ]; then
    echo "🌐 Checking service endpoints..."
    
    # Check PostgreSQL
    if docker exec mcs_postgres pg_isready -U mcs_user -d mcs_db > /dev/null 2>&1; then
        echo "   ✓ PostgreSQL is healthy"
    else
        echo "   ✗ PostgreSQL is not responding"
    fi
    
    # Check Backend
    if curl -s -f "http://localhost:${BACKEND_PORT}/health" > /dev/null 2>&1; then
        echo "   ✓ Backend API is responding"
        echo "      URL: http://localhost:${BACKEND_PORT}/health"
    else
        echo "   ✗ Backend API is not responding"
        echo "      Expected: http://localhost:${BACKEND_PORT}/health"
    fi
    
    # Check Frontend
    if curl -s -f "http://localhost:${FRONTEND_PORT}" > /dev/null 2>&1; then
        echo "   ✓ Frontend is responding"
        echo "      URL: http://localhost:${FRONTEND_PORT}"
    else
        echo "   ✗ Frontend is not responding"
        echo "      Expected: http://localhost:${FRONTEND_PORT}"
    fi
    
    echo ""
    echo "📊 Service URLs:"
    echo "   Frontend:    http://localhost:${FRONTEND_PORT}"
    echo "   Backend API: http://localhost:${BACKEND_PORT}"
    echo "   API Docs:    http://localhost:${BACKEND_PORT}/docs"
    echo "   PostgreSQL:  localhost:${POSTGRES_PORT}"
else
    echo "⚠️  Some containers are not running. Start them with:"
    echo "   docker-compose up -d"
    echo "   or"
    echo "   ./scripts/start.sh"
fi

echo ""

