# server/routes/event_routes.py
from flask import Blueprint, request, jsonify
from server.extensions import db
from server.models import Event, User, EventApproval, TicketType, Review, Wishlist, EventRegistration
from server.auth import token_required, role_required
from datetime import datetime, timezone
import re

event_bp = Blueprint('events', __name__, url_prefix='/api/events')

# ========== GET ALL EVENTS (Public) ==========
@event_bp.route('', methods=['GET'])
def get_all_events():
    # Get query parameters
    category = request.args.get('category')
    status = request.args.get('status', 'approved')  # Default to approved events
    city = request.args.get('city')
    upcoming = request.args.get('upcoming', 'true').lower() == 'true'
    
    # Build query
    query = Event.query
    
    if status:
        query = query.filter_by(status=status)
    
    if category:
        query = query.filter_by(category=category)
    
    if city:
        query = query.filter_by(city=city)
    
    if upcoming:
        query = query.filter(Event.start_time > datetime.now(timezone.utc))
    
    # Sort by date
    query = query.order_by(Event.start_time.asc())
    
    events = query.all()
    return jsonify([event.to_dict() for event in events]), 200

# ========== GET EVENT BY ID (Public) ==========
@event_bp.route('/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get_or_404(event_id)
    
    # Get ticket types
    ticket_types = TicketType.query.filter_by(event_id=event_id, is_active=True).all()
    
    # Get reviews with user info
    reviews = Review.query.filter_by(event_id=event_id).all()
    
    event_data = event.to_dict()
    event_data['ticket_types'] = [{
        'id': tt.id,
        'name': tt.name,
        'description': tt.description,
        'price': float(tt.price),
        'available_quantity': tt.available_quantity,
        'sale_start': tt.sale_start.isoformat() if tt.sale_start else None,
        'sale_end': tt.sale_end.isoformat() if tt.sale_end else None,
        'max_per_user': tt.max_per_user
    } for tt in ticket_types]
    
    event_data['reviews'] = [{
        'id': review.id,
        'user': {
            'id': review.user.id,
            'username': review.user.username,
            'avatar_url': review.user.avatar_url
        },
        'rating': review.rating,
        'comment': review.comment,
        'created_at': review.created_at.isoformat()
    } for review in reviews]
    
    # Calculate average rating
    if reviews:
        avg_rating = sum(review.rating for review in reviews) / len(reviews)
        event_data['average_rating'] = round(avg_rating, 1)
        event_data['review_count'] = len(reviews)
    else:
        event_data['average_rating'] = 0
        event_data['review_count'] = 0
    
    return jsonify(event_data), 200

# ========== CREATE EVENT (Organizer only) ==========
@event_bp.route('', methods=['POST'])
@token_required
@role_required('organizer', 'admin')
def create_event():
    data = request.get_json()
    
    # Required fields validation
    required_fields = ['title', 'description', 'venue', 'start_time', 'end_time', 'category']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    # Date validation
    try:
        start_time = datetime.fromisoformat(data['start_time'].replace('Z', '+00:00'))
        end_time = datetime.fromisoformat(data['end_time'].replace('Z', '+00:00'))
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use ISO format'}), 400
    
    if start_time >= end_time:
        return jsonify({'error': 'End time must be after start time'}), 400
    
    if start_time < datetime.now(timezone.utc):
        return jsonify({'error': 'Start time cannot be in the past'}), 400
    
    # Capacity validation
    capacity = data.get('capacity')
    if capacity is not None and capacity <= 0:
        return jsonify({'error': 'Capacity must be a positive number'}), 400
    
    # Price validation for ticket types (if provided)
    ticket_types = data.get('ticket_types', [])
    for tt in ticket_types:
        if tt.get('price') is not None and float(tt['price']) < 0:
            return jsonify({'error': 'Ticket price cannot be negative'}), 400
    
    # Create event
    event = Event(
        organizer_id=request.current_user.id,
        title=data['title'],
        description=data['description'],
        venue=data['venue'],
        address=data.get('address'),
        city=data.get('city'),
        country=data.get('country'),
        start_time=start_time,
        end_time=end_time,
        category=data['category'],
        poster_url=data.get('poster_url'),
        banner_url=data.get('banner_url'),
        capacity=data.get('capacity'),
        is_public=data.get('is_public', True),
        status='pending'  # Events need admin approval
    )
    
    db.session.add(event)
    db.session.commit()
    
    # Create ticket types if provided
    for tt_data in ticket_types:
        ticket_type = TicketType(
            event_id=event.id,
            name=tt_data['name'],
            description=tt_data.get('description'),
            price=tt_data['price'],
            quantity_total=tt_data['quantity_total'],
            sale_start=datetime.fromisoformat(tt_data['sale_start'].replace('Z', '+00:00')) if tt_data.get('sale_start') else None,
            sale_end=datetime.fromisoformat(tt_data['sale_end'].replace('Z', '+00:00')) if tt_data.get('sale_end') else None,
            access_level=tt_data.get('access_level', 'general'),
            max_per_user=tt_data.get('max_per_user', 10)
        )
        db.session.add(ticket_type)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Event created successfully and sent for approval',
        'event': event.to_dict()
    }), 201

