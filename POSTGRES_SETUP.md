# Local PostgreSQL Setup for Event360

This guide covers installing PostgreSQL locally on Ubuntu 24.04 and configuring it for Event360 development.

## Installation Steps

### 1. Install PostgreSQL

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### 2. Start PostgreSQL Service

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Switch to PostgreSQL User

```bash
sudo -i -u postgres
```

### 4. Create Database and User

```bash
psql
```

In the PostgreSQL shell:

```sql
CREATE DATABASE event360_db;
CREATE USER event360_user WITH ENCRYPTED PASSWORD 'event360_pass';
GRANT ALL PRIVILEGES ON DATABASE event360_db TO event360_user;
ALTER DATABASE event360_db OWNER TO event360_user;
GRANT ALL ON SCHEMA public TO event360_user;
```

Exit the PostgreSQL shell:
```sql
\q
```

### 5. Set Environment Variable

Create or update `.env` file in `/home/user/Event_360`:

```bash
cd /home/user/Event_360
echo 'DATABASE_URL=postgresql://event360_user:event360_pass@localhost/event360_db' > .env
```
# Flask Environment
FLASK_ENV=development
FLASK_APP=server:create_app


# Database Configuration
DATABASE_URL=postgresql://event360_user:event360pass@localhost:5432/event360_db


# 
Security Keys
SECRET_KEY=change-me-to-a-long-random-string
JWT_SECRET_KEY=change-me-to-a-long-random-string


# Admin Configuration
ADMIN_EMAIL=admin@event360.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me
# CORS Configuration
CORS_ORIGINS=https://event-360.vercel.app,http://localhost:3000,http://localhost:5173


# Optional: Cloudinary Configuration (if using image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
# Optional: Email Configuration (for notifications)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password


# Optional: Payment Configuration (for future payment integration)
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key


# Development Settings
DEBUG=true

### 6. Run Flask Migrations

```bash
export FLASK_APP=server:create_app
flask db upgrade
```

### 7. Seed the Database (Optional)

```bash
flask seed
```

## Connection Details

- **Host**: localhost
- **Port**: 5432
- **Database**: event360_db
- **Username**: event360_user
- **Password**: event360_password

## Connection String

```
postgresql://event360_user:event360_passw@localhost/event360_db
```

## Troubleshooting

### PostgreSQL Service Status

```bash
sudo systemctl status postgresql
```

### Restart PostgreSQL

```bash
sudo systemctl restart postgresql
```

### Test Connection

```bash
psql -h localhost -U event360_user -d event360_db
```

### View All Databases

```bash
sudo -u postgres psql -c '\l'
```

### View All Users

```bash
sudo -u postgres psql -c '\du'
```

## Switching Between Local and Production

- **Local**: Set `DATABASE_URL` to local PostgreSQL connection string
- **Production (Render)**: `DATABASE_URL` is automatically set by Render from environment variable

## For Development

The Flask config in `server/config.py` already handles:
- Automatic conversion from `postgres://` to `postgresql://`
- Connection pooling
- Database URL fallback (only for production)

After setting up the local database, you can run Flask commands without the DNS resolution error.

