#!/bin/bash
# Helper script to start the MCS system

echo "🚀 Starting MCS - Camera Monitoring System"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✓ Created .env file from .env.example"
        echo "📝 Please review and update .env file if needed"
    else
        echo "✗ .env.example not found. Please create .env manually."
        exit 1
    fi
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

echo "📋 Configuration:"
echo "   PostgreSQL Port: ${POSTGRES_PORT:-5432}"
echo "   Backend Port: ${BACKEND_PORT:-8000}"
echo "   Frontend Port: ${FRONTEND_PORT:-8501}"
echo ""

# Start services
echo "🐳 Starting Docker containers..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Services started successfully!"
    echo ""
    echo "📍 Access points:"
    echo "   Frontend: http://localhost:${FRONTEND_PORT:-8501}"
    echo "   Backend API: http://localhost:${BACKEND_PORT:-8000}"
    echo "   API Docs: http://localhost:${BACKEND_PORT:-8000}/docs"
    echo ""
    echo "💡 To view logs: docker-compose logs -f"
    echo "💡 To stop: docker-compose down"
else
    echo "✗ Failed to start services"
    exit 1
fi

