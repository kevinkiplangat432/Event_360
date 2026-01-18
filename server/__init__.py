from flask import Flask
from flask_cors import CORS
from .extensions import db, bcrypt, cors, migrate
from .config import config
from .models import Role
import os

def create_app(config_name='default'):
    """Application factory pattern"""
    # Auto-detect Render environment
    if os.environ.get('RENDER') or os.environ.get('FLASK_ENV') == 'production':
        config_name = 'production'
    
    print(f"=== CREATING APP WITH CONFIG: {config_name} ===")
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    
    # Configure CORS
    CORS(app, 
         resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    config[config_name].init_app(app)
    
    # Create default roles on app startup
    with app.app_context():
        try:
            # Check if tables exist first
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            
            if 'roles' in tables:
                Role.create_default_roles()
                print("Default roles ensured")
            else:
                print("Tables not found - run migrations first")
        except Exception as e:
            print(f"Warning: Could not create roles: {e}")
    
    register_blueprints(app)
    register_error_handlers(app)
    
    return app

def register_blueprints(app):
    from .routes.auth_routes import auth_bp
    from .routes.user_routes import user_bp
    from .routes.event_routes import event_bp
    from .routes.order_routes import order_bp
    from .routes.payment_routes import payment_bp
    from .routes.registration_routes import registration_bp
    from .routes.ticket_routes import ticket_bp
    from .routes.admin_routes import admin_bp
    from .routes.upload_routes import upload_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(event_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(registration_bp)
    app.register_blueprint(ticket_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(upload_bp)

def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {'error': 'Internal server error'}, 500
    
    @app.after_request
    def after_request(response):
        """Add CORS headers to every response"""
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response