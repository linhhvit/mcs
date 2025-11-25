# Camera Monitoring System (MCS)

A modern, full-stack camera monitoring system built with FastAPI, Next.js, and PostgreSQL.

## 🚀 Features

- **Camera Management**: Manage cameras, sites, and zones
- **Checklist System**: Create and manage monitoring checklists
- **Execution Tracking**: Monitor checklist executions with status tracking
- **User Management**: Role-based access control (RBAC)
- **Reports & Analytics**: View execution statistics and success rates
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS
- **Real-time Updates**: Auto-reload in development mode

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Relational database
- **SQLAlchemy** - ORM for database operations
- **Alembic** - Database migrations
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Auto-reload** - Hot module replacement for development

## 📋 Prerequisites

- Docker and Docker Compose
- Git

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd MCS
```

### 2. Configure environment variables

Copy the example environment file and customize:

```bash
cp .env.example .env
```

Edit `.env` with your settings (see [Configuration](#configuration) below).

### 3. Start the application

**Development mode** (with auto-reload):
```bash
./scripts/dev.sh
```

**Production mode**:
```bash
./scripts/prod.sh
```

### 4. Access the application

- **Frontend**: http://localhost:3000 (or your configured `FRONTEND_PORT`)
- **Backend API**: http://localhost:8000 (or your configured `BACKEND_PORT`)
- **API Docs**: http://localhost:8000/docs

### 5. Initialize the database

```bash
# Create and apply migrations
docker-compose exec backend alembic upgrade head

# Initialize default data (roles and admin user)
docker-compose exec backend python scripts/init_db.py
```

### 6. Login

Default credentials:
- **Username**: `admin`
- **Password**: `admin123`

## 📁 Project Structure

```
MCS/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── core/          # Core configuration
│   │   ├── models/        # SQLAlchemy models
│   │   └── schemas/       # Pydantic schemas
│   ├── alembic/           # Database migrations
│   └── scripts/           # Utility scripts
├── frontend/              # Next.js frontend
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   │   ├── common/        # Reusable UI components
│   │   ├── cameras/       # Camera-specific components
│   │   └── ...
│   ├── hooks/             # React hooks
│   └── lib/               # Utilities (API client, etc.)
├── docs/                  # Documentation
├── scripts/               # Helper scripts
├── docker-compose.yml     # Production Docker Compose
├── docker-compose.dev.yml # Development Docker Compose
└── .env.example           # Environment variables template
```

## ⚙️ Configuration

### Environment Variables

All configuration is done via `.env` file. See `.env.example` for all available options.

**Key variables:**

```bash
# Database
POSTGRES_USER=mcs_user
POSTGRES_PASSWORD=mcs_password
POSTGRES_DB=mcs_db
POSTGRES_PORT=5432

# Backend
BACKEND_PORT=8000
SECRET_KEY=your-secret-key-here

# Frontend
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:8000

# Environment
ENVIRONMENT=development
DEBUG=true
```

### Port Configuration

All ports are configurable via `.env`:

- `POSTGRES_PORT` - Database port (default: 5432)
- `BACKEND_PORT` - Backend API port (default: 8000)
- `FRONTEND_PORT` - Frontend port (default: 3000)

See [docs/port-configuration.md](docs/port-configuration.md) for details.

## 🔧 Development

### Development Mode

Development mode includes:
- **Auto-reload** for backend (Uvicorn `--reload`)
- **Fast Refresh** for frontend (Next.js HMR)
- **Volume mounts** for live code updates

```bash
./scripts/dev.sh
```

### Making Changes

1. **Backend**: Edit files in `backend/` - changes auto-reload
2. **Frontend**: Edit files in `frontend/` - changes hot-reload
3. **Database**: Create migrations with `alembic revision --autogenerate`

### Database Migrations

```bash
# Create a new migration
docker-compose exec backend alembic revision --autogenerate -m "description"

# Apply migrations
docker-compose exec backend alembic upgrade head

# Rollback one migration
docker-compose exec backend alembic downgrade -1
```

### Adding New Features

1. **Backend**: Add routes in `backend/app/api/v1/`
2. **Frontend**: Add pages in `frontend/app/` and components in `frontend/components/`
3. **Components**: Use reusable components from `components/common/`

See [docs/component-architecture.md](docs/component-architecture.md) for component structure.

## 🧪 Testing

### Check Services

```bash
# Check all services are running
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### API Testing

Use the interactive API docs at http://localhost:8000/docs

## 📚 Documentation

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [Windows Development Guide](docs/windows-development-guide.md) - Step-by-step Windows setup
- [Component Architecture](docs/component-architecture.md) - Frontend component structure
- [Port Configuration](docs/port-configuration.md) - Port configuration guide
- [Development Setup](docs/development-setup.md) - Development workflow

## 🐛 Troubleshooting

### Port Already in Use

If you get "port already in use" error:

1. Change the port in `.env`:
   ```bash
   FRONTEND_PORT=3001
   ```

2. Restart services:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Database Connection Issues

1. Check PostgreSQL is running:
   ```bash
   docker-compose ps postgres
   ```

2. Check database URL in `.env` matches container name:
   ```bash
   DATABASE_URL=postgresql://mcs_user:mcs_password@postgres:5432/mcs_db
   ```

### Frontend Can't Connect to Backend

1. Ensure `NEXT_PUBLIC_API_URL` in `.env` uses `localhost`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

2. Check backend is running:
   ```bash
   curl http://localhost:8000/health
   ```

### Authentication Issues

- Clear browser localStorage if token is invalid
- Check token expiration in backend logs
- Re-login if redirected to login page

## 🔐 Security

- **Passwords**: Hashed with bcrypt
- **Tokens**: JWT with configurable expiration
- **CORS**: Configured for frontend origin
- **Environment Variables**: Never commit `.env` file

## 📝 License

[Your License Here]

## 🤝 Contributing

[Contributing Guidelines]

## 📧 Support

[Support Information]
