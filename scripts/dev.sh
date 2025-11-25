#!/bin/bash
# Development mode script - starts services with hot reload

set -e

echo "🚀 Starting MCS in Development Mode (with hot reload)"
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

# Start services with development compose file
echo "📦 Starting services..."
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

echo ""
echo "✅ Services started!"
echo ""
echo "📍 Access points:"
echo "   Frontend: http://localhost:${FRONTEND_PORT:-3000} (with hot reload)"
echo "   Backend:  http://localhost:${BACKEND_PORT:-8000} (with auto-reload)"
echo "   API Docs: http://localhost:${BACKEND_PORT:-8000}/docs"
echo ""
echo "💡 Hot Reload enabled:"
echo "   - Frontend: Changes to .tsx/.ts files auto-reload"
echo "   - Backend: Changes to .py files auto-reload"
echo ""
echo "📝 To view logs:"
echo "   docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f"
echo ""
echo "🛑 To stop:"
echo "   docker-compose -f docker-compose.yml -f docker-compose.dev.yml down"

