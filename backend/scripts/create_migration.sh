#!/bin/bash
# Helper script to create a new Alembic migration

if [ -z "$1" ]; then
    echo "Usage: ./create_migration.sh <migration_message>"
    echo "Example: ./create_migration.sh 'Add new field to users table'"
    exit 1
fi

docker-compose exec backend alembic revision --autogenerate -m "$1"

