import QtQuick 2.0
import QtQuick.Layouts 1.2
import QtQuick.Window 2.2

Item {
    Layout.leftMargin: rootView.activeMargin
    Layout.rightMargin: rootView.activeMargin
    id: searchResultsView
    state: "showingResults"
    Connections {
        target: cppJsonHandler
        onSuccessfullySearched: {
            busyIndicator.visible = false
        Qt.inputMethod.hide();
        }
    }

    ColumnLayout {
        anchors.fill: parent
        spacing: 5
        Layout.leftMargin: rootView.activeMargin
        Layout.rightMargin: rootView.activeMargin

        ListView {
            id: listView_properties
            //Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            width: searchResultsView.width
            Layout.fillHeight: true
            Layout.fillWidth: true
            model: cppPropertyListing
            //delegate------------------------
            delegate: DelegateProperties {}
            //footer------------------------
            footer: FooterProperties {}

        } //end of ListView

    }
}
