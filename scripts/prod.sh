#!/bin/bash
# Production mode script - starts services with optimized builds

set -e

echo "🚀 Starting MCS in Production Mode"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file"
    else
        echo "⚠️  No .env.example found. Using defaults."
    fi
fi

# Build and start services
echo "📦 Building and starting services..."
docker-compose up -d --build

echo ""
echo "✅ Services started in production mode!"
echo ""
echo "📍 Access points:"
echo "   Frontend: http://localhost:${FRONTEND_PORT:-3000}"
echo "   Backend:  http://localhost:${BACKEND_PORT:-8000}"
echo "   API Docs: http://localhost:${BACKEND_PORT:-8000}/docs"
echo ""
echo "🛑 To stop:"
echo "   docker-compose down"

