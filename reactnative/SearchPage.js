'use strict';

var React = require('react-native');
var SearchResults = require('./SearchResults');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component,
  ListView,
  AsyncStorage,
  Platform,
  ProgressBarAndroid
} = React;

var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  goButton: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  locationButton: {
    height: 36,
    flex: 3,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  image: {
    width: 217,
    height: 138
  },
  bottomAreaTitleText: {
    fontSize:20
  },
  recentSearchText: {
    fontSize: 16,
  }
});

function urlForQueryAndPage(key, value, pageNumber) {
  var data = {
      country: 'uk',
      pretty: '1',
      encoding: 'json',
      listing_type: 'buy',
      action: 'search_listings',
      page: pageNumber
  };
  data[key] = value;

  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'http://api.nestoria.co.uk/api?' + querystring;
};

class SearchPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      isLoading: false,
      message: '',
      pastSearches: []
    };
    AsyncStorage.getItem("pastSearches").then((storedSearches) => {
        var searches = storedSearches != undefined ? JSON.parse(storedSearches) : [];
        this.setState({'pastSearches':searches});
    });
  }

  _handleResponse(response, coordinatesUsed) {
    this.setState({isLoading: false });
    this.setState({locations: undefined});
    if(response.application_response_code == 201)
    {
       this.setState({ message: 'The location given was not recognised.'});
       return;
    }
    if (response.application_response_code.substr(0, 1) === '1') {
      if(!coordinatesUsed)
      {
        this.saveSearch(response);
      }
      if(response.listings == undefined || response.listings.length === 0)
      {
        this.setState({message: 'There were no properties found for the given location.'});
        return;
      }
      this.props.navigator.push({
        title: 'Results',
        component: SearchResults,
        passProps: {searchResponse: response}
      });
    }
    else
    {
      if(response.application_response_code === 210)
      {
        this.setState({ message: 'Location not recognized please try again.'});
      }
      else
      {
        this.setState({locations: response.locations});
      }
    }
  }

  _executeQuery(query, coordinatesUsed) {
    this.setState({ isLoading: true, message: '' });
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json.response, coordinatesUsed))
      .catch(error => {
        this.setState({
          isLoading: false,
          message: 'There was a problem with your search.'
        });
      });
  }

  onSearchPressed() {
    if(this.state.searchString === '')
    {
      this.setState({message: 'Please enter a search string.'});
      return;
    }
    var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
    this._executeQuery(query);
  }

  onPastSearchPressed(pastSearchNumber) {
    var searchLocation = this.state.pastSearches[pastSearchNumber].search;
    var query = urlForQueryAndPage('place_name', searchLocation, 1);
    this._executeQuery(query);
  }

  onListedLocationPressed(locationName) {
    var query = urlForQueryAndPage('place_name', locationName, 1);
    this._executeQuery(query);
  }

  saveSearch(response)
  {
    var tempSearches = this.state.pastSearches;
    var newPastSearch = {search:response.locations[0].title, results: response.total_results};
    tempSearches.forEach((current,index) => {
      if(current.search === newPastSearch.search)
      {
        tempSearches.splice(index,1);
      }
    });
    tempSearches.unshift(newPastSearch);
    if(tempSearches.length > 6)
    {
      tempSearches.pop();
    }
    this.setState({"pastSearches":tempSearches});
    AsyncStorage.setItem("pastSearches",JSON.stringify(tempSearches));
  }

  onLocationButtonPressed() {
    navigator.geolocation.getCurrentPosition(
      location => {
        var search = location.coords.latitude + ',' + location.coords.longitude;
        this.setState({ searchString: search });
        var query = urlForQueryAndPage('centre_point', search, 1);
        this._executeQuery(query, true);
      },
      error => {
        if(error.code === error.PERMISSION_DENIED)
        {
          this.setState({
          message: 'The use of location is currently disabled.'
          });
        }
        else if(error.code === error.POSITION_UNAVAILABLE)
        {
          this.setState({
            message: 'Unable to detect current location. Please ensure location is turned on in your phone settings and try again.'
          });
        }
        else if(error.code === error.TIMEOUT)
        {
          this.setState({
            message: 'The request to get your location timed out.'
          });
        }
        else
        {
          this.setState({
            message: 'An unknown error occurred whilst attempting to get your location.'
          });
        }
      });
  }

  toggleFavourited(property){
    AsyncStorage.getItem("favourites").then((value) =>
    {
      var tempFavourites = value != undefined ? JSON.parse("" + value +"") : [];
      var alreadyExists = false;
      for(var i = 0; i < tempFavourites.length; i++)
      {
        if(tempFavourites[i].guid == property.guid)
        {
          tempFavourites.splice(i,1);//remove the property from favourites
          alreadyExists = true;
        }
      }
      if(!alreadyExists)
      {
        tempFavourites.push(property);
      }
      AsyncStorage.setItem("favourites", JSON.stringify(tempFavourites)).then().done();
      this.setState({favourites: JSON.stringify(tempFavourites)});
    }).done();
  }

  onSearchTextChanged(event) {
    this.setState({ searchString: event.nativeEvent.text });
  }

  render() {
    var spinner = (<View/>);
    if(this.state.isLoading)
    {
      spinner = Platform.OS === 'ios' ? 
      (<ActivityIndicatorIOS
        hidden='true'
        size='large'/>)
      :
      (<ProgressBarAndroid
      styleAttr="Large"/>);
    }
    else
    var spinner = this.state.isLoading ?
    ( <ActivityIndicatorIOS
        hidden='true'
        size='large'/> ) :
    ( <View/>);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var bottomAreaTitle = "Recent Searches:";
    var locations = [];
    if(this.state.locations !== undefined)
    {
      this.state.locations.forEach((location, index) =>{
        locations.push(<Text key={index} style={styles.recentSearchText} onPress={()=>this.onListedLocationPressed(location.place_name)}>{this.state.locations[index].long_title}</Text>);
      });
      bottomAreaTitle = "Locations:";
    }
    var searchesArea = [];
    if(locations.length == 0)
    {
      this.state.pastSearches.forEach((search,index) => {
        searchesArea.push(<Text key={index} style={styles.recentSearchText} onPress={()=>this.onPastSearchPressed(index)}>{this.state.pastSearches[index].search} ({this.state.pastSearches[index].results | 0})</Text>);
      });
    }
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Use the form below to search for houses to buy. You can search by place-name, postcode, or click 'My location', to search in your current location.
        </Text>
        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            placeholder='Search via name or postcode'
            value={this.state.searchString}
            onChange={this.onSearchTextChanged.bind(this)}/>
        </View>
        <View style={styles.flowRight}>
          <TouchableHighlight style={styles.goButton}
              underlayColor='#99d9f4'
              onPress={this.onSearchPressed.bind(this)}>
              <Text style={styles.buttonText}>Go</Text>
            </TouchableHighlight>
          <TouchableHighlight style={styles.locationButton}
              onPress={this.onLocationButtonPressed.bind(this)}
              underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Location</Text>
          </TouchableHighlight>
        </View>
        {spinner}
          <Text style={styles.description}>{this.state.message}</Text>
          <View style={styles.alignLeft}>
            <Text style={styles.bottomAreaTitleText}>{bottomAreaTitle}</Text>
            {searchesArea}
            {locations}
        </View>
      </View>
    );
  }
}

module.exports = SearchPage;