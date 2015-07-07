from sqlalchemy import Column, Integer, String, DateTime
from database import Base

class Post(Base):
    __tablename__ = 'posts'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    post = Column(String)
    date = Column(DateTime)

    def __init__(self, name=None, post=None, date=None):
        self.name = name
        self.post = post
        self.date = date

    def __repr__(self):
        return '<User %r>' % (self.name)