# server/routes/registration_routes.py
from flask import Blueprint, request, jsonify
from server.extensions import db
from server.models import EventRegistration, Event, User, Notification
from server.auth import token_required, role_required
from datetime import datetime, timezone

registration_bp = Blueprint('registrations', __name__, url_prefix='/api/registrations')

# GET all registrations for current user
@registration_bp.route('', methods=['GET'])
@token_required
def get_user_registrations():
    user_id = request.current_user.id
    
    registrations = EventRegistration.query.filter_by(user_id=user_id).order_by(EventRegistration.registered_at.desc()).all()
    
    registrations_data = []
    for reg in registrations:
        registrations_data.append({
            'id': reg.id,
            'event': {
                'id': reg.event.id,
                'title': reg.event.title,
                'start_time': reg.event.start_time.isoformat(),
                'venue': reg.event.venue,
                'city': reg.event.city,
                'status': reg.event.status
            },
            'quantity': reg.quantity,
            'registration_type': reg.registration_type,
            'notes': reg.notes,
            'registered_at': reg.registered_at.isoformat(),
            'has_order': any(order.payment_status == 'completed' for order in reg.user.orders if order.event_id == reg.event_id)
        })
    
    return jsonify(registrations_data), 200

# POST - Create new registration
@registration_bp.route('', methods=['POST'])
@token_required
def create_registration():
    data = request.get_json()
    
    event_id = data.get('event_id')
    quantity = data.get('quantity', 1)
    registration_type = data.get('registration_type', 'general')
    notes = data.get('notes')
    
    # Validation
    if not event_id:
        return jsonify({'error': 'Event ID is required'}), 400
    
    # Number validation for quantity
    try:
        quantity = int(quantity)
        if quantity <= 0 or quantity > 20:  # Increased limit for group registrations
            return jsonify({'error': 'Quantity must be between 1 and 20'}), 400
    except ValueError:
        return jsonify({'error': 'Quantity must be a valid number'}), 400
    
    # Check if event exists and is approved
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    
    if event.status != 'approved':
        return jsonify({'error': 'Event is not approved yet'}), 400
    
    # Check if event is full (if capacity is set)
    if event.capacity:
        total_registered = sum(reg.quantity for reg in event.registrations)
        if total_registered + quantity > event.capacity:
            return jsonify({'error': 'Event is at full capacity'}), 400
    
    # Check if user already registered
    existing = EventRegistration.query.filter_by(
        user_id=request.current_user.id,
        event_id=event_id
    ).first()
    
    if existing:
        # Update existing registration
        existing.quantity = quantity
        existing.registration_type = registration_type
        existing.notes = notes
        existing.updated_at = datetime.now(timezone.utc)
        
        db.session.commit()
        
        return jsonify({
            'id': existing.id,
            'message': 'Registration updated successfully'
        }), 200
    
    # Create new registration
    registration = EventRegistration(
        user_id=request.current_user.id,
        event_id=event_id,
        quantity=quantity,
        registration_type=registration_type,
        notes=notes
    )
    
    db.session.add(registration)
    
    # Create notification
    notification = Notification(
        user_id=request.current_user.id,
        title='Registration Successful',
        message=f'You have successfully registered for "{event.title}".',
        type='registration_success'
    )
    db.session.add(notification)
    
    # Notify event organizer
    organizer_notification = Notification(
        user_id=event.organizer_id,
        title='New Registration',
        message=f'{request.current_user.username} registered for your event "{event.title}".',
        type='new_registration'
    )
    db.session.add(organizer_notification)
    
    db.session.commit()
    
    return jsonify({
        'id': registration.id,
        'message': 'Successfully registered for event',
        'requires_payment': True,  # Indicate that payment is needed
        'next_step': 'proceed_to_checkout'
    }), 201

# DELETE - Cancel registration
@registration_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def cancel_registration(id):
    registration = EventRegistration.query.get_or_404(id)
    
    # Check ownership
    if registration.user_id != request.current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Check if user has already paid (has an order)
    has_paid_order = any(
        order.payment_status == 'completed' 
        for order in request.current_user.orders 
        if order.event_id == registration.event_id
    )
    
    if has_paid_order:
        return jsonify({'error': 'Cannot cancel registration with paid tickets. Please cancel your order instead.'}), 400
    
    # Check if event hasn't started yet
    if registration.event.start_time < datetime.now(timezone.utc):
        return jsonify({'error': 'Cannot cancel registration for past events'}), 400
    
    db.session.delete(registration)
    db.session.commit()
    
    # Create notification
    notification = Notification(
        user_id=request.current_user.id,
        title='Registration Cancelled',
        message=f'Your registration for "{registration.event.title}" has been cancelled.',
        type='registration_cancelled'
    )
    db.session.add(notification)
    db.session.commit()
    
    return jsonify({'message': 'Registration cancelled successfully'}), 200

# GET - Get registration by ID
@registration_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_registration(id):
    registration = EventRegistration.query.get_or_404(id)
    
    # Check ownership or organizer/admin
    if registration.user_id != request.current_user.id:
        # Check if user is organizer
        if registration.event.organizer_id != request.current_user.id and request.current_user.role.name != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({
        'id': registration.id,
        'user': {
            'id': registration.user.id,
            'username': registration.user.username,
            'email': registration.user.email
        },
        'event': registration.event.to_dict(),
        'quantity': registration.quantity,
        'registration_type': registration.registration_type,
        'notes': registration.notes,
        'registered_at': registration.registered_at.isoformat()
    }), 200