#!/usr/bin/env python3
"""
Database Check and Fix Script
"""

import os
import sys

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from server import create_app
from server.extensions import db
from server.models import Role, User

def check_and_fix_database():
    """Check database and fix issues"""
    app = create_app()
    
    with app.app_context():
        try:
            print("🔍 Checking database...")
            
            # Check if tables exist
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"📋 Found tables: {tables}")
            
            if 'roles' not in tables:
                print("❌ Roles table missing! Creating tables...")
                db.create_all()
                print("✅ Tables created!")
            
            # Check roles
            roles_count = Role.query.count()
            print(f"👥 Found {roles_count} roles")
            
            if roles_count == 0:
                print("📝 Creating default roles...")
                roles_data = [
                    {'name': 'attendee'},
                    {'name': 'organizer'}, 
                    {'name': 'admin'}
                ]
                
                for role_data in roles_data:
                    role = Role(name=role_data['name'])
                    db.session.add(role)
                
                db.session.commit()
                print("✅ Default roles created!")
            else:
                print("📋 Existing roles:")
                for role in Role.query.all():
                    print(f"   - {role.name} (ID: {role.id})")
            
            # Check admin user
            admin_user = User.query.filter_by(email='admin@event360.com').first()
            if not admin_user:
                print("👤 Creating admin user...")
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
                print("✅ Admin user created!")
            else:
                print(f"👤 Admin user exists: {admin_user.email}")
            
            print("\n🎉 Database is ready!")
            print("🌐 Try your signup again!")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == '__main__':
    check_and_fix_database()