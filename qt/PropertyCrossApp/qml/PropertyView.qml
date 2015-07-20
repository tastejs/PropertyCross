import QtQuick 2.0

Rectangle {
    anchors.fill: parent
    focus: true
    Keys.onReleased: {
        console.log("Key pressed!")
//        if (event.key === Qt.Key_Back) {
            console.log("Back key!")
            event.accepted = true;
        propertyView.visible = false
        propertyView.enabled = false
        searchResultsView.visible = true
        searchResultsView.enabled = true
        searchResultsView.focus = true
 //       }
    }
    Text {
        text: "Here is a property"
    }
}

