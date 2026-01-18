from .auth_routes import auth_bp
from .user_routes import user_bp
from .event_routes import event_bp
from .order_routes import order_bp
from .payment_routes import payment_bp
from .registration_routes import registration_bp
from .ticket_routes import ticket_bp
from .admin_routes import admin_bp

all_blueprints = [
    auth_bp,
    user_bp,
    event_bp,
    order_bp,
    payment_routes.payment_bp,
    registration_bp,
    ticket_bp,
    admin_bp
]

__all__ = ['all_blueprints']