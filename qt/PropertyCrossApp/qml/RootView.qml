import QtQuick 2.0
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.2

Item {
    id: rootView
    state: "showingRoot"
    //    width: 640
    //    height: 800
    property int activeMargin: 3*width/100
    onVisibleChanged: {
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
        label_status.text = ""
        Qt.inputMethod.hide();
        busyIndicator.visible = true
    }

    function incoming() {
        enableElements()
        //cppJsonHandler.getFromString(textFieldSearchLocation.text, 0)
        label_status.text = ""
//        textFieldSearchLocation.text = ""
        busyIndicator.visible = false
        label_suggestedLocations.visible = false
        listView_suggestedLocations.visible = false
        label_recentSearches.visible = true
        listView_recentSearches.visible = true
        console.log("in incoming rootView")
    }

    Connections {
        target: cppGpsPosition
                        onFetchPosition: {
                            textFieldSearchLocation.text = position
                            startSearch(position)
                      }
    }
    Connections {
        target: cppJsonHandler
        onLocationsReady: {
            label_status.text = ""
            busyIndicator.visible = false
            label_suggestedLocations.visible = true
            listView_suggestedLocations.visible = true
            label_recentSearches.visible = false
            listView_recentSearches.visible = false
            stack.pop()
            console.log("in Suggesting locations")
        }
    }

    ColumnLayout {
        clip: true
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
                disableElements()
                busyIndicator.visible = true
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
                    //label_suggestedLocations.visible = false
                    //listView_suggestedLocations.visible = false
                    //label_recentSearches.visible = true
                    //listView_recentSearches.visible = true
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
                    //label_suggestedLocations.visible = false
                    //listView_suggestedLocations.visible = false
                    //label_recentSearches.visible = true
                    //listView_recentSearches.visible = true
                    label_status.text = "The location given was not recognised"
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
            delegate: DelegateRecentSearches {}
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
                            rectangle_suggestedLocationsRow.color = 'silver'
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
                    height: 2
                    //don't show in first item
                    color: index==0 ? "#00000000" : 'lightgrey'
                    width: listView_suggestedLocations.width
                }
            }
        } //end listview
    }
}
