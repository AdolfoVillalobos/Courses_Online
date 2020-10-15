from geocode import getGeocodeLocation
import json
import httplib2

# import sys
# import codecs
# sys.stdout = codecs.getwriter('utf8')(sys.stdout)
# sys.stderr = codecs.getwriter('utf8')(sys.stderr)


def findARestaurant(mealType, location, foursquare_client_id, foursquare_client_secret, map_api_key):
	#1. Use getGeocodeLocation to get the latitude and longitude coordinates of the location string.
	latitude, longitude = getGeocodeLocation(location, map_api_key)
	# print("Hello")
	print("----------------------------------------------------")
	print('Location: {}, Latitude: {}, Longitude: {}'.format(location, latitude, longitude))


	url = ('https://api.foursquare.com/v2/venues/search?client_id=%s&client_secret=%s&v=20130815&ll=%s,%s&query=%s' % (foursquare_client_id, foursquare_client_secret,latitude,longitude,mealType))
	h = httplib2.Http()
	result = json.loads(h.request(url,'GET')[1])
	if result['response']['venues']:

		venue = result['response']['venues'][0] # Grab First Venue available
		venue_name = venue['name']
		venue_address = venue['location']['formattedAddress']
		address = ""
		for i in venue_address:
			address += i+" "

		venue_address = address
		venue_image = ''
		venue_info =  {'name':venue_name, 'address':venue_address, 'image':venue_image}
		return venue_info
	else:
		print("No venues found in {}".format(location))
		return "No Restaurants Found"
