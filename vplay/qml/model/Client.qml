import QtQuick 2.0

Item {
  readonly property bool loading: _.numRequests > 0

  //search for locations called "text"
  function search(text, callback) {
    _.sendRequest({
                    action: "search_listings",
                    page: 1,
                    place_name: text
                  }, callback)
  }

  function searchByLocation(latitude, longitude, callback) {
    _.sendRequest({
                    action: "search_listings",
                    page: 1,
                    centre_point: latitude + "," + longitude
                  }, callback)
  }

  //repeat last request for another page number
  function repeatForPage(page, callback) {
    var params = _.lastParamMap
    params.page = page
    _.sendRequest(params, callback)
  }

  Item {
    id: _ //private members

    //number of active HTTP requests
    property int numRequests: 0

    property var lastParamMap: ({})

    //server API URL with common parameters already included
    readonly property string serverUrl: "http://api.nestoria.co.uk/api?country=uk&pretty=1&encoding=json&listing_type=buy"

    //add GET parameters to serverUrl
    function buildUrl(paramMap) {
      var url = serverUrl
      for(var param in paramMap) {
        url += "&" + param + "=" + paramMap[param]
      }
      return url
    }

    function sendRequest(paramMap, callback) {
      var method = "GET"
      var url = buildUrl(paramMap)

      var request = new XMLHttpRequest()
      request.onreadystatechange = readyStateChange(request, callback)
      request.open(method, url)

      console.debug(method + " " + url)
      numRequests++
      request.send()

      lastParamMap = paramMap
    }

    function readyStateChange(request, callback) {
      return function() {
        if(request.readyState === XMLHttpRequest.DONE) {
          console.debug("HTTP request done, response status:", request.status)
          if(request.status === 200) {
            var content = request.responseText
            try {
              var obj = JSON.parse(content)
            } catch(ex) {
              console.error("Could not parse server response as JSON:", ex)
              return
            }
            console.debug("Successfully parsed JSON response")
            callback(obj)
          }
          numRequests--
        }
      }
    }
  }
}

