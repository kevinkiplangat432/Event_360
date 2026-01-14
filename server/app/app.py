from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate
from .models import User, Event, Order, TicketType

# Import blueprints (routes not yet implemented)
# from routes.registration_routes import registration_bp
# from routes.order_routes import order_bp
# from routes.payment_routes import payment_bp
# from routes.ticket_routes import ticket_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)
    
    # Register blueprints (routes not yet implemented)
    # app.register_blueprint(registration_bp)
    # app.register_blueprint(order_bp)
    # app.register_blueprint(payment_bp)
    # app.register_blueprint(ticket_bp)

    @app.route("/")
    def index():
        return {"status": "Event_360 API running"}

    return app

app = create_app()