'use strict';

var React = require('react-native');

var {
Navigator,
Text,
View
} = React;

var SearchPage = require('./SearchPage');
var SearchResults = require('./SearchResults');
var Favourites = require('./Favourites');
var Property = require('./PropertyView');

var styles = React.StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    backgroundColor: 'white',
  },
  navbarTitle :{
    fontSize:20,
    color: '#48BBEC',
    left:180,
    top:13
  },
  backButton: {
    color:'#48BBEC',
    top:14,
    left: 1,
    fontSize:17,
  },
  rightButton: {
    color: '#48BBEC',
    top:14,
    right:1,
    fontSize:17,
  }
});

class PropertyCrossApp extends React.Component {
  render() {
    var NavigationBarRouteMapper = { 
      LeftButton: function( route, navigator, index, navState ){
        return route.title != 'Property Cross' ? (<Text style={styles.backButton} onPress={() =>{
          navigator.pop();
        }
       }>Back</Text>) : (<View/>); 
      },
      Title: function( route, navigator, index, navState ){
        return(<Text style={styles.navbarTitle}>{ route.title }</Text>)
      },
      RightButton: function( route, navigator, index, navState ){
        return(<Text style={styles.rightButton} onPress={() => route.onRightButtonPress(navigator)}>{ route.rightButtonTitle }</Text>)
      }
    }
    return (<Navigator ref="nav" style={styles.container} initialRoute={{title: 'Property Cross', rightButtonTitle: 'Favourites',
            onRightButtonPress: (navigator) =>{ navigator.push({title: 'Favourites', component: Favourites})}}} renderScene={(route, navigator) =>
             {
              return this.renderScene(route, navigator)}}
                navigationBar=
                {
                  <Navigator.NavigationBar style={styles.navBar} routeMapper={ NavigationBarRouteMapper } />
                }/>
          );
  }

  renderScene(route, navigator)
  {
    switch(route.title){
      case 'Property Cross':
      return (<SearchPage navigator={navigator} />);
      case 'Results':
      return (<SearchResults searchResponse={route.passProps.searchResponse} navigator={navigator}/>);
      case 'Property':
      return (<Property property={route.passProps.property} navigator={navigator} />);
      case 'Favourites':
      return (<Favourites navigator={navigator}/>);
      default:
      return (<View/>);
    }
  }
}

React.AppRegistry.registerComponent('PropertyCross',
  function() { return PropertyCrossApp });
