import QtQuick 2.0
import QtQuick.Layouts 1.2

Rectangle {
    anchors.fill: parent
    focus: true
    Keys.onReleased: {
        console.log("Key pressed!")
//        if (event.key === Qt.Key_Back) {
            console.log("Back key!")
        event.accepted            = true;
        favouritesView.visible      = false
        favouritesView.enabled      = false
        rootView.visible = true
        rootView.enabled = true
        rootView.focus   = true
 //       }
    }
    Text {
        id: text_noFavourites
//        text: "No favourites"
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
//            objectName: "listView_FavouritedProperties"
//            width: parent.width
//            height: parent.height
            Layout.fillHeight: true
            Layout.fillWidth: true
            model: cppFavouritesListing
            delegate: Item {
                id: favouritedPropertyDelegate
                //            x: 5
                Layout.fillWidth: true
                height: 80
                RowLayout {

                    Image {
                        width:50
                        height:50
                        source: thumbnailUrl
                        sourceSize.height: 80
                        sourceSize.width: 80
                    }

                    ColumnLayout {
                        Text {
                            horizontalAlignment: Text.AlignRight
                            text: "<b>£"+price+"</b>"
                        }
                        Text {
                            id: titleText
                            text: title+", "+bedrooms+" bed "+propertyType
                        }
                    }

                    MouseArea {
                        anchors.fill: parent
                        onClicked: {
                            console.log("Clicked on "+title)
                            favouritesView.visible = false;
                            favouritesView.enabled = false;
                            propertyView.focus = true;
                            propertyView.visible = true;
                            propertyView.enabled = true;
                            propertyView.propertyLayout.loadProperty(guid, summary,price, bedrooms,bathrooms,propertyType,title, thumbnailUrl, imageUrl)
                        }
                    }
                }
            }
        } //end of ListView
}
