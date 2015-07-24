import QtQuick 2.0
import QtQuick.Layouts 1.2
import QtQuick.Window 2.2
//import PropertyCross 1.0

Item {
    width: parent.width
    height:parent.height
//    anchors.fill: parent
    id: searchResultsView
    state: "showingResults"
//    focus: true

    ColumnLayout {
        anchors.fill: parent
        spacing: 5

        ListView {
            id: listView_properties
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
                height: 120//parent.height
                RowLayout {
                    spacing: 10

                    Image {
                        width:parent.width
                        height:parent.height
                        source: thumbnailUrl
                        sourceSize.height: parent.height
                        sourceSize.width: parent.width
                    }

                    ColumnLayout {
                        Text {
                            horizontalAlignment: Text.AlignRight
                            text: "<b>£"+price+"</b>"
                        }
                        Text {
                            id: titleText
                            text: title+", "+bedrooms+" bed "+propertyType
                        }
                    }

                    MouseArea {
                        anchors.fill: parent
                        onClicked: {
                            console.log("Clicked on "+title)
                            stack.push("qrc:///qml/PropertyView.qml")
                            cppShownProperty.changeProperty(guid, summary,price, bedrooms,bathrooms,propertyType,title, thumbnailUrl, imageUrl)
                        }
                    }
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
