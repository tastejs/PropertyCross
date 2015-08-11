import QtQuick 2.0
import QtQuick.Layouts 1.2
import QtQuick.Controls 1.4

Item {
    id: favouritesView
    state:"showingFavourites"
    Layout.leftMargin: rootView.activeMargin
    Layout.rightMargin: rootView.activeMargin
    ColumnLayout {
        Layout.leftMargin: rootView.activeMargin
        Layout.rightMargin: rootView.activeMargin
        anchors.fill: parent
        spacing: 5

        Text {
            id: text_noFavourites
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            anchors.fill: parent
            verticalAlignment: Text.AlignVCenter
            horizontalAlignment: Text.AlignHCenter
            text: "No Favourites yet"
            visible:  {
                if(listView_FavouritedProperties.count==0) {
                    true
                } else {
                    false
                }
            }
        }

        ListView {
            id: listView_FavouritedProperties
            Layout.rightMargin: rootView.activeMargin
            Layout.fillHeight: true
            Layout.fillWidth: true
            width: favouritesView.width
            model: cppFavouritesListing
            delegate: DelegateProperties {}
        } //end of ListView
    }
}
