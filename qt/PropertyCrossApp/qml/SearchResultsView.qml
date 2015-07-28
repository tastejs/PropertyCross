import QtQuick 2.0
import QtQuick.Layouts 1.2
import QtQuick.Window 2.2
//import PropertyCross 1.0

Item {
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
//    anchors.fill: parent
    id: searchResultsView
    state: "showingResults"
//    focus: true
    Connections {
        target: cppJsonHandler
        onSuccessfullySearched: {
            busyIndicator.visible = false
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
//            objectName: "listView_recentSearches"
//            width: parent.width
//            height: parent.height
            Layout.fillHeight: true
            Layout.fillWidth: true
            model: cppPropertyListing
            delegate: Item {
                id: propertyDelegate
                signal loadProperty(string guid, string summary,string price, string bedrooms,string bathrooms,string propertyType,string title, string thumbnailUrl, string imageUrl)
                //            x: 5
                Layout.fillWidth: true
//                Layout.maximumWidth: parent.width
                height: searchResultsView.height/9
              //  width: searchResultsView.width
                Rectangle {
                    Layout.fillWidth: true
                    height: propertyDelegate.height
                    width: listView_properties.width
                    Layout.fillHeight: true
                    id: rectangle_propertyRow
                    color: "#00FFFFFF"

                    Image {
                        id: image_property
                        width:parent.height
                        height:parent.height
                        source: thumbnailUrl
                        sourceSize.height: parent.height
                        sourceSize.width: parent.width
                    }

                    ColumnLayout {
                        //Layout.leftMargin: rootView.activeMargin
                        //Layout.rightMargin: rootView.activeMargin
                        anchors.left: image_property.right
                        height: parent.height
                        Text {
                            //anchors.left: image_property.right
                            horizontalAlignment: Text.AlignRight
                            text: "<b>£"+price+"</b>"
                            height: parent.height
                            verticalAlignment: Text.AlignVCenter
                            id: text_propertyPrice
                        }
                        Text {
                            id: titleText
                            text: title+", "+bedrooms+" bed "+propertyType
                            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
                            //Layout.maximumWidth: propertyDelegate.width-image_property.width
                            //width: parent.width
                            //anchors.left: image_property.right
                            //verticalAlignment: Text.AlignVCenter
                            //anchors.top: text_propertyPrice.bottom
                            //height: parent.height
                            color: "darkgrey"
                        }
                    }

                    MouseArea {
                        anchors.fill: parent
                        width: listView_properties.width
                        height: parent.height
                        onClicked: {
                            console.log("Clicked on "+title)
                            stack.push("qrc:///qml/PropertyView.qml")
                            cppShownProperty.changeProperty(guid, summary,price, bedrooms,bathrooms,propertyType,title, thumbnailUrl, imageUrl)
                        }
                        onPressedChanged: {
                            if(pressed)
                            rectangle_propertyRow.color = 'grey'
                            else
                            rectangle_propertyRow.color = '#00FFFFFF'
                        }
                    }
                }
                    Rectangle {
                color: "grey"
                height: 2
                width: propertyDelegate.width
                    }
            }
            footer: Item {
                Layout.fillWidth: true
                height: 80
        Text {
            id: listView_properties_footer
//            text: "Results for <b>"+location//+"</b>, showing <b>"+(page+1)*20+"</b> of <b>"+totalresults+"</b> properties."
            Layout.preferredHeight: parent.height/5
            MouseArea {
                id: text_loadMoreProperties
                property int page
                property string name
                anchors.fill: parent
                Layout.fillWidth: true
                onClicked: {
                    cppJsonHandler.getFromString(name, page)
                    console.log("Clicked on more "+(page)+" of location "+name)
                }
            }
            Connections {
                target: cppJsonHandler
                onSuccessfullySearched: {
                    //TODO handle zero (or <20) houses, last page
            listView_properties_footer.text = "Results for <b>"+location+"</b>, showing <b>"+(page*20)+"</b> of <b>"+totalResults+"</b> properties."
                    console.log("Successfully searched for "+location+" on page"+page+" has results "+totalResults)
                    text_loadMoreProperties.page = page
                    text_loadMoreProperties.name = location
                }
            }
        }
            }
        } //end of ListView

    }
}
