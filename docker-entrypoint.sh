
echo "Starting application setup..."

export FLASK_APP=run.py  

echo " Running database migrations..."
flask db upgrade

echo "Starting Gunicorn server..."
exec gunicorn --bind 0.0.0.0:$PORT run:app
