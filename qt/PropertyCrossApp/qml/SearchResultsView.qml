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
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            width: searchResultsView.width
            Layout.fillHeight: true
            Layout.fillWidth: true
            model: cppPropertyListing
            //delegate------------------------
            delegate: DelegateProperties {}

            footer: Item {
                Layout.fillWidth: true
                Layout.fillHeight: true
                width: searchResultsView.width
                height: searchResultsView.height/9
                //                height: searchResultsView.height/9
                id: listView_propertiesFooter
                property int page
                property string name
                Rectangle {
                    height: listView_propertiesFooter.height
                    width: listView_properties.width
                    Layout.fillHeight: true
                    Layout.fillWidth: true
                    id: rectangle_propertiesFooter
                    color: "#00FFFFFF"
                    Text {
                        wrapMode: Text.WrapAtWordBoundaryOrAnywhere
                        verticalAlignment: Text.AlignVCenter
                        horizontalAlignment: Text.AlignHCenter
                        id: text_loadMoreProperties
                        height: parent.height
                        width: parent.width
                        font.pixelSize: parent.height*0.2
                        MouseArea {
                            anchors.fill: parent
                            Layout.fillWidth: true
                            height: parent.height
                            width: listView_properties.width
                            onClicked: {
                                cppJsonHandler.getFromString(listView_propertiesFooter.name, listView_propertiesFooter.page)
                                console.log("Clicked on more "+(listView_propertiesFooter.page)+" of location "+listView_propertiesFooter.name)
                            }
                            onPressedChanged: {
                                if(pressed)
                                    rectangle_propertiesFooter.color = 'silver'
                                else
                                    rectangle_propertiesFooter.color = '#00FFFFFF'
                            }
                        }
                        Connections {
                            target: cppJsonHandler
                            onSuccessfullySearched: {
                                var showing = (totalResults-page*20)>0 ? page*20 : totalResults
                                text_loadMoreProperties.text = "Results for <b>"+location+"</b>, showing <b>"+showing+"</b> of <b>"+totalResults+"</b> properties."
                                console.log("Successfully searched for "+location+" on page"+page+" has results "+totalResults)
                                listView_propertiesFooter.page = page
                                listView_propertiesFooter.name = location
                            }
                        }
                    }
                }
            }
        } //end of ListView

    }
}
