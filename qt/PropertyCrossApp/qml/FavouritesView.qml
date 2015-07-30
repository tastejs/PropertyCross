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
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            Layout.fillHeight: true
            Layout.fillWidth: true
            width: favouritesView.width
            model: cppFavouritesListing
            delegate: Item {
                id: favouritedPropertyDelegate
                Layout.fillWidth: true
                height: favouritesView.height/9
                Rectangle {
                    Layout.fillWidth: true
                    height: favouritedPropertyDelegate.height
                    width: listView_FavouritedProperties.width
                    Layout.fillHeight: true
                    id: rectangle_favouritedPropertyRow
                    color: "#00FFFFFF"
                    Image {
                        id: image_favouritedProperty
                        width:parent.height
                        height:parent.height
                        source: thumbnailUrl
                        sourceSize.height: parent.height
                        sourceSize.width: parent.width
                    }

                    ColumnLayout {
                        anchors.left: image_favouritedProperty.right
                        height: parent.height
                        Text {
                            horizontalAlignment: Text.AlignRight
                            text: "<b>£"+price+"</b>"
                            height: parent.height
                            verticalAlignment: Text.AlignVCenter
                            id: text_favouritedPropertyPrice
                            Layout.leftMargin: rootView.activeMargin
                        }
                        Text {
                            id: titleText
                            text: title+", "+bedrooms+" bed "+propertyType
                            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
                            color: "darkgrey"
                            Layout.leftMargin: rootView.activeMargin
                            Layout.rightMargin: rootView.activeMargin
                            width: rootView.width- Layout.leftMargin-Layout.rightMargin
                            Layout.maximumWidth: rootView.width- Layout.leftMargin-Layout.rightMargin-image_favouritedProperty.width
                        }
                    }

                    MouseArea {
                        anchors.fill: parent
                        width: listView_FavouritedProperties.width
                        height: parent.height
                        onClicked: {
                            console.log("Clicked on "+title)
                            stack.push("qrc:///qml/PropertyView.qml")
                            cppShownProperty.changeProperty(guid, summary,price, bedrooms,bathrooms,propertyType,title, thumbnailUrl, imageUrl)
                        }
                        onPressedChanged: {
                            if(pressed)
                                rectangle_favouritedPropertyRow.color = 'silver'
                            else
                                rectangle_favouritedPropertyRow.color = '#00FFFFFF'
                        }
                    }
                    Rectangle {
                        color: index==0 ? '#00000000' : "lightgrey"
                        height: 2
                        width: rootView.width- Layout.leftMargin-Layout.rightMargin
                        Layout.leftMargin: rootView.activeMargin
                        Layout.rightMargin: rootView.activeMargin
                    }
                }
            }
        } //end of ListView
    }
}
