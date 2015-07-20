import QtQuick 2.0
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.2

Rectangle {
    ColumnLayout {
        spacing: 5
        //anchors.fill: parent
        width: mainWindow.width
        height: mainWindow.height
        Text {
            width: mainWindow.width
            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
            elide: Text.ElideRight
            maximumLineCount: 5
            clip: true
            text: "Use the form below to search for houses to buy. \nYou can search by place-name, postcode, or click 'My location', to search in your current location!"
        }
        TextField {
            id: textFieldSearchLocation
            Layout.fillWidth: true;
            width: mainWindow.width
        }
        Button {
            id:buttonGo
            objectName: "buttonGo"
            width: mainWindow.width
            text: qsTr("Go")
            anchors.horizontalCenter: parent.horizontalCenter
            Layout.fillWidth: true
            signal searchFor(string msg, int page)

            MouseArea {
                anchors.fill: parent
                onClicked: {
                    console.log("Clicked Go Button");
                    buttonGo.searchFor(textFieldSearchLocation.text, 0)
                }
            }
        }
        Button {
            id:buttonMyLocation
            text: qsTr("My Location")
            anchors.horizontalCenter: parent.horizontalCenter
            Layout.fillWidth: true
            MouseArea {
                anchors.fill: parent
                onClicked: {
                    console.log("Clicked My location Button");
                    searchResultsView.visible= true
                    searchResultsView.enabled = true
                    rootView.visible = false
                    rootView.enabled = false

                    //var component = Qt.createComponent("SearchResultsWindow.qml");
                    //var win = component.createObject(mainWindow);
                    //win.show();
                }
            }
        }
        Label {
            id: label1
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

            model: ListModel {
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
            }
            delegate: Item {
                x: 5
                Layout.fillWidth: true
                height: 40
                RowLayout {
                    Text {
                        id: nameText
                        text: name
                    }
                    Text {
                        horizontalAlignment: Text.AlignRight
                        text: "("+results+")"
                    }
                    MouseArea {
                        anchors.fill: parent
                        onClicked: {
                            console.log("Clicked on "+name)
                        }
                    }
                }
            }
        }
    }


}




