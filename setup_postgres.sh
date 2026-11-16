#!/bin/bash

# Event360 PostgreSQL Setup Script
# This script installs PostgreSQL and sets up the database for local development

set -e  # Exit on error

echo "========================================="
echo "  Event360 Local PostgreSQL Setup"
echo "========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script with sudo:"
    echo "  sudo ./setup_postgres.sh"
    exit 1
fi

echo "[1/7] Updating package lists..."
apt-get update -qq

echo "[2/7] Installing PostgreSQL..."
apt-get install -y postgresql postgresql-contrib > /dev/null 2>&1

echo "[3/7] Starting PostgreSQL service..."
systemctl start postgresql
systemctl enable postgresql

echo "[4/7] Creating database and user..."
# Switch to postgres user and run commands
su - postgres -c "psql -c \"CREATE DATABASE event360_db;\" 2>/dev/null || true"
su - postgres -c "psql -c \"CREATE USER event360_user WITH ENCRYPTED PASSWORD 'event360_password';\" 2>/dev/null || true"
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE event360_db TO event360_user;\""
su - postgres -c "psql -c \"ALTER DATABASE event360_db OWNER TO event360_user;\""
su - postgres -c "psql -c \"GRANT ALL ON SCHEMA public TO event360_user;\""

echo "[5/7] Creating .env file..."
# Get the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ENV_FILE="$SCRIPT_DIR/.env"

cat > "$ENV_FILE" << 'EOF'
# Database Configuration
# Use local PostgreSQL for development
DATABASE_URL=postgresql://event360_user:event360_password@localhost/event360_db

# Security Keys
SECRET_KEY=change-me-to-a-long-random-string
JWT_SECRET_KEY=change-me-to-a-long-random-string

# Flask Environment
FLASK_ENV=development

# Admin User (created on first run)
ADMIN_EMAIL=admin@event360.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
EOF

echo "[6/7] Verifying PostgreSQL connection..."
PGPASSWORD=event360_password psql -h localhost -U event360_user -d event360_db -c "SELECT 1;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✓ Database connection successful!"
else
    echo "   ✗ Database connection failed. Please check the configuration."
    exit 1
fi

echo ""
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "Database Details:"
echo "  - Host: localhost"
echo "  - Port: 5432"
echo "  - Database: event360_db"
echo "  - Username: event360_user"
echo "  - Password: event360_password"
echo ""
echo "Next Steps:"
echo "  1. Activate virtual environment:"
echo "     source venv/bin/activate"
echo ""
echo "  2. Run database migrations:"
echo "     export FLASK_APP=server:create_app"
echo "     flask db upgrade"
echo ""
echo "  3. (Optional) Seed the database:"
echo "     python -c \"from server.seed.seed_data import seed_database; seed_database()\""
echo ""
echo "  4. Start the Flask server:"
echo "     flask run"
echo ""

