# Development Setup Guide

## Auto Reload & Hot Module Replacement

### Frontend (Next.js)

Next.js has built-in **Fast Refresh** (similar to Vite HMR) that automatically reloads components when you save files.

**Features:**
- ✅ Hot Module Replacement (HMR) - changes appear instantly
- ✅ Preserves component state during updates
- ✅ Fast Refresh - only updates changed components
- ✅ TypeScript and CSS hot reload

**How it works:**
- Run `npm run dev` in development mode
- Edit any `.tsx`, `.ts`, or `.css` file
- Changes appear instantly in the browser (no full page reload)

### Backend (FastAPI)

FastAPI with uvicorn supports auto-reload:

**Features:**
- ✅ Watches for `.py` file changes
- ✅ Automatically restarts server on changes
- ✅ No need to manually restart

**How it works:**
- Uses `--reload` flag in uvicorn
- Monitors all Python files in the project
- Restarts server automatically on save

## Environment Variables

### Next.js Environment Variables

Next.js handles environment variables differently than Vite:

#### Client-Side Variables (Browser)
- **Prefix:** `NEXT_PUBLIC_*`
- **Access:** Available in browser via `process.env.NEXT_PUBLIC_*`
- **Example:** `NEXT_PUBLIC_API_URL=http://localhost:8000`
- **Usage:** `process.env.NEXT_PUBLIC_API_URL`

#### Server-Side Variables
- **No prefix:** Regular environment variables
- **Access:** Only in server-side code (API routes, getServerSideProps, etc.)
- **Example:** `API_BASE_URL=http://backend:8000`
- **Usage:** `process.env.API_BASE_URL`

### Dynamic Environment Variables

Unlike Vite which uses `import.meta.env`, Next.js uses `process.env`:

```typescript
// ✅ Client-side (browser)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ✅ Server-side only
const dbUrl = process.env.DATABASE_URL; // Not accessible in browser
```

### Environment Files

Next.js loads environment files in this order (later files override earlier):
1. `.env` - Default for all environments
2. `.env.local` - Local overrides (gitignored)
3. `.env.development` - Development only
4. `.env.production` - Production only

### Docker Environment Variables

In Docker, environment variables are set in `docker-compose.yml`:

```yaml
environment:
  NEXT_PUBLIC_API_URL: ${API_BASE_URL:-http://localhost:8000}
  API_BASE_URL: ${API_BASE_URL:-http://backend:8000}
```

Variables from `.env` file are automatically loaded by docker-compose.

## Development vs Production

### Development Mode

**Start with hot reload:**
```bash
./scripts/dev.sh
# or
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

**Features:**
- ✅ Hot reload enabled
- ✅ Source code mounted as volumes
- ✅ Fast Refresh for frontend
- ✅ Auto-reload for backend
- ✅ Development optimizations

### Production Mode

**Start optimized build:**
```bash
./scripts/prod.sh
# or
docker-compose up -d --build
```

**Features:**
- ✅ Optimized Next.js build
- ✅ Standalone output
- ✅ Production optimizations
- ✅ No source code in container

## Quick Reference

### Frontend Development
```bash
# Local development (outside Docker)
cd frontend
npm install
npm run dev  # Starts on http://localhost:3000 with HMR

# Docker development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up frontend
```

### Backend Development
```bash
# Local development
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Docker development (auto-reload enabled)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up backend
```

### Environment Variables

**Create `.env.local` in frontend:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Create `.env` in project root:**
```bash
API_BASE_URL=http://localhost:8000
BACKEND_PORT=8000
FRONTEND_PORT=3000
```

## Troubleshooting

### Hot Reload Not Working

1. **Check volumes are mounted:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml config
   ```

2. **Check file permissions:**
   ```bash
   ls -la frontend/
   ```

3. **Restart services:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml restart
   ```

### Environment Variables Not Working

1. **Check variable prefix:**
   - Browser: Must use `NEXT_PUBLIC_*`
   - Server: No prefix needed

2. **Restart Next.js dev server:**
   - Environment variables are loaded at startup
   - Changes require restart

3. **Check docker-compose environment:**
   ```bash
   docker-compose exec frontend env | grep NEXT_PUBLIC
   ```

### Build Errors

1. **Clear Next.js cache:**
   ```bash
   cd frontend
   rm -rf .next
   npm run build
   ```

2. **Rebuild Docker image:**
   ```bash
   docker-compose build --no-cache frontend
   ```

