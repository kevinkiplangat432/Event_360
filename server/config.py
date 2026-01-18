import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'event360-secret-key-2024-dev')
    
    # Handle Render PostgreSQL database URL
    database_url = os.environ.get('DATABASE_URL')
    
    if database_url:
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        SQLALCHEMY_DATABASE_URI = database_url
    else:
        # Use production database
        SQLALCHEMY_DATABASE_URI = 'postgresql://event360_database_1jlv_user:02iMyAYGOW4LA9iETja4DGzWpmrHr6Y1@dpg-d5m89u4mrvns73ev8r9g-a/event360_database_1jlv'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_recycle': 300,
        'pool_pre_ping': True,
        'pool_size': 10,
        'max_overflow': 20,
    }
    
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'event360-jwt-secret-2024')
    
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'https://event-360.vercel.app,http://localhost:3000,http://localhost:5173').split(',')
    
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    
    APP_NAME = 'Event360'
    DEBUG = os.environ.get('FLASK_ENV') == 'development'
    
    # Admin credentials (for first setup)
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@event360.com')
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'Event360Admin2024!')
    
    @staticmethod
    def init_app(app):
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True

class ProductionConfig(Config):
    DEBUG = False
    SESSION_COOKIE_SECURE = True
    
    @staticmethod
    def init_app(app):
        Config.init_app(app)
        import logging
        from logging import StreamHandler
        handler = StreamHandler()
        handler.setLevel(logging.INFO)
        app.logger.addHandler(handler)

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://event360_database_1jlv_user:02iMyAYGOW4LA9iETja4DGzWpmrHr6Y1@dpg-d5m89u4mrvns73ev8r9g-a/event360_database_1jlv'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
