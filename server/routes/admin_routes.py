# server/routes/admin_routes.py
from flask import Blueprint, request, jsonify
from server.extensions import db
from server.models import Event, EventApproval, User, Role, Notification, Order
from server.auth import token_required, role_required
from datetime import datetime, timezone

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')
@admin_bp.route('/create-first-admin', methods=['POST'])
def create_first_admin():
    """Create the first admin account if no admin exists"""
    try:
        # Check if any admin exists
        admin_role = Role.query.filter_by(name='admin').first()
        if not admin_role:
            admin_role = Role(name='admin')
            db.session.add(admin_role)
            db.session.flush()
        
        existing_admins = User.query.filter_by(role_id=admin_role.id).count()
        
        if existing_admins > 0:
            return jsonify({'error': 'Admin account already exists'}), 400
        
        data = request.get_json()
        
        # Create admin user
        admin = User(
            username=data.get('username', 'admin'),
            email=data.get('email', 'admin@eventhub.com'),
            role_id=admin_role.id,
            is_active=True
        )
        admin.set_password(data.get('password', 'Admin123!'))
        
        db.session.add(admin)
        db.session.commit()
        
        return jsonify({
            'message': 'First admin account created successfully',
            'user': {
                'id': admin.id,
                'username': admin.username,
                'email': admin.email,
                'role': 'admin'
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/seed-database', methods=['POST'])
@token_required
@role_required('admin')
def seed_database():
    """Seed database with sample data"""
    try:
        # Create categories if they don't exist
        categories = ['Technology', 'Music', 'Art', 'Sports', 'Food', 'Business', 'Education', 'Workshop', 'Conference', 'Networking']
        
        # Create sample events
        sample_events = [
            {
                'title': 'Tech Conference Nairobi 2024',
                'description': 'Annual technology conference featuring industry leaders, workshops, and networking opportunities.',
                'venue': 'KICC',
                'address': 'Harambee Avenue',
                'city': 'Nairobi',
                'country': 'Kenya',
                'start_time': datetime.now(timezone.utc) + timedelta(days=30),
                'end_time': datetime.now(timezone.utc) + timedelta(days=30, hours=9),
                'category': 'Technology',
                'capacity': 500,
                'poster_url': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop',
                'organizer_id': request.current_user.id,
                'status': 'approved'
            },
            {
                'title': 'Mombasa Music Festival',
                'description': 'Three days of live music, food, and entertainment on the beautiful Mombasa coast.',
                'venue': 'Bamburi Beach',
                'address': 'Mombasa-Malindi Road',
                'city': 'Mombasa',
                'country': 'Kenya',
                'start_time': datetime.now(timezone.utc) + timedelta(days=15),
                'end_time': datetime.now(timezone.utc) + timedelta(days=17),
                'category': 'Music',
                'capacity': 2000,
                'poster_url': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop',
                'organizer_id': request.current_user.id,
                'status': 'approved'
            }
        ]
        
        created_events = []
        
        for event_data in sample_events:
            event = Event(**event_data)
            db.session.add(event)
            db.session.flush()
            created_events.append(event.to_dict())
        
        db.session.commit()
        
        return jsonify({
            'message': 'Database seeded successfully',
            'events_created': len(created_events),
            'events': created_events
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
@admin_bp.route('/events/pending', methods=['GET'])
@token_required
@role_required('admin')
def get_pending_events():
    pending_events = Event.query.filter_by(status='pending').all()
    
    events_data = []
    for event in pending_events:
        event_data = event.to_dict()
        event_data['organizer'] = {
            'id': event.organizer.id,
            'username': event.organizer.username,
            'email': event.organizer.email
        }
        events_data.append(event_data)
    
    return jsonify(events_data), 200

@admin_bp.route('/events/<int:event_id>/approve', methods=['POST'])
@token_required
@role_required('admin')
def approve_event(event_id):
    event = Event.query.get_or_404(event_id)
    data = request.get_json()
    
    if event.status != 'pending':
        return jsonify({'error': 'Event is not pending approval'}), 400
    
    action = data.get('action')  # approve or reject
    comment = data.get('comment', '')
    
    if action not in ['approve', 'reject']:
        return jsonify({'error': 'Action must be either "approve" or "reject"'}), 400
    
    # Update event status
    event.status = 'approved' if action == 'approve' else 'rejected'
    event.updated_at = datetime.now(timezone.utc)
    
    # Create approval record
    approval = EventApproval(
        event_id=event_id,
        admin_id=request.current_user.id,
        status=event.status,
        comment=comment
    )
    
    db.session.add(approval)
    
    # Create notification for organizer
    notification = Notification(
        user_id=event.organizer_id,
        title=f'Event {event.status.capitalize()}',
        message=f'Your event "{event.title}" has been {event.status}. {comment}',
        type=f'event_{event.status}'
    )
    db.session.add(notification)
    
    db.session.commit()
    
    return jsonify({
        'message': f'Event {event.status} successfully',
        'event': event.to_dict()
    }), 200

@admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@token_required
@role_required('admin')
def update_user_role(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    role_name = data.get('role')
    if not role_name:
        return jsonify({'error': 'Role is required'}), 400
    
    # Convert to lowercase to match database
    role_name = role_name.lower()
    
    role = Role.query.filter_by(name=role_name).first()
    if not role:
        return jsonify({'error': 'Invalid role'}), 400
    
    # Cannot change admin's own role
    if user.id == request.current_user.id and role_name != 'admin':
        return jsonify({'error': 'Cannot change your own admin role'}), 403
    
    old_role = Role.query.get(user.role_id)
    user.role_id = role.id
    db.session.commit()
    
    # Create notification for user
    notification = Notification(
        user_id=user.id,
        title='Role Updated',
        message=f'Your role has been changed from {old_role.name} to {role.name}',
        type='role_change'
    )
    db.session.add(notification)
    db.session.commit()
    
    return jsonify({
        'message': f'User role updated to {role_name}',
        'user': user.to_dict()
    }), 200

@admin_bp.route('/users/<int:user_id>/status', methods=['PUT'])
@token_required
@role_required('admin')
def toggle_user_status(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    status = data.get('status')
    if status not in [True, False]:
        return jsonify({'error': 'Status must be true or false'}), 400
    
    # Cannot deactivate yourself
    if user.id == request.current_user.id and status == False:
        return jsonify({'error': 'Cannot deactivate your own account'}), 403
    
    user.is_active = status
    db.session.commit()
    
    action = 'activated' if status else 'deactivated'
    notification = Notification(
        user_id=user.id,
        title='Account Status Changed',
        message=f'Your account has been {action} by an administrator',
        type='account_status'
    )
    db.session.add(notification)
    db.session.commit()
    
    return jsonify({
        'message': f'User account {action}',
        'user': user.to_dict()
    }), 200

@admin_bp.route('/orders', methods=['GET'])
@token_required
@role_required('admin')
def get_all_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    
    orders_data = []
    for order in orders:
        order_data = {
            'id': order.id,
            'reference': order.reference,
            'user': {
                'id': order.user.id,
                'username': order.user.username,
                'email': order.user.email
            },
            'event': {
                'id': order.event.id,
                'title': order.event.title
            },
            'total_amount': float(order.total_amount),
            'payment_status': order.payment_status,
            'order_status': order.order_status,
            'created_at': order.created_at.isoformat()
        }
        orders_data.append(order_data)
    
    return jsonify(orders_data), 200

@admin_bp.route('/statistics', methods=['GET'])
@token_required
@role_required('admin')
def get_statistics():
    # User statistics
    total_users = User.query.count()
    active_users = User.query.filter_by(is_active=True).count()
    
    # Role distribution
    roles = Role.query.all()
    role_distribution = {}
    for role in roles:
        count = User.query.filter_by(role_id=role.id).count()
        role_distribution[role.name] = count
    
    # Event statistics
    total_events = Event.query.count()
    approved_events = Event.query.filter_by(status='approved').count()
    pending_events = Event.query.filter_by(status='pending').count()
    
    # Order statistics
    total_orders = Order.query.count()
    completed_orders = Order.query.filter_by(payment_status='completed').count()
    total_revenue_result = db.session.query(db.func.sum(Order.total_amount)).filter_by(payment_status='completed').first()
    total_revenue = float(total_revenue_result[0]) if total_revenue_result[0] else 0
    
    return jsonify({
        'users': {
            'total': total_users,
            'active': active_users,
            'by_role': role_distribution
        },
        'events': {
            'total': total_events,
            'approved': approved_events,
            'pending': pending_events,
            'rejected': Event.query.filter_by(status='rejected').count(),
            'cancelled': Event.query.filter_by(status='cancelled').count()
        },
        'orders': {
            'total': total_orders,
            'completed': completed_orders,
            'revenue': total_revenue
        }
    }), 200