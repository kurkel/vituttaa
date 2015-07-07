#coding=utf-8

from flask import Flask
from flask import *
from models import Post
from datetime import datetime
from database import db_session
from sqlalchemy import desc
app = Flask(__name__)
app.debug=True

@app.route('/')
def index():
    if request.method == "GET":
        posts = Post.query.order_by(Post.date.desc()).all()
        return render_template('index.html', posts=posts)

@app.route('/post/', methods=['GET', 'POST'])
def post():
    if request.method == "GET":
        return redirect('/')
    else:
        p = Post(request.form['name'], request.form['fuckings'], datetime.now())
        if p.name == "" and p.post == "":
            return redirect('/')
        elif p.name == "":
            p.name = "Anonoynymous"
        elif p.post == "":
            p.post = "Ei vituta sittenkään."
        db_session.add(p)
        db_session.commit()
        return redirect('/')


if __name__ == '__main__':
    app.debug=True
    app.run()