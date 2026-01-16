#!/bin/bash
# docker-entrypoint.sh

echo "🚀 Starting application setup..."

# Run database migrations
echo "🔧 Running database migrations..."
flask db upgrade

echo "▶️ Starting Gunicorn server..."
exec gunicorn --bind 0.0.0.0:$PORT run:app
