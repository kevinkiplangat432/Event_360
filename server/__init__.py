# server/__init__.py
from flask import Flask
from flask_cors import CORS
from .extensions import db, bcrypt, cors, migrate
from .config import config

def create_app(config_name='default'):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    
    # Configure CORS
    cors.init_app(app, 
                 resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}},
                 supports_credentials=True)
    
    # Initialize configuration
    config[config_name].init_app(app)
    
    # Register blueprints
    register_blueprints(app)
    
    # Register error handlers
    register_error_handlers(app)
    
    return app

def register_blueprints(app):
    """Register all blueprints"""
    from .routes.auth_routes import auth_bp
    from .routes.user_routes import user_bp
    from .routes.event_routes import event_bp
    from .routes.order_routes import order_bp
    from .routes.payment_routes import payment_bp
    from .routes.registration_routes import registration_bp
    from .routes.ticket_routes import ticket_bp
    from .routes.admin_routes import admin_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(event_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(registration_bp)
    app.register_blueprint(ticket_bp)
    app.register_blueprint(admin_bp)

def register_error_handlers(app):
    """Register error handlers"""
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {'error': 'Internal server error'}, 500