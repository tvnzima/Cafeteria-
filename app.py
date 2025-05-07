from flask import Flask
from routes import setup_routes
from models import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cafe.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

# Create database tables
with app.app_context():
    db.drop_all()  # Drop all existing tables
    db.create_all()  # Create new tables with updated schema

setup_routes(app)

if __name__ == '__main__':
    app.run(debug=True, port=1079)

