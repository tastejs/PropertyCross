import QtQuick 2.0
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.2

Item {
    id: rootView
    state: "showingRoot"
    //    width: 640
    //    height: 800
   // width: parent.width
    property int activeMargin: width/100
    onVisibleChanged: {
        if(visible == false)
            incoming()
    }

    function disableElements() {
        buttonGo.enabled = false
        buttonMyLocation.enabled = false
        textFieldSearchLocation.enabled = false
    }
    function enableElements() {
        buttonGo.enabled = true
        buttonMyLocation.enabled = true
        textFieldSearchLocation.enabled = true
    }

    function startSearch(term) {
        stack.push("qrc:///qml/SearchResultsView.qml")
        disableElements()
        cppPropertyListing.resetListing()
        cppJsonHandler.getFromString(term)
        //cppJsonHandler.getFromString(textFieldSearchLocation.text, 0)
        label_status.text = ""
        Qt.inputMethod.hide();
        busyIndicator.visible = true
    }

    function incoming() {
        enableElements()
        //cppJsonHandler.getFromString(textFieldSearchLocation.text, 0)
        label_status.text = ""
        busyIndicator.visible = false
        //stack.pop()

    }

    Connections {
        target: cppGpsPosition
                        onFetchPosition: {
                            textFieldSearchLocation.text = position
                      }
    }

    //Text eliding doesn't seem to work in a Layout, so put Text outside of layout
    ColumnLayout {
        clip: true
        // anchors.top:  textIntroduction.bottom
        height: parent.height
        width: parent.width
        Text {
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            Layout.margins: 20
            id: textIntroduction
            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
            elide: Text.ElideRight
            width: parent.width-Layout.leftMarin-Layout.rightMargin
            text: qsTr("Use the form below to search for houses to buy. You can search by place-name, postcode, or click 'My location', to search in your current location!")
            textFormat: Text.PlainText
            Layout.maximumWidth: parent.width-Layout.leftMargin-Layout.rightMargin
        }


        TextField {
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            Layout.maximumWidth: parent.width-Layout.leftMargin-Layout.rightMargin
            id: textFieldSearchLocation
            Layout.fillWidth: true;
            width: parent.width

            Keys.onReturnPressed:
            {
                rootView.startSearch(textFieldSearchLocation.text)
            }
        }

        Button {
            id:buttonGo
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            Layout.maximumWidth: parent.width-Layout.leftMargin-Layout.rightMargin
            objectName: "buttonGo"
            text: qsTr("Go")
            anchors.horizontalCenter: parent.horizontalCenter
            width: parent.width-2*Layout.rightMargin
            Layout.fillWidth: true
            //            signal searchFor(string msg, int page)
            onClicked: {
                console.log("Clicked Go Button");
                rootView.startSearch(textFieldSearchLocation.text)
            }
        }

        Button {
            id:buttonMyLocation
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            Layout.maximumWidth: parent.width-Layout.leftMargin-Layout.rightMargin
            text: qsTr("My Location")
            anchors.horizontalCenter: parent.horizontalCenter
            Layout.fillWidth: true
            onClicked: {
                console.log("Clicked My location Button");
                cppGpsPosition.startPositionRequest();
            }
        }

        Label {
            id: label_status
            objectName: "label_status"
            text: ""
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            Connections {
                target: cppJsonHandler
                onErrorRetrievingRequest: {
                    console.log("in error Retrieving from JsonHandler")
                    label_suggestedLocations.visible = false
                    listView_suggestedLocations.visible = false
                    label_recentSearches.visible = true
                    listView_recentSearches.visible = true
                    rootView.incoming()
                    stack.pop()
                    label_status.text = "The location given was not recognised"

                }
            }
            Connections {
                target: cppGpsPosition
                onFetchPositionError: {
                    label_status.text = "The location given was not recognised"
                    console.log("in error Retrieving from GPSHandler")
                    rootView.incoming()
                }
            }
        }

        Label {
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            id: label_recentSearches
            text: "<b>"+qsTr("Recent searches")+"</b>"
        }
        Label {
            id: label_suggestedLocations
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            text: qsTr("<b>Please select a location below</b>")
            visible: false
            Rectangle {
                border.color: "black"
                border.width: 2
                width: rootView.width
            }
            Connections {
                target: cppJsonHandler
                onLocationsReady: {
                    label_suggestedLocations.visible = true
                    listView_suggestedLocations.visible = true
                    label_recentSearches.visible = false
                    listView_recentSearches.visible = false
                    rootView.incoming()
                    console.log("in Suggesting locations")
                }
            }
        }
        Rectangle {
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            width: rootView.width- Layout.leftMargin-Layout.rightMargin
            Layout.fillWidth: true
            height: 2
            color: 'black'
        }

        ListView {
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            id: listView_recentSearches
            width: mainWindow.width
            Layout.fillHeight: true
            Layout.fillWidth: true
            clip: true
            model: cppRecentSearches
            delegate: Item {
                id: delegate_recentSearches
                Layout.fillWidth: true
                height: listView_recentSearches.height/5
                Layout.fillHeight: true
                Rectangle {
                    Layout.fillWidth: true
                    height: delegate_recentSearches.height
                    width: listView_recentSearches.width
                    Layout.fillHeight: true
                    id: rectangle_recentSearchesRow
                    color: "#00FFFFFF"
                    Text {
                        text: search
                        Layout.alignment: Qt.AlignCenter
                        height: parent.height
                        verticalAlignment: Text.AlignVCenter
                    }
                    Text {
                        id: text_totalResults
                        horizontalAlignment: Text.AlignRight
                        verticalAlignment: Text.AlignVCenter
                        Layout.alignment:  Qt.AlignRight | Qt.AlignVCenter
                        width: listView_recentSearches.width
                        height: parent.height
                        text: "("+results+")"

                MouseArea {
                    anchors.fill: parent
                        width: listView_recentSearches.width
                        height: parent.height
                        onPressedChanged: {
                            if(pressed)
                            rectangle_recentSearchesRow.color = 'grey'
                            else
                            rectangle_recentSearchesRow.color = '#00FFFFFF'
                        }
                    onClicked: {
                        rootView.startSearch(search);
                    }
                }
                    }
                }
                Rectangle {
//                    anchors.top: item_test.bottom
                    height: 2
                    //don't show in first item
                    color: index==0 ? "#00000000" : 'lightgrey'
                    width: listView_recentSearches.width
                }
            } //end delegate
        } //end listview


        ListView {
            id: listView_suggestedLocations
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            visible: false
            width: mainWindow.width
            Layout.fillHeight: true
            Layout.fillWidth: true

            model: cppSuggestedLocations
            delegate: Item {
                id: delegate_suggestedLocations
                Layout.fillWidth: true
                height: listView_suggestedLocations.height/5
                Layout.fillHeight: true
                Rectangle {
                    Layout.fillWidth: true
                    height: delegate_suggestedLocations.height
                    width: listView_suggestedLocations.width
                    Layout.fillHeight: true
                    id: rectangle_suggestedLocationsRow
                    color: "#00FFFFFF"
                    Text {
                        text: displayName
                        Layout.alignment: Qt.AlignCenter
                        height: parent.height
                        width: listView_suggestedLocations.width
                        verticalAlignment: Text.AlignVCenter

                MouseArea {
                    anchors.fill: parent
                        width: listView_suggestedLocations.width
                        height: parent.height
                        onPressedChanged: {
                            if(pressed)
                            rectangle_suggestedLocationsRow.color = 'grey'
                            else
                            rectangle_suggestedLocationsRow.color = '#00FFFFFF'
                        }
                    onClicked: {
                        rootView.startSearch(displayName);
                    }
                }
                    }
                }
                Rectangle {
//                    anchors.top: item_test.bottom
                    height: 2
                    //don't show in first item
                    color: index==0 ? "#00000000" : 'lightgrey'
                    width: listView_suggestedLocations.width
                }
            }
        } //end listview
    }
}
