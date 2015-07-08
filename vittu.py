#coding=utf-8
import json
from flask import Flask
from flask import *
from datetime import datetime
from flask.ext.sqlalchemy import SQLAlchemy
import zmq
import time
import sys

app = Flask(__name__)
app.debug=True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(app)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    post = db.Column(db.String)
    date = db.Column(db.DateTime)

    def __init__(self, name=None, post=None, date=None):
        self.name = name
        self.post = post
        self.date = date

    def __repr__(self):
        return '<User %r>' % (self.name)

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

context = zmq.Context()
socket = context.socket(zmq.REQ)
socket.connect("tcp://localhost:%s" % 9090)

@app.route('/')
def index():
    if request.method == "GET":
        return render_template('index.html')

@app.route('/post/', methods=['POST'])
def post():
    if request.method == "GET":
        return redirect('/')
    else:
        p = Post(request.form['name'], request.form['fuckings'], datetime.now())
        if p.name == "" and p.post == "":
            return
        elif p.name == "":
            p.name = "Anonoynymous"
        elif p.post == "":
            p.post = "Ei vituta sittenkään."
        db.session.add(p)
        db.session.commit()
        maxid = db.session.query(Post).order_by(Post.date.desc()).all()
        max_id = max(post.id for post in maxid)
        socket.send_string(str(max_id))
        socket.recv()
        return 'oke'

@app.route('/posts/<int:post_id>')
def get(post_id):
    posts = db.session.query(Post).order_by(Post.date.desc()).all()
    dic = {}
    for post in posts:
        dic[post.name] = post.as_dict()

    return json.dumps(dic)




if __name__ == '__main__':
    app.debug=True
    app.run()
