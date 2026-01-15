# server/routes/auth_routes.py
from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from server.extensions import db
from server.auth import token_required, role_required
from server.models import User, Role, Notification
import jwt
import os
import re
from datetime import datetime, timezone, timedelta

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'event360-jwt-secret-2024')

# ========== REGISTRATION ==========
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validation
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    # Email format validation
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, data['email']):
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Password validation
    if len(data['password']) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), 400
    
    # Check existing user
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 400
    
    # Phone validation (if provided)
    if data.get('phone'):
        phone_regex = r'^\+?1?\d{9,15}$'
        if not re.match(phone_regex, data['phone']):
            return jsonify({'error': 'Invalid phone number format'}), 400
    
    # Get default role (attendee)
    default_role = Role.query.filter_by(name='attendee').first()
    if not default_role:
        default_role = Role(name='attendee')
        db.session.add(default_role)
        db.session.commit()
    
    # Create user
    user = User(
        username=data['username'],
        email=data['email'],
        phone=data.get('phone'),
        role_id=default_role.id
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # Create welcome notification
    notification = Notification(
        user_id=user.id,
        title='Welcome to Event360! 🎉',
        message='Your account has been successfully created. Start exploring amazing events!',
        type='welcome'
    )
    db.session.add(notification)
    db.session.commit()
    
    return jsonify({
        'message': 'Registration successful',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role_id': user.role_id
        }
    }), 201

# ========== LOGIN ==========
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'Account is deactivated'}), 403
    
    # Create JWT token
    token = jwt.encode({
        'user_id': user.id,
        'email': user.email,
        'role_id': user.role_id,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }, SECRET_KEY)
    
    # Set session
    session['user_id'] = user.id
    session['token'] = token
    
    # Get user role
    user_role = Role.query.get(user.role_id)
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user_role.name,
            'avatar_url': user.avatar_url
        }
    }), 200

# ========== LOGOUT ==========
@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

# ========== CURRENT USER ==========
@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    from server.auth import token_required, get_current_user as auth_get_current_user
    
    # Use the token_required decorator functionality
    token = None
    if 'Authorization' in request.headers:
        auth_header = request.headers['Authorization']
        if auth_header.startswith('Bearer '):
            token = auth_header.split(" ")[1]
    
    if not token and 'token' in session:
        token = session['token']
    
    if not token:
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = User.query.get(data['user_id'])
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user_role = Role.query.get(user.role_id)
        
        return jsonify({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user_role.name,
                'phone': user.phone,
                'avatar_url': user.avatar_url,
                'created_at': user.created_at.isoformat()
            }
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401