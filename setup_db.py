#!/usr/bin/env python3
"""
Database Setup Script for Event360
Creates all tables and initial data
"""

import os
import sys

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from server import create_app
from server.extensions import db
from server.models import Role, User

def setup_database():
    """Setup database tables and initial data"""
    app = create_app()
    
    with app.app_context():
        try:
            print("🚀 Setting up Event360 Database...")
            
            # Drop all tables (if they exist)
            print("📋 Dropping existing tables...")
            db.drop_all()
            
            # Create all tables
            print("🏗️  Creating database tables...")
            db.create_all()
            
            # Create default roles
            print("👥 Creating default roles...")
            roles_data = [
                {'name': 'user'},
                {'name': 'organizer'}, 
                {'name': 'admin'}
            ]
            
            for role_data in roles_data:
                role = Role(name=role_data['name'])
                db.session.add(role)
            
            db.session.commit()
            print("✅ Roles created successfully!")
            
            # Create first admin
            admin_role = Role.query.filter_by(name='admin').first()
            
            admin = User(
                username='admin',
                email='admin@event360.com',
                role_id=admin_role.id,
                is_active=True
            )
            admin.set_password('Event360Admin2024!')
            
            db.session.add(admin)
            db.session.commit()
            
            print("✅ Database setup completed successfully!")
            print("📊 Tables created:")
            print("   - roles")
            print("   - users") 
            print("   - events")
            print("   - orders")
            print("   - tickets")
            print("   - payments")
            print("   - and more...")
            
            print("\n🔐 Admin Account Created:")
            print("   Email: admin@event360.com")
            print("   Password: Event360Admin2024!")
            print("   Role: admin")
            
            print("\n🌐 API Endpoints:")
            print("   - Register: POST /api/auth/register")
            print("   - Login: POST /api/auth/login")
            print("   - Admin Login: POST /api/auth/admin/login")
            
        except Exception as e:
            print(f"❌ Database setup failed: {e}")
            sys.exit(1)

if __name__ == '__main__':
    setup_database()