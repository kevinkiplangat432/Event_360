from flask import Blueprint, request, jsonify
from extensions import db
from models import Payment, Order
from datetime import datetime

payment_bp = Blueprint('payments', __name__, url_prefix='/api/payments')

# POST - Process payment
@payment_bp.route('', methods=['POST'])
def process_payment():
    data = request.get_json()
    
    order_id = data.get('order_id')
    provider = data.get('provider')  # mpesa, stripe, paypal
    provider_ref = data.get('provider_ref')
    
    # Get order
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    # Create payment record
    payment = Payment(
        order_id=order_id,
        provider=provider,
        provider_ref=provider_ref,
        status='pending',
        raw_payload=data  # Store full request
    )
    
    db.session.add(payment)
    
    # Mock payment processing (replace with real integration)
    # For demo purposes, mark as success
    payment.status = 'success'
    order.payment_status = 'completed'
    
    db.session.commit()
    
    return jsonify({
        'payment_id': payment.id,
        'status': payment.status,
        'message': 'Payment processed successfully'
    }), 200

# GET - Get payment details
@payment_bp.route('/<int:id>', methods=['GET'])
def get_payment(id):
    payment = Payment.query.get(id)
    
    if not payment:
        return jsonify({'error': 'Payment not found'}), 404
    
    return jsonify({
        'id': payment.id,
        'order_id': payment.order_id,
        'provider': payment.provider,
        'status': payment.status,
        'created_at': payment.created_at.isoformat()
    }), 200