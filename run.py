import os
from datetime import datetime
from server import create_app

app = create_app(os.getenv('FLASK_ENV', 'default'))

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return {'error': 'Not found'}, 404

@app.errorhandler(500)
def internal_error(error):
    return {'error': 'Internal server error'}, 500

# Basic endpoints
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
        # Test database connection (read-only)
        from server.extensions import db
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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5555))
    app.run(host='0.0.0.0', port=port, debug=app.config.get('DEBUG', True))
