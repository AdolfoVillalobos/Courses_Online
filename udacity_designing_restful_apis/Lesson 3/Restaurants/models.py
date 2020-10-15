# -*- coding: utf-8 -*-
from sqlalchemy import Column,Integer,String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy import create_engine





Base = declarative_base()
class Restaurant(Base):
  __tablename__ = 'restaurant'
  id = Column(Integer, primary_key = True)
  name = Column(String)
  address = Column(String)
  image = Column(String)

  #Add a property decorator to serialize information from this database
  @property
  def serialize(self):
    return {
      'restaurant_name': self.name,
      'restaurant_address': self.address,
      'restaurant_image' : self.image,
      'id' : self.id

      }

engine = create_engine('sqlite:///restaurants.db')

Base.metadata.create_all(engine)
