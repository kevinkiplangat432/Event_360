# server/routes/order_routes.py
from flask import Blueprint, request, jsonify
from server.extensions import db
from server.models import Order, OrderItem, TicketType, Ticket, EventRegistration, Payment
from server.auth import token_required, role_required
import uuid
from datetime import datetime, timezone

order_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

# GET all orders for current user
@order_bp.route('', methods=['GET'])
@token_required
def get_user_orders():
    user_id = request.current_user.id
    
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    
    orders_data = []
    for order in orders:
        order_data = {
            'id': order.id,
            'reference': order.reference,
            'event': {
                'id': order.event.id,
                'title': order.event.title,
                'start_time': order.event.start_time.isoformat(),
                'venue': order.event.venue,
                'city': order.event.city
            },
            'total_amount': float(order.total_amount),
            'payment_status': order.payment_status,
            'order_status': order.order_status,
            'created_at': order.created_at.isoformat(),
            'ticket_count': len(order.tickets)
        }
        orders_data.append(order_data)
    
    return jsonify(orders_data), 200

# GET single order details
@order_bp.route('/<int:order_id>', methods=['GET'])
@token_required
def get_order(order_id):
    order = Order.query.get_or_404(order_id)
    
    # Check ownership
    if order.user_id != request.current_user.id and request.current_user.role.name != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Get order items
    order_items = []
    for item in order.order_items:
        order_items.append({
            'ticket_type': item.ticket_type.name,
            'quantity': item.quantity,
            'unit_price': float(item.unit_price),
            'subtotal': float(item.subtotal)
        })
    
    # Get tickets
    tickets = []
    for ticket in order.tickets:
        tickets.append({
            'id': ticket.id,
            'code': ticket.code,
            'status': ticket.status,
            'checked_in_at': ticket.checked_in_at.isoformat() if ticket.checked_in_at else None
        })
    
    # Get payment info
    payment_info = None
    if order.payment:
        payment_info = {
            'provider': order.payment.provider,
            'status': order.payment.status,
            'created_at': order.payment.created_at.isoformat()
        }
    
    return jsonify({
        'order': {
            'id': order.id,
            'reference': order.reference,
            'event': order.event.to_dict(),
            'total_amount': float(order.total_amount),
            'payment_status': order.payment_status,
            'order_status': order.order_status,
            'created_at': order.created_at.isoformat()
        },
        'order_items': order_items,
        'tickets': tickets,
        'payment': payment_info
    }), 200

# POST - Create order from cart
@order_bp.route('', methods=['POST'])
@token_required
def create_order():
    data = request.get_json()
    
    # Cart items should be in format: [{'ticket_type_id': X, 'quantity': Y}]
    cart_items = data.get('cart_items', [])
    
    if not cart_items:
        return jsonify({'error': 'Cart is empty'}), 400
    
    # Validate and process cart items
    total_amount = 0
    event_id = None
    order_items_data = []
    
    for item in cart_items:
        ticket_type_id = item.get('ticket_type_id')
        quantity = item.get('quantity', 1)
        
        if not ticket_type_id or quantity <= 0:
            return jsonify({'error': 'Invalid cart item'}), 400
        
        ticket_type = TicketType.query.get(ticket_type_id)
        if not ticket_type:
            return jsonify({'error': f'Ticket type {ticket_type_id} not found'}), 404
        
        # Check availability
        if ticket_type.available_quantity < quantity:
            return jsonify({'error': f'Not enough tickets available for {ticket_type.name}'}), 400
        
        # Check max per user
        if quantity > ticket_type.max_per_user:
            return jsonify({'error': f'Maximum {ticket_type.max_per_user} tickets allowed per user for {ticket_type.name}'}), 400
        
        # Set event_id (should be same for all items)
        if event_id is None:
            event_id = ticket_type.event_id
        elif event_id != ticket_type.event_id:
            return jsonify({'error': 'All tickets must be for the same event'}), 400
        
        # Calculate subtotal
        subtotal = ticket_type.price * quantity
        total_amount += subtotal
        
        order_items_data.append({
            'ticket_type': ticket_type,
            'quantity': quantity,
            'unit_price': ticket_type.price,
            'subtotal': subtotal
        })
    
    # Create order
    order = Order(
        user_id=request.current_user.id,
        event_id=event_id,
        total_amount=total_amount,
        payment_status='pending',
        order_status='processing'
    )
    
    db.session.add(order)
    db.session.flush()  # Get order ID
    
    # Create order items and update ticket quantities
    for item_data in order_items_data:
        order_item = OrderItem(
            order_id=order.id,
            ticket_type_id=item_data['ticket_type'].id,
            quantity=item_data['quantity'],
            unit_price=item_data['unit_price'],
            subtotal=item_data['subtotal']
        )
        db.session.add(order_item)
        
        # Update sold quantity
        item_data['ticket_type'].quantity_sold += item_data['quantity']
        
        # Create tickets
        for i in range(item_data['quantity']):
            ticket = Ticket(
                order_id=order.id,
                ticket_type_id=item_data['ticket_type'].id,
                code=f"TKT-{uuid.uuid4().hex[:12].upper()}",
                status='valid'
            )
            db.session.add(ticket)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Order created successfully',
        'order': {
            'id': order.id,
            'reference': order.reference,
            'total_amount': float(total_amount),
            'payment_required': True
        }
    }), 201

# POST - Cancel order
@order_bp.route('/<int:order_id>/cancel', methods=['POST'])
@token_required
def cancel_order(order_id):
    order = Order.query.get_or_404(order_id)
    
    # Check ownership
    if order.user_id != request.current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Check if order can be cancelled
    if order.order_status == 'cancelled':
        return jsonify({'error': 'Order is already cancelled'}), 400
    
    if order.payment_status == 'completed':
        return jsonify({'error': 'Cannot cancel order with completed payment. Please request refund.'}), 400
    
    # Check if event hasn't started yet
    if order.event.start_time < datetime.now(timezone.utc):
        return jsonify({'error': 'Cannot cancel order for event that has already started'}), 400
    
    # Update order status
    order.order_status = 'cancelled'
    order.updated_at = datetime.now(timezone.utc)
    
    # Restore ticket quantities
    for item in order.order_items:
        item.ticket_type.quantity_sold -= item.quantity
    
    # Mark tickets as cancelled
    for ticket in order.tickets:
        ticket.status = 'cancelled'
    
    db.session.commit()
    
    return jsonify({'message': 'Order cancelled successfully'}), 200