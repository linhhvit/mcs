# Frontend API Configuration Guide

## Overview

The frontend needs to connect to the backend API. Since Streamlit runs in the browser, API requests must use `localhost` (or the host IP) rather than Docker internal hostnames like `backend`.

## Configuration

### Environment Variables

The frontend uses the following environment variables (set in `.env` or `docker-compose.yml`):

- `API_BASE_URL`: The base URL for the backend API (default: `http://localhost:8000`)
- `BACKEND_PORT`: The backend port (default: `8000`)

### Default Behavior

If `API_BASE_URL` is not set, the system defaults to:
```
http://localhost:8000
```

### Dynamic Configuration

The API base URL is determined dynamically:

1. **From Environment Variable**: If `API_BASE_URL` is set in `.env` or `docker-compose.yml`, it will be used
2. **Port Replacement**: If the URL contains `${BACKEND_PORT}`, it will be replaced with the actual backend port
3. **Default Fallback**: If not set, uses `http://localhost:{BACKEND_PORT}`

## Setup

### Option 1: Use .env File (Recommended)

1. Create or edit `.env` file:
```bash
API_BASE_URL=http://localhost:8000
BACKEND_PORT=8000
FRONTEND_PORT=8501
```

2. Restart frontend:
```bash
docker-compose restart frontend
```

### Option 2: Use docker-compose.yml

The `docker-compose.yml` already has default values:
```yaml
frontend:
  environment:
    API_BASE_URL: ${API_BASE_URL:-http://localhost:${BACKEND_PORT:-8000}}
    BACKEND_PORT: ${BACKEND_PORT:-8000}
```

### Option 3: Custom Ports

If you're using custom ports:

1. Update `.env`:
```bash
BACKEND_PORT=8001
FRONTEND_PORT=8502
API_BASE_URL=http://localhost:8001
```

2. Restart services:
```bash
docker-compose down
docker-compose up -d
```

## Troubleshooting

### 404 Not Found Error

If you see `404 Not Found` when trying to login:

1. **Check API_BASE_URL**:
   ```bash
   docker-compose exec frontend printenv | grep API_BASE_URL
   ```

2. **Verify Backend is Running**:
   ```bash
   curl http://localhost:8000/health
   ```

3. **Check Backend Port**:
   ```bash
   docker-compose ps backend
   ```

4. **Update Configuration**:
   - Ensure `API_BASE_URL` in `.env` matches your backend port
   - Restart frontend: `docker-compose restart frontend`

### Connection Refused

If you see connection errors:

1. **Verify Backend is Accessible**:
   ```bash
   curl http://localhost:8000/health
   ```

2. **Check Port Mapping**:
   ```bash
   docker-compose ps
   # Verify backend port mapping: 0.0.0.0:8000->8000/tcp
   ```

3. **Test from Frontend Container**:
   ```bash
   docker-compose exec frontend curl http://localhost:8000/health
   ```

### Wrong Hostname

If using `http://backend:8000` (Docker internal hostname):
- This only works for container-to-container communication
- Browser requests need `http://localhost:8000`
- Update `API_BASE_URL` to use `localhost`

## Verification

### Test API Connection

1. **From Host Machine**:
   ```bash
   curl http://localhost:8000/health
   ```

2. **From Frontend Container**:
   ```bash
   docker-compose exec frontend python -c "from utils.api_client import API_BASE_URL; print(API_BASE_URL)"
   ```

3. **Test Login**:
   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/login \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=admin&password=admin123"
   ```

## Best Practices

1. **Always use localhost for browser access**: The frontend runs in the browser, so use `http://localhost:PORT`
2. **Use environment variables**: Configure via `.env` file for easy changes
3. **Match ports**: Ensure `API_BASE_URL` port matches `BACKEND_PORT`
4. **Test after changes**: Always verify the connection after updating configuration

## Example Configurations

### Development (Default)
```bash
API_BASE_URL=http://localhost:8000
BACKEND_PORT=8000
FRONTEND_PORT=8501
```

### Custom Ports
```bash
API_BASE_URL=http://localhost:8001
BACKEND_PORT=8001
FRONTEND_PORT=8502
```

### Production (with domain)
```bash
API_BASE_URL=https://api.example.com
BACKEND_PORT=8000
FRONTEND_PORT=8501
```

