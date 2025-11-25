# Windows Development Setup Guide

Complete step-by-step guide to set up the Camera Monitoring System (MCS) on a new Windows machine.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Project Setup](#project-setup)
4. [Running the Application](#running-the-application)
5. [Development Workflow](#development-workflow)
6. [Troubleshooting](#troubleshooting)
7. [Common Issues](#common-issues)

---

## Prerequisites

### 1. Install Git

1. Download Git for Windows: https://git-scm.com/download/win
2. Run the installer
3. Use default settings (recommended)
4. Verify installation:
   ```powershell
   git --version
   ```

### 2. Install Docker Desktop for Windows

1. Download Docker Desktop: https://www.docker.com/products/docker-desktop
2. Run the installer
3. **Important**: Enable WSL 2 backend during installation
4. Restart your computer if prompted
5. Launch Docker Desktop
6. Wait for Docker to start (whale icon in system tray)
7. Verify installation:
   ```powershell
   docker --version
   docker-compose --version
   ```

**Note**: If Docker Desktop doesn't start, ensure:
- Virtualization is enabled in BIOS
- WSL 2 is installed (Docker Desktop installer can install it)
- Windows updates are current

### 3. Install WSL 2 (if not already installed)

Docker Desktop usually installs this, but if needed:

1. Open PowerShell as Administrator
2. Run:
   ```powershell
   wsl --install
   ```
3. Restart your computer
4. Verify:
   ```powershell
   wsl --version
   ```

### 4. Install a Code Editor (Optional but Recommended)

**VS Code** (Recommended):
1. Download: https://code.visualstudio.com/
2. Install with default settings
3. Install extensions:
   - Docker
   - Remote - WSL
   - Python
   - ESLint
   - Prettier

---

## Installation Steps

### Step 1: Clone the Repository

1. Open PowerShell or Command Prompt
2. Navigate to your projects directory:
   ```powershell
   cd C:\Users\YourUsername\projects
   ```
   Or create a new directory:
   ```powershell
   mkdir C:\projects
   cd C:\projects
   ```

3. Clone the repository:
   ```powershell
   git clone <repository-url>
   cd MCS
   ```

### Step 2: Verify Docker is Running

1. Check Docker Desktop is running (whale icon in system tray)
2. Verify Docker is working:
   ```powershell
   docker ps
   ```
   Should show empty list (not an error)

3. If Docker is not running:
   - Open Docker Desktop
   - Wait for "Docker Desktop is running" message
   - Try `docker ps` again

### Step 3: Configure Environment Variables

1. Navigate to project directory:
   ```powershell
   cd C:\projects\MCS
   ```

2. Copy the example environment file:
   ```powershell
   copy .env.example .env
   ```

3. Open `.env` file in a text editor (Notepad, VS Code, etc.)

4. Review and update if needed:
   ```env
   # Database Configuration
   POSTGRES_USER=mcs_user
   POSTGRES_PASSWORD=mcs_password
   POSTGRES_DB=mcs_db
   POSTGRES_PORT=5432

   # Backend Configuration
   SECRET_KEY=dev-secret-key-change-in-production
   BACKEND_PORT=8000

   # Frontend Configuration
   FRONTEND_PORT=3000
   NEXT_PUBLIC_API_URL=http://localhost:8000

   # Environment
   ENVIRONMENT=development
   DEBUG=true
   ```

5. **Important**: Change `SECRET_KEY` for production:
   ```powershell
   # Generate a secure key (optional)
   # You can use: https://www.random.org/strings/
   ```

6. Save the file

### Step 4: Make Scripts Executable (if needed)

On Windows, scripts should work, but if you encounter issues:

1. Check script permissions:
   ```powershell
   Get-ExecutionPolicy
   ```

2. If restricted, allow scripts (run PowerShell as Administrator):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

---

## Project Setup

### Step 1: Build Docker Images

First time setup - build the Docker images:

```powershell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
```

This may take 5-10 minutes the first time as it downloads base images and installs dependencies.

**Important**: If you encounter "next: not found" errors later, rebuild the frontend image:
```powershell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build frontend
```

### Step 2: Start Services

**Development mode** (with auto-reload):
```powershell
.\scripts\dev.sh
```

Or manually:
```powershell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

**Production mode**:
```powershell
.\scripts\prod.sh
```

Or manually:
```powershell
docker-compose up -d
```

### Step 3: Verify Services are Running

Check all services are up:
```powershell
docker-compose ps
```

You should see:
- `mcs_postgres` - Running
- `mcs_backend` - Running
- `mcs_frontend` - Running

### Step 4: Wait for Services to Initialize

Wait 10-15 seconds for PostgreSQL to be ready, then check logs:
```powershell
docker-compose logs postgres
```

Look for: "database system is ready to accept connections"

### Step 5: Initialize Database

1. **Create and apply migrations**:
   ```powershell
   docker-compose exec backend alembic upgrade head
   ```

2. **Initialize default data** (roles and admin user):
   ```powershell
   docker-compose exec backend python scripts/init_db.py
   ```

This creates:
- Default roles (Admin, Operator, Viewer)
- Admin user:
  - Username: `admin`
  - Password: `admin123`
  - Email: `admin@mcs.local`

---

## Running the Application

### Access the Application

1. **Frontend**: Open browser to http://localhost:3000
   - You should see the login page

2. **Backend API**: http://localhost:8000
   - Test: http://localhost:8000/health
   - Should return: `{"message": "APIサーバーが正常に動作しています。", "doc": "OK"}`

3. **API Documentation**: http://localhost:8000/docs
   - Interactive API documentation

### First Login

1. Open http://localhost:3000
2. Login with:
   - **Username**: `admin`
   - **Password**: `admin123`
3. You'll be redirected to the dashboard

**Important**: Change the admin password after first login!

---

## Development Workflow

### Making Code Changes

#### Backend Changes (Python/FastAPI)

1. Edit files in `backend/app/`
2. Changes auto-reload (Uvicorn `--reload`)
3. View logs:
   ```powershell
   docker-compose logs -f backend
   ```

#### Frontend Changes (Next.js/React)

1. Edit files in `frontend/app/` or `frontend/components/`
2. Changes hot-reload (Next.js Fast Refresh)
3. View logs:
   ```powershell
   docker-compose logs -f frontend
   ```

### Viewing Logs

**All services**:
```powershell
docker-compose logs -f
```

**Specific service**:
```powershell
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

**Exit logs**: Press `Ctrl+C`

### Database Migrations

**Create a new migration**:
```powershell
docker-compose exec backend alembic revision --autogenerate -m "description"
```

**Apply migrations**:
```powershell
docker-compose exec backend alembic upgrade head
```

**Rollback migration**:
```powershell
docker-compose exec backend alembic downgrade -1
```

### Stopping Services

**Stop services** (keep containers):
```powershell
docker-compose stop
```

**Stop and remove containers**:
```powershell
docker-compose down
```

**Stop and remove containers + volumes** (⚠️ deletes database data):
```powershell
docker-compose down -v
```

### Restarting Services

**Restart all services**:
```powershell
docker-compose restart
```

**Restart specific service**:
```powershell
docker-compose restart backend
docker-compose restart frontend
```

---

## Troubleshooting

### Docker Desktop Won't Start

1. **Check virtualization is enabled**:
   - Restart computer
   - Enter BIOS/UEFI settings
   - Enable "Virtualization Technology" or "Intel VT-x" / "AMD-V"
   - Save and exit

2. **Check WSL 2 is installed**:
   ```powershell
   wsl --version
   ```
   If not installed:
   ```powershell
   wsl --install
   ```

3. **Restart Docker Desktop**:
   - Right-click Docker Desktop icon in system tray
   - Select "Restart Docker Desktop"

### Port Already in Use

If you get "port already in use" error:

1. **Find what's using the port**:
   ```powershell
   netstat -ano | findstr :3000
   netstat -ano | findstr :8000
   ```

2. **Change port in `.env`**:
   ```env
   FRONTEND_PORT=3001
   BACKEND_PORT=8001
   ```

3. **Restart services**:
   ```powershell
   docker-compose down
   docker-compose up -d
   ```

### Services Won't Start

1. **Check Docker is running**:
   ```powershell
   docker ps
   ```

2. **Check logs for errors**:
   ```powershell
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs
   ```

3. **If frontend shows "next: not found" error**:
   ```powershell
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml build frontend
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d frontend
   ```

4. **Rebuild all images**:
   ```powershell
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```

### Database Connection Errors

1. **Check PostgreSQL is running**:
   ```powershell
   docker-compose ps postgres
   ```

2. **Check database logs**:
   ```powershell
   docker-compose logs postgres
   ```

3. **Wait longer** - PostgreSQL may need 10-15 seconds to initialize

4. **Restart database**:
   ```powershell
   docker-compose restart postgres
   ```

### Frontend Can't Connect to Backend

1. **Check `NEXT_PUBLIC_API_URL` in `.env`**:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
   Must use `localhost`, not `backend`

2. **Check backend is running**:
   ```powershell
   curl http://localhost:8000/health
   ```
   Or open in browser: http://localhost:8000/health

3. **Restart frontend**:
   ```powershell
   docker-compose restart frontend
   ```

### Permission Denied on Scripts

If scripts don't run:

1. **Check execution policy**:
   ```powershell
   Get-ExecutionPolicy
   ```

2. **Allow scripts** (run PowerShell as Administrator):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Or run commands directly**:
   ```powershell
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```

### Git Line Ending Issues

If you see line ending warnings:

1. **Configure Git**:
   ```powershell
   git config --global core.autocrlf true
   ```

2. **Or for this project only**:
   ```powershell
   git config core.autocrlf true
   ```

---

## Common Issues

### Issue: "docker-compose: command not found"

**Solution**: Use `docker compose` (without hyphen) on newer Docker versions:
```powershell
docker compose up -d
```

### Issue: "Cannot connect to Docker daemon"

**Solution**: 
1. Ensure Docker Desktop is running
2. Wait for Docker to fully start
3. Restart Docker Desktop if needed

### Issue: "Port is already allocated"

**Solution**:
1. Find process using port:
   ```powershell
   netstat -ano | findstr :8000
   ```
2. Kill process (replace PID with actual process ID):
   ```powershell
   taskkill /PID <PID> /F
   ```
3. Or change port in `.env`

### Issue: "WSL 2 installation is incomplete"

**Solution**:
1. Install WSL 2:
   ```powershell
   wsl --install
   ```
2. Restart computer
3. Update WSL 2:
   ```powershell
   wsl --update
   ```

### Issue: Slow Performance

**Solutions**:
1. **Allocate more resources to Docker**:
   - Open Docker Desktop
   - Go to Settings → Resources
   - Increase CPU and Memory allocation
   - Apply & Restart

2. **Use WSL 2 backend** (should be default):
   - Docker Desktop → Settings → General
   - Ensure "Use the WSL 2 based engine" is checked

3. **Exclude project folder from antivirus**:
   - Add project folder to antivirus exclusions

### Issue: "next: not found" or "next/dist/bin/next: not found"

This error occurs when Next.js dependencies are not properly installed in the frontend container.

**Solutions**:

1. **Rebuild the frontend image**:
   ```powershell
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml build frontend
   ```

2. **Restart the frontend service**:
   ```powershell
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml restart frontend
   ```

3. **If the issue persists, manually install dependencies in the container**:
   ```powershell
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec frontend npm ci
   ```

4. **Or rebuild all services**:
   ```powershell
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```

5. **Check frontend logs for more details**:
   ```powershell
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs frontend
   ```

### Issue: Changes Not Reflecting

**Solutions**:
1. **Check volumes are mounted** (development mode):
   ```powershell
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml config
   ```

2. **Restart service**:
   ```powershell
   docker-compose restart frontend
   docker-compose restart backend
   ```

3. **Clear browser cache**:
   - Press `Ctrl+Shift+Delete`
   - Clear cached images and files
   - Refresh page with `Ctrl+F5`

---

## Quick Reference Commands

### Start Development
```powershell
.\scripts\dev.sh
# Or
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Stop Services
```powershell
docker-compose down
```

### View Logs
```powershell
docker-compose logs -f
```

### Restart Service
```powershell
docker-compose restart <service-name>
```

### Execute Command in Container
```powershell
docker-compose exec <service-name> <command>
```

### Database Migrations
```powershell
docker-compose exec backend alembic upgrade head
```

### Initialize Database
```powershell
docker-compose exec backend python scripts/init_db.py
```

---

## Next Steps

After setup is complete:

1. ✅ Read [Component Architecture Guide](component-architecture.md)
2. ✅ Read [Port Configuration Guide](port-configuration.md)
3. ✅ Explore the API at http://localhost:8000/docs
4. ✅ Start developing!

---

## Getting Help

If you encounter issues:

1. Check logs: `docker-compose logs`
2. Verify environment variables in `.env`
3. Check service status: `docker-compose ps`
4. Review this guide's troubleshooting section
5. Check [SETUP.md](../../SETUP.md) for additional help

---

## Windows-Specific Tips

1. **Use PowerShell** instead of Command Prompt for better compatibility
2. **Enable WSL 2** for better Docker performance
3. **Allocate sufficient resources** to Docker Desktop (Settings → Resources)
4. **Exclude project folder** from Windows Defender/antivirus for better performance
5. **Use VS Code** with WSL extension for seamless development

---

**Last Updated**: 2024
**Tested on**: Windows 10, Windows 11

