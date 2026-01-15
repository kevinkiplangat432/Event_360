# server/utils/cloudinary_upload.py
import cloudinary
import cloudinary.uploader
import os

cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
    secure=True
)

def upload_image(file, folder="event_posters"):
    """Upload image to Cloudinary"""
    try:
        upload_result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type="image",
            transformation=[
                {'width': 1200, 'height': 800, 'crop': 'fill'},
                {'quality': 'auto:good'}
            ]
        )
        return upload_result['secure_url']
    except Exception as e:
        raise Exception(f"Image upload failed: {str(e)}")

def delete_image(public_id):
    """Delete image from Cloudinary"""
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result
    except Exception as e:
        raise Exception(f"Image deletion failed: {str(e)}")