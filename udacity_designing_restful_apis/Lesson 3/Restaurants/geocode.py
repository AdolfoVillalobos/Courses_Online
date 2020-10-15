import httplib2
import json

def getGeocodeLocation(inputString, map_api_key):

    # I didnt use Google's api because it's not free anymore.

    locationString = inputString.replace(" ", "+")
    url = ("https://api.opencagedata.com/geocode/v1/json?q={}&key={}".format(locationString, map_api_key))
    h = httplib2.Http()
    result = json.loads(h.request(url, 'GET')[1])
    latitude = result['results'][0]['geometry']['lat']
    longitude = result['results'][0]['geometry']['lng']
    return (latitude, longitude)




