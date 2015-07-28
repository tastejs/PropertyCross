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
    /*    menuBar: MenuBar {
        Menu {
            visible: true
            MenuItem{
                text: qsTr('MenuItem')
                //TODO real onClick handler
                //onClicked: console.log("Clicked on Favourites")
            }
        }
    }*/
    /* PropertyView {
        id: propertyView
        visible: false
        enabled: false
        property bool isFavourite
    }*/

    toolBar: ToolBar {
        width: mainWindow.width
        visible: true
        id: toolbar
          style: ToolBarStyle {
//        padding {
//            left: 0
//            right: 0
//            top: 0
//            bottom: 0
//        }
        background: Rectangle {
            color: "black"
        }
    }
        RowLayout {
            anchors.fill: parent
            Image {
                source: "qrc:///res/ic_launcher.png"
                //iconSource: "qrc:///res/ic_launcher.png"
                Layout.maximumHeight: toolButton_Favourites.height*2.5
                Layout.maximumWidth: toolButton_Favourites.height*2.5
                height: toolButton_Favourites.height*2.5
                width: toolButton_Favourites.height*2.5

                //  Layout.maximumWidth: toolbar.height

            }
            Text {
                text: "PropertyCross"
                Layout.alignment: Qt.AlignLeft
                color: "white"
            }

            BusyIndicator {
                id: busyIndicator
                Layout.alignment: Qt.AlignRight
                Layout.maximumHeight: toolButton_Favourites.height
                Layout.maximumWidth: toolButton_Favourites.height
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
                style: ButtonStyle {
                   label: Text {
                       color: 'white'
                       text: 'Favourites'
                   }
                  background: Rectangle { color: control.pressed||control.hover ? 'grey' : 'black'}
                }

                Layout.alignment: Qt.AlignRight
                onClicked: {
                    //                    stack.push(pageModel{favouritesView});
                    stack.push("qrc:///qml/FavouritesView.qml")
                    console.log("Now in"+stack.currentItem.state)
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
                signal toggleFavourite()
                function loadStarIcon(value) {
                    if(value===true)
                        iconSource =  "qrc:///res/star.png"
                    else
                        iconSource =  "qrc:///res/nostar.png"

                }

                iconSource: {
                    //if(propertyView.isFavourite)
                    "qrc:///res/star.png"
                    // else
                    //   "qrc:///res/nostar.png"
                }
                height: toolbar.height
                width: toolbar.height
                property bool isFavourite
                visible: {
                    if(stack.currentItem.state==="showingProperty")
                        true
                    else
                        false
                }
                Layout.alignment: Qt.AlignRight
                onClicked: {
                    //propertyLayout.addToFavourites()
                    //                    toolButton_star.toggleFavourite()
                    //                    propertyView.propertyLayout.toggleFavourite()
                    cppFavouritesHandler.triggerFavouriteToggle()
                }
            }

        }
    }
    /* ListModel {
        id: pageModel
        ListElement {
            title: "Search Results"
            page: "qml/SearchResultsView.qml"
        }
        ListElement {
            title: "Favourites View"
            page: "qml/FavouritesView.qml"
            name: "favouritesView"
        }
        ListElement {
            title: "Property"
            page: "qml/PropertyView.qml"
        }

    }*/
    StackView {
        id:stack
        anchors.fill: parent
        width: parent.width
        focus: true
        //        Keys.onReleased: if (event.key === Qt.Key_Back && stackView.depth > 1) {
        Keys.onReleased: if ((event.key === Qt.Key_F1 || event.key === Qt.Key_Back) && stack.depth > 1) {
                             stack.pop();
                             event.accepted = true;
                         }
        ListView {
            //      model: pageModel
            //            anchors.fill: parent
            //            delegate: AndroidDelegate {
            //                text: title
            //                onClicked: stackView.push(Qt.resolvedUrl(page))
            //            }
        }
        initialItem: RootView {
            id: rootView
            ////        visible: true
            ////        enabled: true
        }
    }


    //    SearchResultsView {
    //        id: searchResultsView
    //    }
    //
    //    FavouritesView {
    //        id: favouritesView
    //    }

}



