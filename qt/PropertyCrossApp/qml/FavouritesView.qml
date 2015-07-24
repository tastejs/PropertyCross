import QtQuick 2.0
import QtQuick.Layouts 1.2
import QtQuick.Controls 1.4

Item {
//    anchors.fill: parent
    id: favouritesView
    state:"showingFavourites"
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
    anchors.fill: parent
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
                            stack.push("qrc:///qml/PropertyView.qml")
//                            favouritesView.visible = false;
//                            favouritesView.enabled = false;
//                            propertyView.focus = true;
//                            propertyView.visible = true;
//                            propertyView.enabled = true;
                            //propertyLayout.loadProperty(guid, summary,price, bedrooms,bathrooms,propertyType,title, thumbnailUrl, imageUrl)
                            cppShownProperty.changeProperty(guid, summary,price, bedrooms,bathrooms,propertyType,title, thumbnailUrl, imageUrl)
                        }
                    }
                }
            }
        } //end of ListView
}
