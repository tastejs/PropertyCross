import QtQuick 2.5
import VPlayApps 1.0

import "../model"

Page {
  id: searchPage
  title: qsTr("Property Cross")

  rightBarItem: NavigationBarRow {
    ActivityIndicatorBarItem {
      visible: DataModel.loading
      showItem: showItemAlways
    }

    IconButtonBarItem {
      icon: IconType.heart
      onClicked: showListings(true)
      title: qsTr("Favorites")
    }
  }

  Column {
    id: contentCol
    anchors.left: parent.left
    anchors.top: parent.top
    anchors.right: parent.right
    anchors.margins: contentPadding
    spacing: contentPadding

    AppText {
      width: parent.width
      wrapMode: Text.WrapAtWordBoundaryOrAnywhere
      text: qsTr("Use the form below to search for houses to buy. You can search by place-name, postcode, or click 'My location', to search in your current location")
    }

    AppTextField {
      id: searchInput
      width: parent.width

      showClearButton: true
      placeholderText: qsTr("Search")
      inputMethodHints: Qt.ImhNoPredictiveText

      onTextChanged: showRecentSearches()
      onEditingFinished: if(navigationStack.currentPage === searchPage) search()
    }

    Row {
      spacing: contentPadding

      AppButton {
        text: qsTr("Go")
        onClicked: search()
      }

      AppButton {
        text: qsTr("My location")
        enabled: DataModel.positioningSupported

        onClicked: {
          searchInput.text = ""
          searchInput.placeholderText = qsTr("Looking for location...")
          DataModel.useLocation()
        }
      }
    }

    AppText {
      visible: DataModel.isError
      text: qsTr("There was a problem with your search")
    }
  }

  AppListView {
    id: listView

    width: parent.width
    anchors.top: contentCol.bottom
    anchors.bottom: parent.bottom

    visible: !DataModel.isError

    // Show either the recents searches or the currently found locations depending on search mode
    model: prepareArraySections(DataModel.isRecent ? DataModel.recentSearches : DataModel.locations)

    // Show a section header for listings
    section.property: "heading"
    section.delegate: SimpleSection { }

    delegate: SimpleRow {
      // do not add suggestions to recent searches
      onSelected: DataModel.searchListings(item.searchText, false)
    }

    emptyText.text: DataModel.isRecent
                    ? qsTr("No recent searches.")
                    : qsTr("No suggested locations.")
  }

  Connections {
    target: DataModel
    onListingsReceived: showListings(false)
    onLocationReceived: if(searchInput.placeholderText === "Looking for location...") searchInput.placeholderText = "Search"
  }

  Component {
    id: listPageComponent
    ListingsListPage {}
  }

  function showListings(favorites) {
    if(navigationStack.depth === 1) {
      navigationStack.popAllExceptFirstAndPush(listPageComponent, { favorites: favorites })
    }
  }

  function search() {
    DataModel.searchListings(searchInput.text, true)
  }

  function showRecentSearches() {
    DataModel.showRecentSearches()
  }
}
