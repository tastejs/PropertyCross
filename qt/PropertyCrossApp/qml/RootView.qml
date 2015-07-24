import QtQuick 2.0
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.2

Item {
    id: rootView
    state: "showingRoot"
    width: 640

    //Text eliding doesn't seem to work in a Layout, so put Text outside of layout
        Text {
            id: textIntroduction
            wrapMode: Text.WordWrap
            elide: Text.ElideRight
            anchors.left: parent.left
            width: parent.width
            text: "Use the form below to search for houses to buy. You can search by place-name, postcode, or click 'My location', to search in your current location!"
            textFormat: Text.PlainText
        }
    ColumnLayout {
        spacing: 5
        clip: true
        anchors.top:  textIntroduction.bottom
        height: parent.height
        width: parent.width

        TextField {
            id: textFieldSearchLocation
            Layout.fillWidth: true;
            width: mainWindow.width
            Keys.onReturnPressed:
            {
                Qt.inputMethod.hide();
            }
        }

        Button {
            id:buttonGo
            objectName: "buttonGo"
//            width: mainWindow.width
            text: qsTr("Go")
            anchors.horizontalCenter: parent.horizontalCenter
            Layout.fillWidth: true
//            signal searchFor(string msg, int page)
                onClicked: {
                    console.log("Clicked Go Button");
//                    buttonGo.searchFor(textFieldSearchLocation.text, 0)
                    stack.push("qrc:///qml/SearchResultsView.qml")
                    cppPropertyListing.resetListing()
                    cppJsonHandler.getFromString(textFieldSearchLocation.text, 0)
                    label_status.text = ""
                }
            Keys.onReturnPressed:
            {
                Qt.inputMethod.hide();
            }
        }

        Button {
            id:buttonMyLocation
            text: qsTr("My Location")
            anchors.horizontalCenter: parent.horizontalCenter
            Layout.fillWidth: true
                onClicked: {
                    console.log("Clicked My location Button");
                    cppGpsPosition.getPosition();
                }
        }

        Label {
           id: label_status
           objectName: "label_status"
           text: ""
            Connections {
                target: cppJsonHandler
                onErrorRetrievingRequest: {
               label_status.text = "The location given was not recognised"
                    console.log("in error Retrieving from JsonHandler")
                    stack.pop()
                }
            }
            Connections {
                target: cppGpsPosition
                onGetPositionError: {
               label_status.text = "The location given was not recognised"
                    console.log("in error Retrieving from GPSHandler")
                    stack.pop()
                }
            }
        }

        Label {
            id: label_recentSearches
            text: qsTr("<b>Recent searches</b>")
            Rectangle {
                border.color: "black"
                border.width: 2
                width: mainWindow.width
            }
        }

        ListView {
            id: listView_recentSearches
            width: mainWindow.width
            Layout.fillHeight: true
            //Layout.fillWidth: true

            model: cppRecentSearches
            delegate: Item {
                x: 5
                Layout.fillWidth: true
                height: 40
                RowLayout {
                    Text {
                        text: search
                    }
                    Text {
                        horizontalAlignment: Text.AlignRight
                        text: "("+results+")"
                    }
                    MouseArea {
                        anchors.fill: parent
                        onClicked: {
                            console.log("Clicked on "+search)
                    cppJsonHandler.getFromString(search, 0)
                    stack.push("qrc:///qml/SearchResultsView.qml")
                    cppPropertyListing.resetListing()
                        }
                    }
                }
            }
        } //end listview

        Label {
            id: label_suggestedLocations
            text: qsTr("<b>Please select a location below</b>")
            visible: false
            Rectangle {
                border.color: "black"
                border.width: 2
                width: mainWindow.width
            }
            Connections {
                target: cppJsonHandler
                onLocationsReady: {
                    label_suggestedLocations.visible = true
                    listView_suggestedLocations.visible = true
                    label_recentSearches.visible = false
                    listView_recentSearches.visible = false
//                    stack.push("qrc:///qml/SearchResultsView.qml")
                    stack.pop()
                    console.log("in Suggesting locations")
                }
            }
        }

        ListView {
            id: listView_suggestedLocations
            visible: false
            width: mainWindow.width
            Layout.fillHeight: true
            //Layout.fillWidth: true

            model: cppSuggestedLocations
            delegate: Item {
                x: 5
                Layout.fillWidth: true
                height: 40
                RowLayout {
                    Text {
                        text: displayName
                    }
                    MouseArea {
                        anchors.fill: parent
                        onClicked: {
                            console.log("Clicked on "+displayName)
                    cppJsonHandler.getFromString(displayName, 0)
                    label_suggestedLocations.visible = false
                    listView_suggestedLocations.visible = false
                    label_recentSearches.visible = true
                    listView_recentSearches.visible = true
                    stack.push("qrc:///qml/SearchResultsView.qml")
                        }
                    }
                }
            }
        } //end listview
    }
}
