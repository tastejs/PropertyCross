'use strict';

var React = require('react-native');
var PropertyView = require('./PropertyView');
var SearchPage = require('./SearchPage');
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
  listView:{
    top:55
  },
  errorMessage:{
    top:85,
    fontSize:18,
    color: '#656565'
  }
});

class Favourites extends Component {

  constructor(props) {
    super(props);
    this.state = {
      noFavouritesMessage: 'You have not added any properties to your favourites.'
    };
    this.displayFavourites();
  }

  rowPressed(propertyGuid) {
    var property = JSON.parse(this.state.favourites)
    .filter(prop => prop.guid === propertyGuid)[0];
    this.props.navigator.push({
      title: "Property",
      component: PropertyView,
      passProps: 
        {property: property},
        rightButtonTitle: 'Favourite',
        onRightButtonPress: () => {
          this.toggleFavourited(property);
        }
    })
  };

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

  displayFavourites(){
    AsyncStorage.getItem("favourites").then((favourites) => {
      if(favourites == undefined || favourites.length === 0)
      {
        return;
      }
      else
      {
        try
        {
          this.setState({favourites: JSON.parse(favourites)});
        }
        catch(err)
        {
          this.setState({favourites: favourites});
        }
      }
    }).done();
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

  render() {
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.guid !== r2.guid});
    if(this.state.favourites == undefined || JSON.parse(this.state.favourites).length == 0)
    {
      return (<Text style={styles.errorMessage}>{this.state.noFavouritesMessage}</Text>);
    }
    else
    {
      return (<ListView style={styles.listView} dataSource={dataSource.cloneWithRows(JSON.parse(this.state.favourites))} renderRow={this.renderRow.bind(this)}/>);
    }
  }
}


module.exports = Favourites;