from flask import Blueprint, request, jsonify
from extensions import db
from models import Order, EventRegistration, Ticket
import uuid

order_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

# GET all orders for current user
@order_bp.route('', methods=['GET'])
def get_user_orders():
    user_id = request.args.get('user_id')  # Replace with auth
    
    orders = Order.query.filter_by(user_id=user_id).all()
    
    return jsonify([{
        'id': order.id,
        'event_title': order.event.title,
        'total_amount': order.total_amount,
        'payment_status': order.payment_status,
        'created_at': order.created_at.isoformat()
    } for order in orders]), 200

# POST - Create order from registration
@order_bp.route('', methods=['POST'])
def create_order():
    data = request.get_json()
    
    registration_id = data.get('registration_id')
    
    # Get registration
    registration = EventRegistration.query.get(registration_id)
    if not registration:
        return jsonify({'error': 'Registration not found'}), 404
    
    # Calculate total amount (simplified - you can make this more complex)
    price_per_ticket = 50.00  # Default price or get from TicketType
    total_amount = registration.quantity * price_per_ticket
    
    # Create order
    order = Order(
        user_id=registration.user_id,
        event_id=registration.event_id,
        total_amount=total_amount,
        payment_status='pending'
    )
    
    db.session.add(order)
    db.session.commit()
    
    # Generate tickets
    for i in range(registration.quantity):
        ticket = Ticket(
            order_id=order.id,
            code=f"TKT-{uuid.uuid4().hex[:8].upper()}",
            status='valid'
        )
        db.session.add(ticket)
    
    db.session.commit()
    
    return jsonify({
        'order_id': order.id,
        'total_amount': total_amount,
        'message': 'Order created successfully'
    }), 201