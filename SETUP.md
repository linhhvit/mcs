# Setup Guide

Complete setup instructions for the Camera Monitoring System (MCS).

## Prerequisites

Before starting, ensure you have:

- **Docker** (version 20.10 or later)
- **Docker Compose** (version 2.0 or later)
- **Git**

Verify installation:

```bash
docker --version
docker-compose --version
git --version
```

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd MCS
```

## Step 2: Environment Configuration

### 2.1 Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### 2.2 Configure Environment Variables

Edit `.env` file with your settings:

```bash
# Database Configuration
POSTGRES_USER=mcs_user
POSTGRES_PASSWORD=mcs_password          # Change this!
POSTGRES_DB=mcs_db
POSTGRES_PORT=5432

# Backend Configuration
SECRET_KEY=your-secret-key-here         # Change this! Generate with: openssl rand -hex 32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

# Frontend Configuration
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:8000

# API Configuration (for browser access)
API_BASE_URL=http://localhost:8000

# Environment
ENVIRONMENT=development
DEBUG=true
```

**Important**: Change `SECRET_KEY` and `POSTGRES_PASSWORD` for production!

### 2.3 Generate Secret Key (Optional)

For production, generate a secure secret key:

```bash
openssl rand -hex 32
```

## Step 3: Start Services

### Development Mode (Recommended for Development)

Includes auto-reload for both frontend and backend:

```bash
./scripts/dev.sh
```

This will:
- Start PostgreSQL database
- Start FastAPI backend with auto-reload
- Start Next.js frontend with Fast Refresh
- Mount volumes for live code updates

### Production Mode

For production deployment:

```bash
./scripts/prod.sh
```

This will:
- Build optimized production images
- Start services without development features
- Use production-optimized configurations

### Manual Start (Alternative)

If scripts don't work, use Docker Compose directly:

**Development:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

**Production:**
```bash
docker-compose up -d
```

## Step 4: Initialize Database

### 4.1 Run Migrations

Create database tables:

```bash
docker-compose exec backend alembic upgrade head
```

If this is the first time, it will create all tables.

### 4.2 Initialize Default Data

Create default roles and admin user:

```bash
docker-compose exec backend python scripts/init_db.py
```

This creates:
- Default roles (Admin, Operator, Viewer)
- Admin user:
  - Username: `admin`
  - Password: `admin123`
  - Email: `admin@mcs.local`

**Important**: Change the admin password after first login!

## Step 5: Verify Installation

### 5.1 Check Services

Verify all services are running:

```bash
docker-compose ps
```

You should see:
- `mcs_postgres` - Running
- `mcs_backend` - Running
- `mcs_frontend` - Running

### 5.2 Test Backend

Check backend health:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"message": "APIサーバーが正常に動作しています。", "doc": "OK"}
```

### 5.3 Test Frontend

Open in browser:
- http://localhost:3000 (or your configured `FRONTEND_PORT`)

You should see the login page.

### 5.4 Test API Documentation

Open in browser:
- http://localhost:8000/docs

You should see the interactive API documentation.

## Step 6: First Login

1. Open http://localhost:3000 in your browser
2. Login with:
   - **Username**: `admin`
   - **Password**: `admin123`
3. You'll be redirected to the dashboard

## Step 7: Post-Setup (Optional)

### Change Admin Password

After first login, change the admin password:

1. Go to Users page
2. Edit admin user
3. Update password

Or use the backend script:

```bash
docker-compose exec backend python scripts/rehash_admin_password.py
```

### Configure Ports

If ports conflict with other services, update `.env`:

```bash
FRONTEND_PORT=3001
BACKEND_PORT=8001
POSTGRES_PORT=5433
```

Then restart:

```bash
docker-compose down
docker-compose up -d
```

See [docs/port-configuration.md](docs/port-configuration.md) for details.

## Development Workflow

### Making Code Changes

**Backend Changes:**
- Edit files in `backend/`
- Changes auto-reload (Uvicorn `--reload`)
- Check logs: `docker-compose logs -f backend`

**Frontend Changes:**
- Edit files in `frontend/`
- Changes hot-reload (Next.js Fast Refresh)
- Check logs: `docker-compose logs -f frontend`

### Database Changes

1. **Modify models** in `backend/app/models/`
2. **Create migration**:
   ```bash
   docker-compose exec backend alembic revision --autogenerate -m "description"
   ```
3. **Apply migration**:
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Stopping Services

```bash
# Stop services (keep containers)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (⚠️ deletes data)
docker-compose down -v
```

## Troubleshooting

### Services Won't Start

1. **Check ports are available**:
   ```bash
   lsof -i :3000
   lsof -i :8000
   lsof -i :5432
   ```

2. **Check Docker is running**:
   ```bash
   docker ps
   ```

3. **View error logs**:
   ```bash
   docker-compose logs
   ```

### Database Connection Errors

1. **Check PostgreSQL is running**:
   ```bash
   docker-compose ps postgres
   ```

2. **Check database URL** in `.env`:
   ```bash
   DATABASE_URL=postgresql://mcs_user:mcs_password@postgres:5432/mcs_db
   ```
   Note: Use `postgres` (container name), not `localhost`

3. **Restart database**:
   ```bash
   docker-compose restart postgres
   ```

### Frontend Can't Connect to Backend

1. **Check `NEXT_PUBLIC_API_URL`** in `.env`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
   Must use `localhost`, not `backend` (Docker service name)

2. **Check backend is running**:
   ```bash
   curl http://localhost:8000/health
   ```

3. **Restart frontend**:
   ```bash
   docker-compose restart frontend
   ```

### Migration Errors

1. **Check current migration version**:
   ```bash
   docker-compose exec backend alembic current
   ```

2. **View migration history**:
   ```bash
   docker-compose exec backend alembic history
   ```

3. **Rollback if needed**:
   ```bash
   docker-compose exec backend alembic downgrade -1
   ```

### Authentication Issues

1. **Clear browser localStorage**:
   - Open browser console
   - Run: `localStorage.clear()`
   - Refresh page

2. **Check token expiration**:
   - Default: 30 minutes
   - Configure in `.env`: `ACCESS_TOKEN_EXPIRE_MINUTES=60`

3. **Re-initialize admin user**:
   ```bash
   docker-compose exec backend python scripts/init_db.py
   ```

## Next Steps

- Read [Component Architecture](docs/component-architecture.md) for frontend development
- Read [Port Configuration](docs/port-configuration.md) for port management
- Read [Development Setup](docs/development-setup.md) for development workflow
- Explore the API at http://localhost:8000/docs

## Support

If you encounter issues:

1. Check logs: `docker-compose logs`
2. Verify environment variables in `.env`
3. Check service status: `docker-compose ps`
4. Review documentation in `docs/` directory
