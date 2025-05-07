from app import app
from models import db, Feedback
from sqlalchemy import text

def migrate():
    with app.app_context():
        # Add thumbs_up_count column if it doesn't exist
        with db.engine.connect() as conn:
            conn.execute(text('ALTER TABLE feedback ADD COLUMN thumbs_up_count INTEGER DEFAULT 0'))
            conn.commit()

if __name__ == '__main__':
    migrate() 