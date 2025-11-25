#!/bin/bash
# Comprehensive verification script for MCS system

echo "🔍 MCS System Verification"
echo "=========================="
echo ""

# Load environment variables if .env exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

POSTGRES_PORT=${POSTGRES_PORT:-5432}
BACKEND_PORT=${BACKEND_PORT:-8000}
FRONTEND_PORT=${FRONTEND_PORT:-8501}

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check containers
echo "📦 Checking Docker Containers..."
containers=("mcs_postgres" "mcs_backend" "mcs_frontend")
all_running=true

for container in "${containers[@]}"; do
    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        echo -e "   ${GREEN}✓${NC} $container is running"
    else
        echo -e "   ${RED}✗${NC} $container is not running"
        all_running=false
    fi
done
echo ""

# Check PostgreSQL
echo "🗄️  Checking PostgreSQL..."
if docker exec mcs_postgres pg_isready -U mcs_user -d mcs_db > /dev/null 2>&1; then
    echo -e "   ${GREEN}✓${NC} PostgreSQL is healthy"
    
    # Check if tables exist
    table_count=$(docker exec mcs_postgres psql -U mcs_user -d mcs_db -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
    if [ ! -z "$table_count" ] && [ "$table_count" -gt "0" ]; then
        echo -e "   ${GREEN}✓${NC} Database has $table_count tables"
    else
        echo -e "   ${YELLOW}⚠${NC}  No tables found - run migrations first"
    fi
else
    echo -e "   ${RED}✗${NC} PostgreSQL is not responding"
fi
echo ""

# Check Backend API
echo "🔌 Checking Backend API..."
backend_health=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${BACKEND_PORT}/health" 2>/dev/null)
if [ "$backend_health" = "200" ]; then
    echo -e "   ${GREEN}✓${NC} Backend health endpoint responding"
    echo "      URL: http://localhost:${BACKEND_PORT}/health"
    
    # Check API docs
    docs_status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${BACKEND_PORT}/docs" 2>/dev/null)
    if [ "$docs_status" = "200" ]; then
        echo -e "   ${GREEN}✓${NC} API documentation available"
        echo "      URL: http://localhost:${BACKEND_PORT}/docs"
    fi
else
    echo -e "   ${RED}✗${NC} Backend API is not responding (HTTP $backend_health)"
fi
echo ""

# Check Authentication
echo "🔐 Checking Authentication..."
login_response=$(curl -s -X POST "http://localhost:${BACKEND_PORT}/api/v1/auth/login" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=admin&password=admin123" 2>/dev/null)

if echo "$login_response" | grep -q "access_token"; then
    echo -e "   ${GREEN}✓${NC} Login successful"
    token=$(echo "$login_response" | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)
    if [ ! -z "$token" ]; then
        echo -e "   ${GREEN}✓${NC} JWT token received"
        
        # Test authenticated endpoint
        user_info=$(curl -s -H "Authorization: Bearer $token" "http://localhost:${BACKEND_PORT}/api/v1/auth/me" 2>/dev/null)
        if echo "$user_info" | grep -q "username"; then
            username=$(echo "$user_info" | python3 -c "import sys, json; print(json.load(sys.stdin)['username'])" 2>/dev/null)
            echo -e "   ${GREEN}✓${NC} Authenticated user endpoint working (user: $username)"
        fi
    fi
else
    echo -e "   ${RED}✗${NC} Login failed"
    echo "      Response: $login_response"
fi
echo ""

# Check Frontend
echo "🌐 Checking Frontend..."
frontend_status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${FRONTEND_PORT}" 2>/dev/null)
if [ "$frontend_status" = "200" ]; then
    echo -e "   ${GREEN}✓${NC} Frontend is responding"
    echo "      URL: http://localhost:${FRONTEND_PORT}"
else
    echo -e "   ${RED}✗${NC} Frontend is not responding (HTTP $frontend_status)"
fi
echo ""

# Summary
echo "=========================="
if [ "$all_running" = true ] && [ "$backend_health" = "200" ] && [ "$frontend_status" = "200" ]; then
    echo -e "${GREEN}✓ All systems operational!${NC}"
    echo ""
    echo "📍 Access Points:"
    echo "   Frontend:    http://localhost:${FRONTEND_PORT}"
    echo "   Backend API: http://localhost:${BACKEND_PORT}"
    echo "   API Docs:    http://localhost:${BACKEND_PORT}/docs"
    echo ""
    echo "🔑 Default Credentials:"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo ""
    echo "⚠️  Remember to change the default password!"
else
    echo -e "${YELLOW}⚠ Some issues detected. Check the output above.${NC}"
fi

