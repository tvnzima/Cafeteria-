from flask import render_template, jsonify, request, redirect, url_for
from models import db, Feedback

def setup_routes(app):
    @app.route('/')
    def home():
        return render_template('index.html')

    @app.route('/menu')
    def menu():
        menu_items = [
            {"id": 1, "name": "Burger", "price": 5.99},
            {"id": 2, "name": "Pizza", "price": 8.99},
            {"id": 3, "name": "Pasta", "price": 7.99}
        ]
        
        if request.headers.get('Accept') == 'application/json':
            return jsonify({"menu": menu_items})
        else:
            return render_template('menu.html')

    @app.route('/about')
    def about():
        if request.headers.get('Accept') == 'application/json':
            return jsonify({"message": "Work in Progress"})
        else:
            return render_template('about.html')

    @app.route('/contact')
    def contact():
        if request.headers.get('Accept') == 'application/json':
            return jsonify({"message": "Work in Progress"})
        else:
            return render_template('wip.html')

    @app.route('/breakfast')
    def breakfast():
        return "Breakfast menu here!"

    @app.route('/lunch')
    def lunch():
        return "Lunch menu here!"

    @app.route('/dinner')
    def dinner():
        return "Dinner menu here!"

    @app.route('/snacks')
    def snacks():
        return "Snacks menu here!"

    # Feedback routes
    @app.route('/feedback')
    def feedback():
        return render_template('feedback.html')

    @app.route('/submit-feedback', methods=['POST'])
    def submit_feedback():
        rating = request.form.get('rating')
        feedback_text = request.form.get('feedback', '').strip()

        if not rating:
            return jsonify({"error": "Rating is required"}), 400

        # Only store feedback if it includes text
        if feedback_text:
            new_feedback = Feedback(
                rating=int(rating),
                feedback_text=feedback_text
            )
            db.session.add(new_feedback)
            db.session.commit()

        return redirect(url_for('feedback_qr'))

    @app.route('/feedback-qr')
    def feedback_qr():
        return render_template('feedback_qr.html')

    @app.route('/feedback-thankyou')
    def feedback_thankyou():
        return render_template('feedback_thankyou.html')

    # Reviews route
    @app.route('/reviews')
    def reviews():
        # Get only feedbacks that have text reviews
        reviews = Feedback.query.filter(Feedback.feedback_text.isnot(None)).order_by(Feedback.created_at.desc()).all()
        return render_template('reviews.html', reviews=reviews)

    # Admin route for viewing feedback
    @app.route('/admin/feedback')
    def view_feedback():
        feedback_list = Feedback.query.order_by(Feedback.created_at.desc()).all()
        return render_template('admin/feedback.html', feedback_list=feedback_list)

    @app.route('/thumbs-up/<int:review_id>', methods=['POST'])
    def thumbs_up(review_id):
        review = Feedback.query.get_or_404(review_id)
        review.thumbs_up_count += 1
        db.session.commit()
        return jsonify({
            'success': True,
            'new_count': review.thumbs_up_count
        })
