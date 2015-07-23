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
    PropertyView {
       id: propertyView
       visible: false
       enabled: false
       property bool isFavourite
    }

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
                    favouritesView.visible= true
                    favouritesView.enabled = true
                    favouritesView.focus = true;
                    rootView.visible = false
                    rootView.enabled = false
//                    cppPropertyListing.resetListing()
                        }
                visible: {
                    if(propertyView.visible==true)
                        false
                    else
                        true
                }
            }
            ToolButton {
                id: toolButton_star
                signal toggleFavourite()
                iconSource: {
                    if(propertyView.isFavourite)
                        "qrc:///res/star.png"
                    else
                        "qrc:///res/nostar.png"
                }
                property bool isFavourite
                visible: {
                    if(toolButton_Favourites.visible==true)
                        false
                    else
                        true
                }
                Layout.alignment: Qt.AlignRight
                onClicked: {
                    //propertyLayout.addToFavourites()
//                    toolButton_star.toggleFavourite()
                    propertyView.propertyLayout.toggleFavourite()
                }
            }

        }
    }


    SearchResultsView {
        id: searchResultsView
        visible: false
        enabled: false
    }

    FavouritesView {
        id: favouritesView
        visible: false
        enabled: false
    }
    RootView {
        id: rootView
        visible: true
        enabled: true
    }

}



