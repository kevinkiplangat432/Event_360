from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, migrate
from models import User, Event, Order, TicketType

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)

    @app.route("/")
    def index():
        return {"status": "Event_360 API running"}

    return app

app = create_app()
