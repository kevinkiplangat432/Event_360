from flask import Blueprint, request, jsonify
from extensions import db
from models import Ticket, Event
from datetime import datetime

ticket_bp = Blueprint('tickets', __name__, url_prefix='/api/tickets')

# GET all tickets for current user
@ticket_bp.route('', methods=['GET'])
def get_user_tickets():
    user_id = request.args.get('user_id')  # Replace with auth
    
    tickets = Ticket.query.join(Ticket.order).filter_by(user_id=user_id).all()
    
    return jsonify([{
        'id': ticket.id,
        'code': ticket.code,
        'event_title': ticket.order.event.title,
        'status': ticket.status,
        'checked_in_at': ticket.checked_in_at.isoformat() if ticket.checked_in_at else None
    } for ticket in tickets]), 200

# POST - Check-in ticket (organizer only)
@ticket_bp.route('/<int:id>/check-in', methods=['POST'])
def check_in_ticket(id):
    ticket = Ticket.query.get(id)
    
    if not ticket:
        return jsonify({'error': 'Ticket not found'}), 404
    
    if ticket.status != 'valid':
        return jsonify({'error': 'Ticket is not valid'}), 400
    
    if ticket.checked_in_at:
        return jsonify({'error': 'Ticket already checked in'}), 400
    
    # Check if event has started
    event = ticket.order.event
    if event.start_time > datetime.utcnow():
        return jsonify({'error': 'Event has not started yet'}), 400
    
    # Check-in ticket
    ticket.checked_in_at = datetime.utcnow()
    ticket.status = 'used'
    
    db.session.commit()
    
    return jsonify({'message': 'Ticket checked in successfully'}), 200

# GET - Verify ticket by code
@ticket_bp.route('/verify/<code>', methods=['GET'])
def verify_ticket(code):
    ticket = Ticket.query.filter_by(code=code).first()
    
    if not ticket:
        return jsonify({'error': 'Invalid ticket code'}), 404
    
    return jsonify({
        'valid': ticket.status == 'valid',
        'status': ticket.status,
        'event': ticket.order.event.title,
        'checked_in': ticket.checked_in_at is not None
    }), 200