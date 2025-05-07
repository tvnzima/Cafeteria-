from app import app
from models import db, Feedback
from datetime import datetime

def add_test_review():
    with app.app_context():
        test_review = Feedback(
            rating=5,
            feedback_text="This is a test review. The food was excellent!",
            created_at=datetime.utcnow(),
            thumbs_up_count=0
        )
        db.session.add(test_review)
        db.session.commit()
        print("Test review added successfully!")

if __name__ == '__main__':
    add_test_review() 