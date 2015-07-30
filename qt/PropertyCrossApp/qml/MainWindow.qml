import QtQuick 2.5
import QtQuick.Controls 1.2
import QtQuick.Window 2.2
import QtQuick.Layouts 1.2
import QtQuick.Controls.Styles 1.4


ApplicationWindow {
    width: 1080
    height: 1701
    title: qsTr("PropertyCross")
    visible: true
    id : mainWindow

    toolBar: ToolBar {
        width: mainWindow.width
        visible: true
        id: toolbar
        RowLayout {
            anchors.fill: parent
            ToolButton {
                id: menu_back
                height: toolbar.height
                Layout.fillHeight: true
                Image {
                    source: "qrc:///res/ic_ab_back_holo_dark.png"
                    Layout.fillHeight: true
                    height: toolbar.height
                    fillMode: Image.Stretch
                }
                width: toolBar.height/3
                Layout.maximumWidth: width
                visible: {
                    if(stack.depth == 1)
                        false
                    else
                        true
                }
                onClicked: {
                    stack.pop()
                }
            }

            Image {
                source: "qrc:///res/ic_launcher.png"
                Layout.alignment: Qt.AlignLeft
                Layout.minimumHeight: toolbar.height
                Layout.minimumWidth: toolbar.height
            }
            Text {
                text: {
                    if(stack.currentItem.state==="showingRoot")
                        "PropertyCross"
                    else if(stack.currentItem.state==="showingFavourites")
                        "Favourites"
                    else if(stack.currentItem.state==="showingProperty")
                        "Property Details"
                }
                Connections {
                    target: cppJsonHandler
                    onSuccessfullySearched: {
                        toolbar_text.text =  "Showing "+page*20+" of "+totalResults
                    }
                }
                id: toolbar_text
                Layout.alignment: Qt.AlignLeft
                Layout.fillWidth: true
                color: "white"
            }

            BusyIndicator {
                id: busyIndicator
                Layout.alignment: Qt.AlignRight
                Layout.maximumHeight: toolButton_Favourites.height
                Layout.maximumWidth: toolButton_Favourites.height
                Layout.fillHeight: true
                running: true
                visible: false
                //  anchors.verticalCenter: parent.verticalCenter
                style: BusyIndicatorStyle {
                    indicator: Image {
                        source: "qrc:///res/refresh.png"
                        RotationAnimator on rotation {
                            running: control.running
                            loops: Animation.Infinite
                            duration: 2000
                            from: 0 ; to: 360
                        }
                    }
                }
            }
            ToolButton {
                id:toolButton_Favourites
                //                text: 'Favourites'
                height: parent.height
                Layout.fillHeight: true
                style: ButtonStyle {
                    label: Text {
                        color: 'white'
                        text: 'Favourites'
                        verticalAlignment: Text.AlignVCenter
                    }
                    background: Rectangle { color: control.pressed||control.hover ? 'grey' : 'black'}
                }

                Layout.alignment: Qt.AlignRight
                onClicked: {
                    rootView.disableElements()
                    stack.push("qrc:///qml/FavouritesView.qml")
                    cppPropertyListing.resetListing()
                }
                visible: {
                    if(stack.currentItem.state==="showingRoot")
                        true
                    else
                        false
                }
            }
            ToolButton {
                id: toolButton_star
                Layout.maximumHeight: toolButton_Favourites.height
                Layout.maximumWidth: toolButton_Favourites.height
                height: toolbar.height
                width: toolbar.height
                Layout.fillHeight: true
                Layout.fillWidth: true
                signal toggleFavourite()
                function loadStarIcon(value) {
                    if(value===true)
                        //                        iconSource =  "qrc:///res/star.png"
                        toolBar_imageStar.source = "qrc:///res/star.png"
                    else
                        //                        iconSource =  "qrc:///res/nostar.png"
                        toolBar_imageStar.source = "qrc:///res/nostar.png"
                }
                Image {
                    id: toolBar_imageStar
                    source: "qrc:///res/star.png"
                    anchors.fill: parent
                    anchors.margins: 4
                }

                property bool isFavourite
                visible: {
                    if(stack.currentItem.state==="showingProperty")
                        true
                    else
                        false
                }
                Layout.alignment: Qt.AlignRight
                onClicked: {
                    cppFavouritesHandler.triggerFavouriteToggle()
                }
            }

        }
    }

    StackView {
        id:stack
        anchors.fill: parent
        width: parent.width
        focus: true
        Keys.onReleased: if ((event.key === Qt.Key_F1 || event.key === Qt.Key_Back) && stack.depth > 1) {
                             stack.pop();
                             event.accepted = true;
                         }
        initialItem: RootView {
            id: rootView
        }
    }
}



