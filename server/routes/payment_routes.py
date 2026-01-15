# server/routes/payment_routes.py
from flask import Blueprint, request, jsonify
from server.extensions import db
from server.models import Payment, Order, Notification
from server.auth import token_required, role_required
from datetime import datetime, timezone

payment_bp = Blueprint('payments', __name__, url_prefix='/api/payments')

# POST - Process payment
@payment_bp.route('', methods=['POST'])
@token_required
def process_payment():
    data = request.get_json()
    
    order_id = data.get('order_id')
    provider = data.get('provider', 'mpesa')  # mpesa, stripe, paypal
    provider_ref = data.get('provider_ref')
    amount = data.get('amount')
    
    if not order_id or not amount:
        return jsonify({'error': 'Order ID and amount required'}), 400
    
    # Get order
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    # Check ownership
    if order.user_id != request.current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Check if already paid
    if order.payment_status == 'completed':
        return jsonify({'error': 'Order is already paid'}), 400
    
    # Validate amount matches order total (with small tolerance for rounding)
    if abs(float(amount) - float(order.total_amount)) > 0.01:
        return jsonify({'error': 'Payment amount does not match order total'}), 400
    
    # Check if payment already exists
    existing_payment = Payment.query.filter_by(order_id=order_id, provider_ref=provider_ref).first()
    if existing_payment:
        return jsonify({'error': 'Payment with this reference already exists'}), 400
    
    # Create payment record
    payment = Payment(
        order_id=order_id,
        provider=provider,
        provider_ref=provider_ref,
        amount=amount,
        status='pending',
        raw_payload=data
    )
    
    db.session.add(payment)
    
    # Mock payment processing - In real app, integrate with payment gateway
    # For demo, simulate successful payment after 2 seconds
    payment.status = 'success'
    order.payment_status = 'completed'
    order.order_status = 'confirmed'
    
    # Create success notification
    notification = Notification(
        user_id=order.user_id,
        title='Payment Successful!',
        message=f'Your payment of KES {amount} for order {order.reference} was successful.',
        type='payment_success'
    )
    db.session.add(notification)
    
    db.session.commit()
    
    return jsonify({
        'payment_id': payment.id,
        'status': payment.status,
        'message': 'Payment processed successfully',
        'order': {
            'id': order.id,
            'reference': order.reference,
            'payment_status': order.payment_status
        }
    }), 200

# GET - Get payment details
@payment_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_payment(id):
    payment = Payment.query.get_or_404(id)
    
    # Check ownership or admin
    if payment.order.user_id != request.current_user.id and request.current_user.role.name != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({
        'id': payment.id,
        'order_id': payment.order_id,
        'order_reference': payment.order.reference,
        'provider': payment.provider,
        'provider_ref': payment.provider_ref,
        'amount': float(payment.amount) if payment.amount else None,
        'status': payment.status,
        'created_at': payment.created_at.isoformat(),
        'user': {
            'id': payment.order.user.id,
            'username': payment.order.user.username
        }
    }), 200

# GET - Get payments for an order
@payment_bp.route('/order/<int:order_id>', methods=['GET'])
@token_required
def get_order_payments(order_id):
    order = Order.query.get_or_404(order_id)
    
    # Check ownership or admin
    if order.user_id != request.current_user.id and request.current_user.role.name != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    payments = Payment.query.filter_by(order_id=order_id).all()
    
    payments_data = []
    for payment in payments:
        payments_data.append({
            'id': payment.id,
            'provider': payment.provider,
            'provider_ref': payment.provider_ref,
            'amount': float(payment.amount) if payment.amount else None,
            'status': payment.status,
            'created_at': payment.created_at.isoformat()
        })
    
    return jsonify(payments_data), 200

# POST - Simulate payment callback (for webhooks)
@payment_bp.route('/callback/<provider>', methods=['POST'])
def payment_callback(provider):
    data = request.get_json() or request.form.to_dict()

    return jsonify({'status': 'received'}), 200