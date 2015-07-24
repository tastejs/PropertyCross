import QtQuick 2.0
import QtQuick.Controls 1.2
import QtQuick.Window 2.2
import QtQuick.Layouts 1.2

ApplicationWindow {
    width: 640
    height:800
    title: qsTr("PropertyCross")
    visible: true
    id : mainWindow
    menuBar: MenuBar {
        Menu {
            visible: true
            MenuItem{
                text: qsTr('MenuItem')
                //TODO real onClick handler
                //onClicked: console.log("Clicked on Favourites")
            }
        }
    }
   /* PropertyView {
        id: propertyView
        visible: false
        enabled: false
        property bool isFavourite
    }*/

    toolBar: ToolBar {
        width: mainWindow.width
        visible: true
        RowLayout {
            anchors.fill: parent
            ToolButton {
                id:toolButton_Favourites
                text: 'Favourites'
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
        focus: true
        //        Keys.onReleased: if (event.key === Qt.Key_Back && stackView.depth > 1) {
        Keys.onReleased: if (event.key === Qt.Key_F1 && stack.depth > 1) {
                             stack.pop();
                             event.accepted = true;
                         }
        ListView {
      //      model: pageModel
            anchors.fill: parent
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