# ========== UPDATE EVENT (Organizer only) ==========
@event_bp.route('/<int:event_id>', methods=['PUT'])
@token_required
def update_event(event_id):
    event = Event.query.get_or_404(event_id)
    
    # Check permissions
    if request.current_user.id != event.organizer_id and request.current_user.role.name != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Update allowed fields
    allowed_fields = ['title', 'description', 'venue', 'address', 'city', 'country',
                     'category', 'poster_url', 'banner_url', 'capacity', 'is_public']
    
    for field in allowed_fields:
        if field in data:
            setattr(event, field, data[field])
    
    # Handle date updates
    if 'start_time' in data:
        try:
            event.start_time = datetime.fromisoformat(data['start_time'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid start_time format'}), 400
    
    if 'end_time' in data:
        try:
            event.end_time = datetime.fromisoformat(data['end_time'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid end_time format'}), 400
    
    # Reset to pending if major changes were made
    if data.get('major_changes', False):
        event.status = 'pending'
    
    event.updated_at = datetime.now(timezone.utc)
    db.session.commit()
    
    return jsonify({
        'message': 'Event updated successfully',
        'event': event.to_dict()
    }), 200

# ========== DELETE EVENT (Organizer/Admin only) ==========
@event_bp.route('/<int:event_id>', methods=['DELETE'])
@token_required
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    
    # Check permissions
    if request.current_user.id != event.organizer_id and request.current_user.role.name != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Check if event has orders
    if event.orders and len(event.orders) > 0:
        return jsonify({'error': 'Cannot delete event with existing orders. Cancel instead.'}), 400
    
    db.session.delete(event)
    db.session.commit()
    
    return jsonify({'message': 'Event deleted successfully'}), 200

# ========== ADD TO WISHLIST ==========
@event_bp.route('/<int:event_id>/wishlist', methods=['POST'])
@token_required
def add_to_wishlist(event_id):
    event = Event.query.get_or_404(event_id)
    
    # Check if already in wishlist
    existing = Wishlist.query.filter_by(
        user_id=request.current_user.id,
        event_id=event_id
    ).first()
    
    if existing:
        return jsonify({'error': 'Event already in wishlist'}), 400
    
    wishlist_item = Wishlist(
        user_id=request.current_user.id,
        event_id=event_id
    )
    
    db.session.add(wishlist_item)
    db.session.commit()
    
    return jsonify({'message': 'Added to wishlist successfully'}), 201

# ========== REMOVE FROM WISHLIST ==========
@event_bp.route('/<int:event_id>/wishlist', methods=['DELETE'])
@token_required
def remove_from_wishlist(event_id):
    wishlist_item = Wishlist.query.filter_by(
        user_id=request.current_user.id,
        event_id=event_id
    ).first()
    
    if not wishlist_item:
        return jsonify({'error': 'Event not in wishlist'}), 404
    
    db.session.delete(wishlist_item)
    db.session.commit()
    
    return jsonify({'message': 'Removed from wishlist successfully'}), 200

# ========== CREATE REVIEW ==========
@event_bp.route('/<int:event_id>/reviews', methods=['POST'])
@token_required
def create_review(event_id):
    event = Event.query.get_or_404(event_id)
    data = request.get_json()
    
    # Check if user has attended the event (has valid tickets)
    has_tickets = any(
        order.payment_status == 'completed' 
        for order in request.current_user.orders 
        if order.event_id == event_id
    )
    
    if not has_tickets:
        return jsonify({'error': 'You must have attended this event to leave a review'}), 403
    
    # Check if already reviewed
    existing_review = Review.query.filter_by(
        user_id=request.current_user.id,
        event_id=event_id
    ).first()
    
    if existing_review:
        return jsonify({'error': 'You have already reviewed this event'}), 400
    
    # Rating validation
    rating = data.get('rating')
    if not rating or not isinstance(rating, int) or rating < 1 or rating > 5:
        return jsonify({'error': 'Rating must be between 1 and 5'}), 400
    
    review = Review(
        user_id=request.current_user.id,
        event_id=event_id,
        rating=rating,
        comment=data.get('comment')
    )
    
    db.session.add(review)
    db.session.commit()
    
    return jsonify({
        'message': 'Review submitted successfully',
        'review': {
            'id': review.id,
            'rating': review.rating,
            'comment': review.comment,
            'created_at': review.created_at.isoformat()
        }
    }), 201

# ========== GET EVENT REGISTRATIONS ==========
@event_bp.route('/<int:event_id>/registrations', methods=['GET'])
@token_required
def get_event_registrations(event_id):
    event = Event.query.get_or_404(event_id)
    
    # Only organizer or admin can view registrations
    if request.current_user.id != event.organizer_id and request.current_user.role.name != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    registrations = EventRegistration.query.filter_by(event_id=event_id).all()
    
    registrations_data = []
    for reg in registrations:
        registrations_data.append({
            'id': reg.id,
            'user': {
                'id': reg.user.id,
                'username': reg.user.username,
                'email': reg.user.email
            },
            'quantity': reg.quantity,
            'registration_type': reg.registration_type,
            'notes': reg.notes,
            'registered_at': reg.registered_at.isoformat()
        })
    
    return jsonify(registrations_data), 200