# run.py (in project root)
import os
import sys
from datetime import datetime

# Add the server directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from server import create_app
from server.extensions import db
from server.seed.seed_data import seed_database
from flask_migrate import Migrate

app = create_app(os.getenv('FLASK_ENV', 'default'))
migrate = Migrate(app, db)

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return {'error': 'Not found'}, 404

@app.errorhandler(500)
def internal_error(error):
    return {'error': 'Internal server error'}, 500

@app.route('/')
def index():
    return {
        'message': 'Event360 API',
        'version': '1.0.0',
        'database': 'PostgreSQL',
        'endpoints': {
            'auth': '/api/auth/*',
            'users': '/api/users/*',
            'events': '/api/events/*',
            'orders': '/api/orders/*',
            'payments': '/api/payments/*',
            'registrations': '/api/registrations/*',
            'tickets': '/api/tickets/*',
            'admin': '/api/admin/*'
        }
    }

@app.route('/health')
def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        db.session.execute('SELECT 1')
        return {
            'status': 'healthy',
            'database': 'connected',
            'timestamp': datetime.now().isoformat()
        }, 200
    except Exception as e:
        return {
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e)
        }, 500

def initialize_database():
    """Initialize database and seed data"""
    with app.app_context():
        print("🔄 Initializing database...")
        # Create tables
        db.create_all()
        print("✅ Tables created")
        # Seed initial data
        seed_database()
        print("✅ Database initialized successfully!")

if __name__ == '__main__':
    # Initialize database before first request
    initialize_database()
    port = int(os.environ.get('PORT', 5555))
    app.run(host='0.0.0.0', port=port, debug=app.config.get('DEBUG', True))