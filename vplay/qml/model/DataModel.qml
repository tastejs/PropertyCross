pragma Singleton
import QtQuick 2.0
import QtPositioning 5.3
import Qt.labs.settings 1.0

Item {

  //called when a page of listings has been received from the server
  signal listingsReceived

  //called when the location of the device has been received
  signal locationReceived

  //location type, a coordinate type with latitude, longitude and isValid property
  readonly property var location: positionSource.position.coordinate

  //true when there is data being loaded in the background
  //or when the location is being retrieved
  readonly property bool loading: client.loading || positionSource.active

  //total number of found listings, listings property only contains the first page
  readonly property alias numTotalListings: _.numTotalListings

  //number of listings currently loaded
  readonly property int numListings: _.listings.length

  //list model for listings list page
  readonly property var listings: _.createListingsModel(_.listings)

  //list model for listings list page
  readonly property var favoriteListings: _.createListingsModel(_.favoriteListingsValues)

  //list model for search page location list
  readonly property var locations: _.createLocationsModel()

  //list model for search page recent searches list
  readonly property var recentSearches: _.createRecentSearchesModel()

  readonly property bool isSuggested: _.locationSource === _.locationSourceSuggested
  readonly property bool isRecent: _.locationSource === _.locationSourceRecent
  readonly property bool isError: _.locationSource === _.locationSourceError

  readonly property bool positioningSupported: positionSource.supportedPositioningMethods !==
                                               PositionSource.NoPositioningMethods &&
                                               positionSource.valid

  //let phone search for location, and use it instead of search
  function useLocation() {
    if(positionSource.position.coordinate.isValid) {
      //already have a location
      _.searchByLocation()
    } else {
      _.locationSearchPending = true
      positionSource.update()
    }
  }

  function searchListings(searchText, addToRecents) {
    _.lastSearchText = addToRecents ? searchText : ""
    _.listings = []
    client.search(searchText, _.responseCallback)
  }

  function loadNextPage() {
    client.repeatForPage(_.currentPage + 1, _.responseCallback)
  }

  function toggleFavorite(listingData) {
    if(!isFavorite(listingData)) {
      _.favoriteListings[listingData.guid] = listingData
    } else {
      delete _.favoriteListings[listingData.guid]
    }

    _.favoriteListingsChanged()
  }

  function isFavorite(listingData) {
    return listingData.guid in _.favoriteListings
  }

  function showRecentSearches() {
    _.locationSource = _.locationSourceRecent
  }

  Settings {
    property string recentSearches: JSON.stringify(_.recentSearches)
    property string favoriteListings: JSON.stringify(_.favoriteListings)

    Component.onCompleted: {
      _.recentSearches = recentSearches && JSON.parse(recentSearches) || {}
      _.favoriteListings = favoriteListings && JSON.parse(favoriteListings) || {}
    }
  }

  Client {
    id: client
  }

  PositionSource {
    id: positionSource
    active: false

    onActiveChanged: {
      var coord = position.coordinate
      console.log("Coordinates:", coord.latitude, coord.longitude,
                  "valid:", coord.isValid,
                  "source active:", active)

      if(!active) {
        if(coord.isValid && _.locationSearchPending) {
          _.searchByLocation()
          _.locationSearchPending = false
        }
      }
    }

    onUpdateTimeout: console.log("location timed out")
  }

  Item {
    id: _ //private members

    property int locationSource: locationSourceRecent

    property var favoriteListings: ({})

    property var favoriteListingsValues: getValues(favoriteListings)

    property var recentSearches: ({})

    property var locations: []
    property var listings: []
    property int numTotalListings

    property int currentPage: 1

    property string lastSearchText: ""

    readonly property int locationSourceSuggested: 1
    readonly property int locationSourceRecent: 2
    readonly property int locationSourceError: 3

    readonly property var successCodes: ["100", "101", "110"]
    readonly property var ambiguousCodes: ["200", "202"]

    property bool locationSearchPending: false

    function searchByLocation() {
      locationReceived()
      var coord = positionSource.position.coordinate
      client.searchByLocation(coord.latitude, coord.longitude, _.responseCallback)
    }

    function responseCallback(obj) {
      var response = obj.response
      var code = response.application_response_code
      console.debug("Server returned application code:", code)
      if(successCodes.indexOf(code) >= 0) {
        //found a location -> display listings
        currentPage = parseInt(response.page)
        listings = listings.concat(response.listings)
        numTotalListings = response.total_results || 0
        console.debug("Server returned", response.listings.length, "listings")
        addRecentSearch(qsTr("%1 (%2 listings)").arg(lastSearchText).arg(numTotalListings))
        listingsReceived()
      } else if(ambiguousCodes.indexOf(code) >= 0) {
        //found ambiguous locations -> display locations
        locations = response.locations
        console.debug("Server returned", response.locations.length, "locations")
        addRecentSearch(qsTr("%1 (%2 locations)").arg(lastSearchText).arg(response.locations.length))
        locationSource = locationSourceSuggested
      }
      else if(code === "210") {
        // no result found
        locations = []
        locationSource = locationSourceSuggested
      }
      else {
        //found nothing -> display error
        locations = []
        locationSource = locationSourceError
      }
    }

    function createLocationsModel() {
      return locations.map(function(data) {
        return {
          heading: "Please select a location below",
          text: data.title,
          detailText: data.long_title,
          model: data,
          searchText: data.place_name
        }
      })
    }

    function createRecentSearchesModel() {
      return Object.keys(recentSearches).map(function(text) {
        return {
          heading: "Recent Searches",
          text: recentSearches[text].displayText,
          searchText: text
        }
      })
    }

    function createListingsModel(source) {
      return source.map(function(data) {
        return {
          text: data.price_formatted,
          detailText: data.title,
          image: data.thumb_url,
          model: data
        }
      })
    }

    function addRecentSearch(displayText) {
      if(lastSearchText) {
        recentSearches[lastSearchText] = {
          displayText: displayText
        }
        recentSearchesChanged()
      }
    }

    //extract all values from a JS dict as array
    function getValues(obj) {
      return Object.keys(obj).map(
            function(key) {
              return obj[key]
            })
    }
  }
}

