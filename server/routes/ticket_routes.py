# server/routes/ticket_routes.py
from flask import Blueprint, request, jsonify
from server.extensions import db
from server.models import Ticket, Event, Order, User
from server.auth import token_required, role_required
from datetime import datetime, timezone
import qrcode
from io import BytesIO
import base64

ticket_bp = Blueprint('tickets', __name__, url_prefix='/api/tickets')

# GET all tickets for current user
@ticket_bp.route('', methods=['GET'])
@token_required
def get_user_tickets():
    user_id = request.current_user.id
    
    # Get tickets through orders
    tickets = Ticket.query.join(Order).filter(Order.user_id == user_id).order_by(Ticket.created_at.desc()).all()
    
    tickets_data = []
    for ticket in tickets:
        ticket_data = {
            'id': ticket.id,
            'code': ticket.code,
            'order_reference': ticket.order.reference,
            'event': {
                'id': ticket.order.event.id,
                'title': ticket.order.event.title,
                'start_time': ticket.order.event.start_time.isoformat(),
                'venue': ticket.order.event.venue,
                'city': ticket.order.event.city
            },
            'ticket_type': {
                'name': ticket.ticket_type.name,
                'access_level': ticket.ticket_type.access_level
            },
            'status': ticket.status,
            'checked_in_at': ticket.checked_in_at.isoformat() if ticket.checked_in_at else None,
            'created_at': ticket.created_at.isoformat(),
            'qr_code_url': ticket.qr_image_url
        }
        tickets_data.append(ticket_data)
    
    return jsonify(tickets_data), 200

# GET ticket details by ID
@ticket_bp.route('/<int:ticket_id>', methods=['GET'])
@token_required
def get_ticket(ticket_id):
    ticket = Ticket.query.get_or_404(ticket_id)
    
    # Check ownership or organizer/admin access
    if ticket.order.user_id != request.current_user.id:
        # Check if user is organizer of the event
        if ticket.order.event.organizer_id != request.current_user.id and request.current_user.role.name != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
    
    # Generate QR code if not exists
    if not ticket.qr_image_url:
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(f"EVENT360:{ticket.code}:{ticket.order.event_id}:{ticket.id}")
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        qr_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        # In production, save to cloud storage. Here we return as data URL
        ticket.qr_image_url = f"data:image/png;base64,{qr_base64}"
        db.session.commit()
    
    return jsonify({
        'ticket': {
            'id': ticket.id,
            'code': ticket.code,
            'order': {
                'id': ticket.order.id,
                'reference': ticket.order.reference
            },
            'event': ticket.order.event.to_dict(),
            'ticket_type': {
                'name': ticket.ticket_type.name,
                'description': ticket.ticket_type.description
            },
            'user': {
                'name': ticket.order.user.username,
                'email': ticket.order.user.email
            },
            'status': ticket.status,
            'checked_in_at': ticket.checked_in_at.isoformat() if ticket.checked_in_at else None,
            'qr_code_url': ticket.qr_image_url
        }
    }), 200

# POST - Check-in ticket (organizer only)
@ticket_bp.route('/<int:ticket_id>/check-in', methods=['POST'])
@token_required
def check_in_ticket(ticket_id):
    ticket = Ticket.query.get_or_404(ticket_id)
    
    # Only organizer or admin can check in tickets
    if ticket.order.event.organizer_id != request.current_user.id and request.current_user.role.name != 'admin':
        return jsonify({'error': 'Only event organizer can check in tickets'}), 403
    
    if ticket.status != 'valid':
        return jsonify({'error': 'Ticket is not valid'}), 400
    
    if ticket.checked_in_at:
        return jsonify({'error': 'Ticket already checked in'}), 400
    
    # Check if event is currently happening (within 2 hours before/after)
    now = datetime.now(timezone.utc)
    event_start = ticket.order.event.start_time
    event_end = ticket.order.event.end_time
    
    # Allow check-in 2 hours before event starts until event ends
    if now < (event_start - timedelta(hours=2)):
        return jsonify({'error': 'Check-in opens 2 hours before event starts'}), 400
    
    if now > event_end:
        return jsonify({'error': 'Event has ended'}), 400
    
    # Check-in ticket
    ticket.checked_in_at = now
    ticket.status = 'used'
    
    db.session.commit()
    
    # Create notification for ticket owner
    notification = Notification(
        user_id=ticket.order.user_id,
        title='Ticket Checked In',
        message=f'Your ticket for "{ticket.order.event.title}" has been checked in.',
        type='ticket_checked_in'
    )
    db.session.add(notification)
    db.session.commit()
    
    return jsonify({
        'message': 'Ticket checked in successfully',
        'ticket': {
            'code': ticket.code,
            'checked_in_at': ticket.checked_in_at.isoformat(),
            'user': ticket.order.user.username
        }
    }), 200

# GET - Verify ticket by code (Public/Organizer)
@ticket_bp.route('/verify/<code>', methods=['GET'])
@token_required
def verify_ticket(code):
    ticket = Ticket.query.filter_by(code=code).first()
    
    if not ticket:
        return jsonify({'error': 'Invalid ticket code'}), 404
    
    # Check if user has permission (organizer, admin, or ticket owner)
    is_organizer = ticket.order.event.organizer_id == request.current_user.id
    is_admin = request.current_user.role.name == 'admin'
    is_owner = ticket.order.user_id == request.current_user.id
    
    if not (is_organizer or is_admin or is_owner):
        return jsonify({'error': 'Unauthorized to view this ticket'}), 403
    
    return jsonify({
        'valid': ticket.status == 'valid',
        'status': ticket.status,
        'event': {
            'title': ticket.order.event.title,
            'start_time': ticket.order.event.start_time.isoformat(),
            'venue': ticket.order.event.venue
        },
        'user': {
            'name': ticket.order.user.username,
            'email': ticket.order.user.email
        },
        'ticket_type': ticket.ticket_type.name,
        'checked_in': ticket.checked_in_at is not None,
        'checked_in_at': ticket.checked_in_at.isoformat() if ticket.checked_in_at else None
    }), 200