# routes/registration_routes.py
from flask import Blueprint, request, jsonify
from extensions import db
from models import EventRegistration, Event, User
from datetime import datetime

registration_bp = Blueprint('registrations', __name__, url_prefix='/api/registrations')

# GET all registrations for current user
@registration_bp.route('', methods=['GET'])
def get_user_registrations():
    # TODO: Get current user from session/JWT
    user_id = request.args.get('user_id')  # Temporary, replace with auth
    
    registrations = EventRegistration.query.filter_by(user_id=user_id).all()
    
    return jsonify([{
        'id': reg.id,
        'event_id': reg.event_id,
        'event_title': reg.event.title,
        'quantity': reg.quantity,
        'registered_at': reg.registered_at.isoformat()
    } for reg in registrations]), 200

# POST - Create new registration
@registration_bp.route('', methods=['POST'])
def create_registration():
    data = request.get_json()
    
    # Validation
    if not data.get('user_id') or not data.get('event_id') or not data.get('quantity'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if data['quantity'] <= 0 or data['quantity'] > 10:
        return jsonify({'error': 'Quantity must be between 1 and 10'}), 400
    
    # Check if event exists and is approved
    event = Event.query.get(data['event_id'])
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    
    if event.status != 'approved':
        return jsonify({'error': 'Event is not approved yet'}), 400
    
    # Check if user already registered
    existing = EventRegistration.query.filter_by(
        user_id=data['user_id'],
        event_id=data['event_id']
    ).first()
    
    if existing:
        return jsonify({'error': 'Already registered for this event'}), 400
    
    # Create registration
    registration = EventRegistration(
        user_id=data['user_id'],
        event_id=data['event_id'],
        quantity=data['quantity']
    )
    
    db.session.add(registration)
    db.session.commit()
    
    return jsonify({
        'id': registration.id,
        'message': 'Successfully registered for event'
    }), 201

# DELETE - Cancel registration
@registration_bp.route('/<int:id>', methods=['DELETE'])
def cancel_registration(id):
    registration = EventRegistration.query.get(id)
    
    if not registration:
        return jsonify({'error': 'Registration not found'}), 404
    
    # Check if event hasn't started yet
    if registration.event.start_time < datetime.utcnow():
        return jsonify({'error': 'Cannot cancel registration for past events'}), 400
    
    db.session.delete(registration)
    db.session.commit()
    
    return jsonify({'message': 'Registration cancelled successfully'}), 200