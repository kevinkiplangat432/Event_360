#!/usr/bin/env python3
"""
Quick Admin Setup for Event360 Production
Creates admin with environment variables
"""

import os
import sys

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from server import create_app
from server.extensions import db
from server.models import User, Role

def create_admin_from_env():
    """Create admin from environment variables"""
    app = create_app()
    
    with app.app_context():
        try:
            # Ensure roles exist
            Role.create_default_roles()
            
            # Get admin credentials from environment
            admin_email = os.environ.get('ADMIN_EMAIL', 'admin@event360.com')
            admin_password = os.environ.get('ADMIN_PASSWORD', 'Event360Admin2024!')
            admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
            
            # Check if admin already exists
            existing_admin = User.query.filter_by(email=admin_email).first()
            if existing_admin:
                print(f"✅ Admin user already exists: {admin_email}")
                return
            
            # Get admin role
            admin_role = Role.query.filter_by(name='admin').first()
            if not admin_role:
                print("❌ Admin role not found!")
                return
            
            # Create admin user
            admin = User(
                username=admin_username,
                email=admin_email,
                role_id=admin_role.id,
                is_active=True
            )
            admin.set_password(admin_password)
            
            db.session.add(admin)
            db.session.commit()
            
            print("✅ Admin created successfully!")
            print(f"Email: {admin_email}")
            print(f"Username: {admin_username}")
            print("🔐 Use /api/auth/admin/login endpoint")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error creating admin: {e}")
            sys.exit(1)

if __name__ == '__main__':
    create_admin_from_env()