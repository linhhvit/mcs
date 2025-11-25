#!/bin/bash
# Helper script to apply Alembic migrations

echo "Applying database migrations..."
docker-compose exec backend alembic upgrade head

if [ $? -eq 0 ]; then
    echo "✓ Migrations applied successfully!"
else
    echo "✗ Failed to apply migrations"
    exit 1
fi

