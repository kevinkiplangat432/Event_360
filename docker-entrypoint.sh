#!/bin/bash
echo "Starting application setup..."

export FLASK_APP=run.py  

echo "Running database migrations..."
flask db upgrade

echo "Creating admin user..."
python3 -c "
from server import create_app
from server.extensions import db
from server.models import Role, User

app = create_app()
with app.app_context():
    Role.create_default_roles()
    
    admin_role = Role.query.filter_by(name='admin').first()
    existing_admin = User.query.filter_by(email='admin@eventhub.com').first()
    
    if not existing_admin:
        admin = User(
            username='admin',
            email='admin@eventhub.com',
            role_id=admin_role.id,
            is_active=True
        )
        admin.set_password('admin123!')
        db.session.add(admin)
        db.session.commit()
        print('✅ Admin user created: admin@eventhub.com')
    else:
        print('ℹ️ Admin user already exists')
"

echo "Starting Gunicorn server..."
exec gunicorn --bind 0.0.0.0:$PORT run:app