'use strict';

var React = require('react-native');
var PropertyView = require('./PropertyView');
var {
  StyleSheet,
  Image, 
  View,
  TouchableHighlight,
  ListView,
  Text,
  Component,
  AsyncStorage
} = React;

var styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  },
  noMoreResults: {
    fontSize:18,
    textAlign: 'center'
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

class SearchResults extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shownListings : this.props.searchResponse.listings,
    };
  }

  rowPressed(propertyGuid) {
    var property = this.state.shownListings
      .filter(prop => prop.guid === propertyGuid)[0];
    this.props.navigator.push({
      title: "Property",
      component: PropertyView,
      passProps: {property: property},
      rightButtonTitle: 'Favourite',
      onRightButtonPress: () => {
        var propertyView = new PropertyView();
        propertyView.toggleFavourited(property);
    }});
  }

  _handleResponse(response) {
    var newListings = response.listings;
    var mergedListings = this.state.shownListings.concat(newListings);
    this.setState({shownListings: mergedListings});
  }

  _executeQuery(query) {
    this.setState({ isLoading: true, message: '' });
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json.response))
      .catch(error => {});
  }

  renderRow(rowData, sectionID, rowID) {
    var price = rowData.price_formatted.split(' ')[0];
    return (
      <TouchableHighlight onPress={() => this.rowPressed(rowData.guid)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <Image style={styles.thumb} source={{ uri: rowData.img_url }} />
            <View  style={styles.textContainer}>
              <Text style={styles.price}>£{price}</Text>
              <Text style={styles.title} 
                    numberOfLines={1}>{rowData.title}</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

  fetchNextPage() {
    var nextPage = (this.state.shownListings.length / 20) + 1;
    var query = urlForQueryAndPage('place_name', this.props.searchResponse.locations[0].place_name, nextPage);
    this._executeQuery(query);
  }

  renderFooter(){
    if(this.state.shownListings === undefined || this.state.shownListings.length == 0 || this.state.shownListings.length % 20 != 0)
    {
      return (<Text></Text>);
    }
    return (
      <TouchableHighlight onPress={() => this.fetchNextPage()}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <View  style={styles.textContainer}>
              <Text style={styles.title} 
                    numberOfLines={1}>Load more...</Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.guid !== r2.guid});
    return (
      <ListView
        dataSource={dataSource.cloneWithRows(this.state.shownListings)}
        renderRow={this.renderRow.bind(this)} renderFooter={this.renderFooter.bind(this)}/>
    );
  }
}


module.exports = SearchResults;