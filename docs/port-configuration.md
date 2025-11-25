# Port Configuration Guide

## Overview

All ports can be configured via the `.env` file. This allows you to:
- Avoid port conflicts
- Run multiple instances
- Use custom ports for your environment

## Environment Variables

### Port Configuration

Create or edit `.env` file in the project root:

```bash
# Database
POSTGRES_PORT=5432

# Backend API
BACKEND_PORT=8000

# Frontend (Next.js)
FRONTEND_PORT=3000

# API URL (for browser access)
API_BASE_URL=http://localhost:8000
```

## How It Works

### Frontend Port

The frontend port is configured in multiple places:

1. **Docker Compose** (`docker-compose.yml`):
   ```yaml
   ports:
     - "${FRONTEND_PORT:-3000}:3000"
   ```

2. **Next.js Dev Server** (`package.json`):
   ```json
   "dev": "next dev -p ${PORT:-3000}"
   ```

3. **Environment Variable**:
   - Set `FRONTEND_PORT=3000` in `.env`
   - Docker-compose automatically uses it
   - Next.js reads `PORT` environment variable

### Example: Change Frontend Port to 4000

1. **Edit `.env` file:**
   ```bash
   FRONTEND_PORT=4000
   ```

2. **Update API URL if needed:**
   ```bash
   API_BASE_URL=http://localhost:8000
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Restart services:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

4. **Access frontend:**
   - New URL: http://localhost:4000

## Port Configuration Details

### Development Mode

When using `docker-compose.dev.yml`:

```bash
# Start with custom port
FRONTEND_PORT=4000 docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d frontend
```

Or set in `.env`:
```bash
FRONTEND_PORT=4000
```

### Production Mode

```bash
# Set in .env
FRONTEND_PORT=4000

# Start services
docker-compose up -d
```

## Port Mapping

Docker port mapping format: `HOST_PORT:CONTAINER_PORT`

- **HOST_PORT**: Port on your machine (from `.env`)
- **CONTAINER_PORT**: Port inside container (usually same as HOST_PORT)

Example:
```yaml
ports:
  - "4000:3000"  # Host port 4000 → Container port 3000
```

## Common Port Configurations

### Default Configuration
```bash
POSTGRES_PORT=5432
BACKEND_PORT=8000
FRONTEND_PORT=3000
```

### Alternative Ports (if defaults are in use)
```bash
POSTGRES_PORT=5433
BACKEND_PORT=8001
FRONTEND_PORT=3001
API_BASE_URL=http://localhost:8001
```

### Custom Development Setup
```bash
POSTGRES_PORT=5432
BACKEND_PORT=8080
FRONTEND_PORT=4200
API_BASE_URL=http://localhost:8080
```

## Verification

After changing ports, verify:

1. **Check ports are correct:**
   ```bash
   docker-compose ps
   ```

2. **Test frontend:**
   ```bash
   curl http://localhost:${FRONTEND_PORT:-3000}
   ```

3. **Test backend:**
   ```bash
   curl http://localhost:${BACKEND_PORT:-8000}/health
   ```

## Troubleshooting

### Port Already in Use

If you get "port already in use" error:

1. **Find what's using the port:**
   ```bash
   # macOS/Linux
   lsof -i :3000
   
   # Or
   netstat -an | grep 3000
   ```

2. **Change port in .env:**
   ```bash
   FRONTEND_PORT=3001
   ```

3. **Restart services:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Frontend Can't Connect to Backend

If frontend can't reach backend after changing ports:

1. **Update API_BASE_URL in .env:**
   ```bash
   API_BASE_URL=http://localhost:8000  # Use actual backend port
   ```

2. **Restart frontend:**
   ```bash
   docker-compose restart frontend
   ```

### Next.js Port Not Changing

If Next.js still uses default port:

1. **Check environment variable:**
   ```bash
   docker-compose exec frontend env | grep PORT
   ```

2. **Restart with new port:**
   ```bash
   docker-compose down frontend
   FRONTEND_PORT=4000 docker-compose up -d frontend
   ```

## Quick Reference

| Service | Default Port | Env Variable | Access URL |
|---------|-------------|--------------|------------|
| PostgreSQL | 5432 | `POSTGRES_PORT` | localhost:5432 |
| Backend API | 8000 | `BACKEND_PORT` | http://localhost:8000 |
| Frontend | 3000 | `FRONTEND_PORT` | http://localhost:3000 |

## Example: Complete Port Change

```bash
# 1. Edit .env
cat > .env << EOF
POSTGRES_PORT=5433
BACKEND_PORT=8001
FRONTEND_PORT=3001
API_BASE_URL=http://localhost:8001
EOF

# 2. Restart services
docker-compose down
docker-compose up -d

# 3. Verify
curl http://localhost:3001  # Frontend
curl http://localhost:8001/health  # Backend
```
