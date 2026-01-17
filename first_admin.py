#!/usr/bin/env python3
"""
First Admin Setup Script for Event360
Creates the first admin user with secure credentials
"""

import os
import sys
from getpass import getpass

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from server import create_app
from server.extensions import db
from server.models import User, Role

def create_first_admin():
    """Create the first admin user"""
    app = create_app()
    
    with app.app_context():
        try:
            # Ensure roles exist
            Role.create_default_roles()
            
            # Get admin role
            admin_role = Role.query.filter_by(name='admin').first()
            if not admin_role:
                print("❌ Admin role not found. Creating...")
                admin_role = Role(name='admin')
                db.session.add(admin_role)
                db.session.commit()
            
            # Check if admin already exists
            existing_admin = User.query.filter_by(email='admin@event360.com').first()
            if existing_admin:
                print("⚠️  Admin user already exists!")
                print(f"Email: admin@event360.com")
                print("Use the existing credentials or delete the user first.")
                return
            
            # Get admin details
            print("🚀 Creating First Admin for Event360")
            print("=====================================\n")
            
            username = input("Admin Username (default: admin): ").strip() or "admin"
            email = input("Admin Email (default: admin@event360.com): ").strip() or "admin@event360.com"
            
            # Check if email/username already exists
            if User.query.filter_by(email=email).first():
                print(f"❌ Email {email} already exists!")
                return
            
            if User.query.filter_by(username=username).first():
                print(f"❌ Username {username} already exists!")
                return
            
            # Get password
            while True:
                password = getpass("Admin Password (min 8 chars): ")
                if len(password) < 8:
                    print("❌ Password must be at least 8 characters!")
                    continue
                
                confirm_password = getpass("Confirm Password: ")
                if password != confirm_password:
                    print("❌ Passwords don't match!")
                    continue
                break
            
            phone = input("Admin Phone (optional): ").strip() or None
            
            # Create admin user
            admin = User(
                username=username,
                email=email,
                phone=phone,
                role_id=admin_role.id,
                is_active=True
            )
            admin.set_password(password)
            
            db.session.add(admin)
            db.session.commit()
            
            print("\n✅ First admin created successfully!")
            print("====================================")
            print(f"Username: {username}")
            print(f"Email: {email}")
            print(f"Role: admin")
            print(f"Phone: {phone or 'Not provided'}")
            print("\n🔐 Admin Login Endpoints:")
            print("- Regular: POST /api/auth/login")
            print("- Admin: POST /api/auth/admin/login")
            print("\n⚠️  Keep these credentials secure!")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error creating admin: {e}")
            sys.exit(1)

if __name__ == '__main__':
    create_first_admin()