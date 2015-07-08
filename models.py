from vittu import db

class Post(db.Model):
    id = Column(db.Integer, primary_key=True)
    name = Column(db.String(50))
    post = Column(db.String)
    date = Column(DateTime)

    def __init__(self, name=None, post=None, date=None):
        self.name = name
        self.post = post
        self.date = date

    def __repr__(self):
        return '<User %r>' % (self.name)

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}