from findARestaurant import findARestaurant
from models import Base, Restaurant
from flask import Flask, jsonify, request
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy import create_engine

# import sys
# import codecs
# sys.stdout = codecs.getwriter('utf8')(sys.stdout)
# sys.stderr = codecs.getwriter('utf8')(sys.stderr)



foursquare_client_id = "I3FBYUJ0FHXE2RJK24YYPRVISFSSJAJA15WTKKWSEQ2ZTJPL"
foursquare_client_secret = "XY455AS21HC3V50CLHEVDGZT0JTM0OYY5MTEUZRIA3JD3JEF"
google_api_key = "7f557b2d7e08457dabdc7f607417c6f7"

engine = create_engine('sqlite:///restaurants.db')

Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()
app = Flask(__name__)

@app.route('/restaurants', methods = ['GET', 'POST'])
def all_restaurants_handler():
  if request.method=='GET':
    return getAllRestaurants()
  elif request.method == 'POST':
    print ("Recording a new Restaurant")
    location = request.args.get('location', '')
    mealType = request.args.get('mealType', '')
    venue_info = findARestaurant(location=location, mealType=mealType,
                            foursquare_client_id=foursquare_client_id, foursquare_client_secret=foursquare_client_secret,
                            map_api_key=google_api_key)

    return postNewRestaurant(location=location, mealType=mealType, venue_info=venue_info)

@app.route('/restaurants/<int:id>', methods = ['GET','PUT', 'DELETE'])
def restaurant_handler(id):
  if request.method == 'GET':
    return getRestaurant(id)
  elif request.method=='PUT':
    name = request.args.get('name')
    address = request.args.get('address')
    image = request.args.get('image')

    return updateRestaurant(id, name, address, image)
  elif request.method=='DELETE':
    return deleteRestaurant(id)


def getAllRestaurants():
  restaurants = session.query(Restaurant).all()
  return jsonify(Restaurants=[i.serialize for i in restaurants])

def postNewRestaurant(location, mealType, venue_info):
  if venue_info!="No Restaurants Found":
    restaurant = Restaurant(name = venue_info['name'], address = venue_info['address'], image=venue_info['image'])
    session.add(restaurant)
    session.commit()
    return jsonify(Restaurant=restaurant.serialize)
  else:
    return jsonify({'error': "No Restaurants found in location: {}, meal type: {}".format(location, mealtype)})

def getRestaurant(id):
  restaurant = session.query(Restaurant).filter_by(id = id).one()
  return jsonify(restaurant=restaurant.serialize)

def updateRestaurant(id, name, address, image):
  restaurant = session.query(Restaurant).filter_by(id = id).one()
  if not name:
    restaurant.name = name
  if not address:
    restaurant.address = address
  if not image:
    restaurant.image = image
  session.add(restaurant)
  session.commit()
  return jsonify(restaurant=restaurant.serialize)

def deleteRestaurant(id):
  restaurant = session.query(Restaurant).filter_by(id = id).one()
  session.delete(restaurant)
  session.commit()
  return jsonify(message="Removed Restaurant with id %s" % id)

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)


