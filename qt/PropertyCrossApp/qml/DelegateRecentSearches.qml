import QtQuick 2.0
import QtQuick.Layouts 1.2

Item {
    id: delegate_recentSearches
    Layout.fillWidth: true
    height: parent.parent.height/4
    Layout.fillHeight: true
    Rectangle {
        Layout.fillWidth: true
        height: delegate_recentSearches.height
        width: delegate_recentSearches.parent.width
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
            width: delegate_recentSearches.parent.width
            height: parent.height
            text: "("+results+")"

            MouseArea {
                anchors.fill: parent
                width: delegate_recentSearches.parent.width
                height: parent.height
                onPressedChanged: {
                    if(pressed)
                        rectangle_recentSearchesRow.color = 'silver'
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
        height: 2
        //don't show in first item
        color: index==0 ? "#00000000" : 'lightgrey'
        width: parent.parent.width
    }
} //end delegate
