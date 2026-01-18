from flask import Blueprint, request, jsonify
from server.utils.cloudinary_upload import upload_image
from server.auth import token_required
import os

upload_bp = Blueprint('upload', __name__, url_prefix='/api')

@upload_bp.route('/upload', methods=['POST'])
@token_required
def upload_file():
    """Upload file to Cloudinary"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check file type
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
        if not ('.' in file.filename and 
                file.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Upload to Cloudinary
        image_url = upload_image(file, folder="event360_uploads")
        
        return jsonify({
            'message': 'File uploaded successfully',
            'url': image_url
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500