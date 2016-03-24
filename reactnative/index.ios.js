'use strict';

var React = require('react-native');
var SearchPage = require('./SearchPage');
var Favourites = require('./Favourites');

var styles = React.StyleSheet.create({
  container: {
    flex: 1
  }
});

class PropertyFinderApp extends React.Component {
  render() {
    return (
      <React.NavigatorIOS
        ref="nav"
        style={styles.container}
        initialRoute={{
          title: 'Property Cross',
          component: SearchPage,
          rightButtonTitle: 'Favourites',
          onRightButtonPress: () => {
          this.refs.nav.navigator.push({
          title: "Favourites",
          component: Favourites,
          });}
        }}/>
    );
  }
}

React.AppRegistry.registerComponent('PropertyFinder',
  function() { return PropertyFinderApp });
