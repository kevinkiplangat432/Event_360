# server/auth.py
from flask import request, jsonify
from functools import wraps
import jwt
import os
from datetime import datetime, timezone
from .models import User, Role

SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'event360-jwt-secret-2024')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check for token in Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'error': 'Authentication required'}), 401
        
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
                
            request.current_user = current_user
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    
    return decorated

def role_required(*required_roles):
    def decorator(f):
        @wraps(f)
        @token_required
        def decorated(*args, **kwargs):
            user_role = Role.query.get(request.current_user.role_id)
            
            if user_role.name not in required_roles:
                return jsonify({'error': 'Unauthorized access!'}), 403
            
            return f(*args, **kwargs)
        return decorated
    return decorator