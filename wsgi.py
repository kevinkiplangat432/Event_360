"""WSGI entry point for Flask application"""
import os
from server import create_app

# Create the application instance
app = create_app(os.getenv('FLASK_ENV', 'default'))

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5555))
    app.run(host='0.0.0.0', port=port, debug=app.config.get('DEBUG', True))

