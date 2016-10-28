import QtQuick 2.0
import VPlayApps 1.0

import "../model"

ListPage {
  id: listPageWrapper

  property var scrollPos: null
  property bool favorites

  Component {
    id: detailPageComponent
    ListingDetailPage { }
  }

  rightBarItem: ActivityIndicatorBarItem {
    visible: DataModel.loading
  }

  model: favorites ? DataModel.favoriteListings : DataModel.listings

  title: favorites
         ? qsTr("Favorites")
         : qsTr("%1 of %2 matches").arg(
             DataModel.numListings).arg(
             DataModel.numTotalListings)

  emptyText.text: favorites
                  ? qsTr("You have not added any properties to your favourites.")
                  : qsTr("No listings available.")

  listView.footer: VisibilityRefreshHandler {
    // visible if NOT favorites shown and more listings are available
    visible: !favorites && DataModel.numListings < DataModel.numTotalListings

    onRefresh: {
      scrollPos = listView.getScrollPosition()
      DataModel.loadNextPage()
    }
  }

  delegate: SimpleRow {
    autoSizeImage: true
    imageMaxSize: dp(40)
    image.fillMode: Image.PreserveAspectCrop

    onSelected: navigationStack.popAllExceptFirstAndPush(detailPageComponent, {model: item.model})
  }

  listView.onModelChanged: if(scrollPos) listView.restoreScrollPosition(scrollPos)
}


