from server import create_app
from server.extensions import db
from server.models import User, Role
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    # Check if admin role exists
    admin_role = Role.query.filter_by(name='admin').first()
    if not admin_role:
        admin_role = Role(name='admin')
        db.session.add(admin_role)
        print("Created admin role")
    
    # Check if admin user exists
    existing_admin = User.query.filter_by(email='admin@eventhub.com').first()
    if existing_admin:
        print("Admin already exists!")
    else:
        # Create admin user
        admin = User(
            username='admin',
            email='admin@eventhub.com',
            phone='+254700000000',
            role_id=admin_role.id,
            is_active=True
        )
        admin.password_hash = generate_password_hash('Admin123!')
        
        db.session.add(admin)
        db.session.commit()
        print("First admin created successfully!")
        print("Email: admin@eventhub.com")
        print("Password: Admin123!")