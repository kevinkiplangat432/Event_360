# server/seed/seed_data.py
from server.extensions import db
from server.models import Role, User
from werkzeug.security import generate_password_hash
from datetime import datetime

def seed_database():
    """Seed the database with initial data"""
    print("🌱 Seeding database...")
    
    # Create roles
    roles = ['admin', 'organizer', 'attendee']
    for role_name in roles:
        role = Role.query.filter_by(name=role_name).first()
        if not role:
            role = Role(name=role_name)
            db.session.add(role)
            print(f"   Created role: {role_name}")
    
    db.session.commit()
    
    # Create admin user if not exists
    admin_email = 'admin@event360.com'
    admin_user = User.query.filter_by(email=admin_email).first()
    if not admin_user:
        admin_role = Role.query.filter_by(name='admin').first()
        admin_user = User(
            username='admin',
            email=admin_email,
            phone='+254700000000',
            role_id=admin_role.id,
            is_active=True,
            created_at=datetime.utcnow()
        )
        admin_user.set_password('Admin123!')
        db.session.add(admin_user)
        print(f"   Created admin user: {admin_email}")
    
    # Create test organizer
    organizer_email = 'organizer@event360.com'
    organizer_user = User.query.filter_by(email=organizer_email).first()
    if not organizer_user:
        organizer_role = Role.query.filter_by(name='organizer').first()
        organizer_user = User(
            username='eventorganizer',
            email=organizer_email,
            phone='+254711111111',
            role_id=organizer_role.id,
            is_active=True,
            created_at=datetime.utcnow()
        )
        organizer_user.set_password('Organizer123!')
        db.session.add(organizer_user)
        print(f"   Created organizer user: {organizer_email}")
    
    # Create test attendee
    attendee_email = 'attendee@event360.com'
    attendee_user = User.query.filter_by(email=attendee_email).first()
    if not attendee_user:
        attendee_role = Role.query.filter_by(name='attendee').first()
        attendee_user = User(
            username='eventlover',
            email=attendee_email,
            phone='+254722222222',
            role_id=attendee_role.id,
            is_active=True,
            created_at=datetime.utcnow()
        )
        attendee_user.set_password('Attendee123!')
        db.session.add(attendee_user)
        print(f"   Created attendee user: {attendee_email}")
    
    db.session.commit()