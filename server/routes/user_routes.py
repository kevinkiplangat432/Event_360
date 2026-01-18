from flask import Blueprint, request, jsonify
from server.extensions import db
from server.models import User, Role, Notification, Event, Order, Review, Wishlist
from server.auth import token_required, role_required
import re

user_bp = Blueprint('users', __name__, url_prefix='/api/users')

@user_bp.route('', methods=['GET'])
@token_required
@role_required('admin')
def get_all_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

@user_bp.route('/<int:user_id>', methods=['GET'])
@token_required
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    
    if request.current_user.id != user_id and request.current_user.role.name != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify(user.to_dict()), 200

@user_bp.route('/<int:user_id>', methods=['PUT'])
@token_required
def update_user(user_id):
    if request.current_user.id != user_id and request.current_user.role.name != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if 'username' in data:
        # Check if username is unique
        existing = User.query.filter(User.username == data['username'], User.id != user_id).first()
        if existing:
            return jsonify({'error': 'Username already taken'}), 400
        user.username = data['username']
    
    if 'email' in data:
        # Email validation
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Check if email is unique
        existing = User.query.filter(User.email == data['email'], User.id != user_id).first()
        if existing:
            return jsonify({'error': 'Email already registered'}), 400
        user.email = data['email']
    
    if 'phone' in data:
        if data['phone']:
            phone_regex = r'^\+?1?\d{9,15}$'
            if not re.match(phone_regex, data['phone']):
                return jsonify({'error': 'Invalid phone number format'}), 400
        user.phone = data['phone']
    
    if 'avatar_url' in data:
        user.avatar_url = data['avatar_url']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict()
    }), 200

@user_bp.route('/<int:user_id>/change-password', methods=['PUT'])
@token_required
def change_password(user_id):
    if request.current_user.id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    if not data.get('current_password') or not data.get('new_password'):
        return jsonify({'error': 'Current and new password required'}), 400
    
    user = User.query.get_or_404(user_id)
    
    # Verify current password
    if not user.check_password(data['current_password']):
        return jsonify({'error': 'Current password is incorrect'}), 400
    
    # Validate new password
    if len(data['new_password']) < 8:
        return jsonify({'error': 'New password must be at least 8 characters'}), 400
    
    # Set new password
    user.set_password(data['new_password'])
    db.session.commit()
    
    # Create notification
    notification = Notification(
        user_id=user.id,
        title='Password Changed',
        message='Your password has been successfully changed.',
        type='security'
    )
    db.session.add(notification)
    db.session.commit()
    
    return jsonify({'message': 'Password changed successfully'}), 200

@user_bp.route('/<int:user_id>/events', methods=['GET'])
@token_required
def get_user_events(user_id):
    if request.current_user.id != user_id and request.current_user.role.name != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    events = Event.query.filter_by(organizer_id=user_id).all()
    return jsonify([event.to_dict() for event in events]), 200

@user_bp.route('/<int:user_id>/orders', methods=['GET'])
@token_required
def get_user_orders(user_id):
    if request.current_user.id != user_id and request.current_user.role.name != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    orders = Order.query.filter_by(user_id=user_id).all()
    
    orders_data = []
    for order in orders:
        order_data = {
            'id': order.id,
            'reference': order.reference,
            'total_amount': float(order.total_amount),
            'payment_status': order.payment_status,
            'order_status': order.order_status,
            'created_at': order.created_at.isoformat(),
            'event': {
                'id': order.event.id,
                'title': order.event.title,
                'start_time': order.event.start_time.isoformat()
            }
        }
        orders_data.append(order_data)
    
    return jsonify(orders_data), 200

@user_bp.route('/<int:user_id>/wishlist', methods=['GET'])
@token_required
def get_user_wishlist(user_id):
    if request.current_user.id != user_id and request.current_user.role.name != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    wishlist_items = Wishlist.query.filter_by(user_id=user_id).all()
    
    wishlist_data = []
    for item in wishlist_items:
        wishlist_data.append({
            'id': item.id,
            'event': item.event.to_dict(),
            'added_at': item.created_at.isoformat()
        })
    
    return jsonify(wishlist_data), 200

@user_bp.route('/<int:user_id>/notifications', methods=['GET'])
@token_required
def get_user_notifications(user_id):
    if request.current_user.id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    
    notifications_data = []
    for notification in notifications:
        notifications_data.append({
            'id': notification.id,
            'title': notification.title,
            'message': notification.message,
            'type': notification.type,
            'is_read': notification.is_read,
            'created_at': notification.created_at.isoformat()
        })
    
    return jsonify(notifications_data), 200

@user_bp.route('/<int:user_id>/notifications/<int:notification_id>/read', methods=['PUT'])
@token_required
def mark_notification_read(user_id, notification_id):
    if request.current_user.id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first()
    if not notification:
        return jsonify({'error': 'Notification not found'}), 404
    
    notification.is_read = True
    db.session.commit()
    
    return jsonify({'message': 'Notification marked as read'}), 200