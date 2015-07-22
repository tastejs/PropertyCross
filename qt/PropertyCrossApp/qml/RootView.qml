import QtQuick 2.0
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.2

Rectangle {
    id: rootView

    ColumnLayout {
        spacing: 5

//        anchors.fill: parent
        width: mainWindow.width
        height: mainWindow.height

        Text {
//            width: mainWindow.width/2
            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
            elide: Text.ElideRight
            maximumLineCount: 5
            width: mainWindow.width
            clip: true
            text: "Use the form below to search for houses to buy. You can search by place-name, postcode, or click 'My location', to search in your current location!"
        }

        TextField {
            id: textFieldSearchLocation
            Layout.fillWidth: true;
            width: mainWindow.width
        }

        Button {
            id:buttonGo
            objectName: "buttonGo"
//            width: mainWindow.width
            text: qsTr("Go")
            anchors.horizontalCenter: parent.horizontalCenter
            Layout.fillWidth: true
            signal searchFor(string msg, int page)
                onClicked: {
                    console.log("Clicked Go Button");
                    buttonGo.searchFor(textFieldSearchLocation.text, 0)
                    searchResultsView.visible= true
                    searchResultsView.enabled = true
                    searchResultsView.focus = true
                    rootView.visible = false
                    rootView.enabled = false
                    cppJsonHandler.getFromString(textFieldSearchLocation.text, 0)
                }
        }

        Button {
            id:buttonMyLocation
            text: qsTr("My Location")
            anchors.horizontalCenter: parent.horizontalCenter
            Layout.fillWidth: true
                onClicked: {
                    console.log("Clicked My location Button");


                    //var component = Qt.createComponent("SearchResultsWindow.qml");
                    //var win = component.createObject(mainWindow);
                    //win.show();
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
                    console.log("in errorRetrieving")
        searchResultsView.visible = false
        searchResultsView.enabled = false
        rootView.visible = true
        rootView.enabled = true
        rootView.focus = true
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
                /*ListModel {
                //dummy data for this ListView
                ListElement {
                    name: "Grey"
                    results: "50"
                }

                ListElement {
                    name: "Red"
                    results: "100"
                }

                ListElement {
                    name: "Blue"
                    results: "100"
                }

                ListElement {
                    name: "Green"
                    results: "100"
                }
            }*/
            delegate: Item {
                x: 5
                Layout.fillWidth: true
                height: 40
                RowLayout {
                    Text {
                        id: nameText
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
                    buttonGo.searchFor(search, 0)
                    searchResultsView.visible= true
                    searchResultsView.enabled = true
                    searchResultsView.focus = true;
                    rootView.visible = false
                    rootView.enabled = false
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
                    searchResultsView.visible = false
                    searchResultsView.enabled = false
                    rootView.visible = true
                    rootView.enabled = true
                    rootView.focus = true
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

            model: //cppRecentSearches
                ListModel {
                //dummy data for this ListView
                ListElement {
                    search: "Grey"
                    results: "50"
                }

                ListElement {
                    search: "Red"
                    results: "100"
                }

                ListElement {
                    search: "Blue"
                    results: "100"
                }

                ListElement {
                    search: "Green"
                    results: "100"
                }
            }
            delegate: Item {
                x: 5
                Layout.fillWidth: true
                height: 40
                RowLayout {
                    Text {
                        id: nameText
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
                    buttonGo.searchFor(search, 0)
                    searchResultsView.visible= true
                    searchResultsView.enabled = true
                    searchResultsView.focus = true;
                    rootView.visible = false
                    rootView.enabled = false
                        }
                    }
                }
            }
        } //end listview
    }
}
