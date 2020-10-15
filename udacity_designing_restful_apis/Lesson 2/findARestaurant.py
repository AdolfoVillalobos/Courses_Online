from geocode import getGeocodeLocation
import json
import httplib2

# import sys
# import codecs
# sys.stdout = codecs.getwriter('utf8')(sys.stdout)
# sys.stderr = codecs.getwriter('utf8')(sys.stderr)

foursquare_client_id = "" # I Have deleted my keys for obvious reasons
foursquare_client_secret = ""


def find(mealType, location):
	#1. Use getGeocodeLocation to get the latitude and longitude coordinates of the location string.
	latitude, longitude = getGeocodeLocation(location)
	# print("Hello")
	print("----------------------------------------------------")
	print('Location: {}, Latitude: {}, Longitude: {}'.format(location, latitude, longitude))


	url = ('https://api.foursquare.com/v2/venues/search?client_id=%s&client_secret=%s&v=20130815&ll=%s,%s&query=%s' % (foursquare_client_id, foursquare_client_secret,latitude,longitude,mealType))
	h = httplib2.Http()
	result = json.loads(h.request(url,'GET')[1])
	if result['response']['venues']:

		venue = result['response']['venues'][0] # Grab First Venue available
		venue_id = venue['id']
		venue_name = venue['name']
		venue_address = venue['location']['formattedAddress']
		address = ""
		for i in venue_address:
			address += i+" "

		venue_address = address

		venue_info  = {'name':venue_name, 'address':venue_address, 'id':venue_id}
		print(" Venue: {}, Address: {}".format(venue_name, venue_address))

		return venue_info
	else:
		print("No venues found in {}".format(location))
		return "No venues found"

# 	# if result['response']['venues']:
# 	# 	#3.  Grab the first restaurant
# 	# 	restaurant = result['response']['venues'][0]
# 	# 	venue_id = restaurant['id']
# 	# 	restaurant_name = restaurant['name']
# 	# 	restaurant_address = restaurant['location']['formattedAddress']
# 	# 	address = ""
# 	# 	for i in restaurant_address:
# 	# 		address += i + " "
# 	# 	restaurant_address = address
# 	# 	#4.  Get a  300x300 picture of the restaurant using the venue_id (you can change this by altering the 300x300 value in the URL or replacing it with 'orginal' to get the original picture
# 	# 	url = ('https://api.foursquare.com/v2/venues/%s/photos?client_id=%s&v=20150603&client_secret=%s' % ((venue_id,foursquare_client_id,foursquare_client_secret)))
# 	# 	result = json.loads(h.request(url, 'GET')[1])
# 	# 	#5.  Grab the first image
# 	# 	if result['response']['photos']['items']:
# 	# 		firstpic = result['response']['photos']['items'][0]
# 	# 		prefix = firstpic['prefix']
# 	# 		suffix = firstpic['suffix']
# 	# 		imageURL = prefix + "300x300" + suffix
# 	# 	else:
# 	# 		#6.  if no image available, insert default image url
# 	# 		imageURL = "http://pixabay.com/get/8926af5eb597ca51ca4c/1433440765/cheeseburger-34314_1280.png?direct"
# 	# 	#7.  return a dictionary containing the restaurant name, address, and image url
# 	# 	restaurantInfo = {'name':restaurant_name, 'address':restaurant_address, 'image':imageURL}
# 	# 	print("Restaurant Name: {}".format(restaurantInfo['name']))
# 	# 	print("Restaurant Address: {}".format(restaurantInfo['address']))
# 	# 	print("Image: {}".format(restaurantInfo['image']))
# 	# 	return restaurantInfo
# 	# else:
# 	# 	print("No Restaurants Found for {}".format(location))
# 	# 	return "No Restaurants Found"


find("Pizza", "Tokyo, Japan")
find("Tacos", "Jakarta, Indonesia")
find("Tapas", "Maputo, Mozambique")
find("Falafel", "Cairo, Egypt")
find("Spaghetti", "New Delhi, India")
find("Coffee", "Zurich, Switzerland")
find("Sushi", "Los Angeles, California")
find("Steak", "La Paz, Bolivia")
find("Gyros", "Sydney, Australia")

