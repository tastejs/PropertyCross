import QtQuick 2.0
import QtQuick.Layouts 1.2
import QtQuick.Window 2.2

Rectangle {
//    width: 640
//    height:800
    anchors.fill: parent
//    title: "PropertyCross"
    id: searchResultsWindow
//    focus: true

    Keys.onReleased: {
        console.log("Key pressed!")
//        if (event.key === Qt.Key_Back) {
            console.log("Back key!")
            event.accepted = true;
        searchResultsWindow.visible = false
        searchResultsWindow.enabled = false
        rootView.visible = true
        rootView.enabled = true
        rootView.focus = true
 //       }
    }

    ColumnLayout {
        anchors.fill: parent
        spacing: 5

        ListView {
            id: listView_recentSearches
            objectName: "listView_recentSearches"
//            width: parent.width
//            height: parent.height
            Layout.fillHeight: true
            Layout.fillWidth: true
            model: cppPropertyListing
            delegate: Item {
                id: propertyDelegate
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
                            searchResultsWindow.visible = false;
                            searchResultsWindow.enabled = false;
                            propertyView.focus = true;
                            propertyView.visible = true;
                            propertyView.enabled = true;
                            propertyView.propertyLayout.loadProperty(summary,price, bedrooms,bathrooms,propertyType,title, imageUrl)
                        }
                    }
                }
            }
        } //end of ListView

        Text {
            text: "Showing..."
            Layout.preferredHeight: 80
            MouseArea {
                anchors.fill: parent
                Layout.fillWidth: true
                onClicked: {
                    console.log("Clicked on more")
                }
            }
        }
    }
}
