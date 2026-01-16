#!/bin/bash
# docker-entrypoint.sh

echo "Starting application setup..."

# Set Flask app environment variable
export FLASK_APP=run.py  # or app.py - whatever your main file is called

# Run database migrations
echo " Running database migrations..."
flask db upgrade

echo "Starting Gunicorn server..."
exec gunicorn --bind 0.0.0.0:$PORT run:app
