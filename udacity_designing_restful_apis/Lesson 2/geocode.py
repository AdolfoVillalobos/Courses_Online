import httplib2
import json

def getGeocodeLocation(inputString):

    # I didnt use Google's api because it's not free anymore.

    api_key = "" #I Have deleted my keys for obvious reasons
    locationString = inputString.replace(" ", "+")
    url = ("https://api.opencagedata.com/geocode/v1/json?q={}&key={}".format(locationString, api_key))
    h = httplib2.Http()
    result = json.loads(h.request(url,'GET')[1])
    latitude = result['results'][0]['geometry']['lat']
    longitude = result['results'][0]['geometry']['lng']
    return (latitude, longitude)




