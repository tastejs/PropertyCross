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
    toolBar: ToolBar {
        width: mainWindow.width
        visible: false
        RowLayout {
            anchors.fill: parent
            ToolButton {text: 'ToolBarItem'}
        }
    }

    SearchResultsView {
        id: searchResultsView
        visible: false
        enabled: false
    }
    PropertyView {
       id: propertyView
       visible: false
       enabled: false
    }

    RootView {
        id: rootView
        visible: true
        enabled: true
    }

}



