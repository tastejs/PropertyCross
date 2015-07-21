import QtQuick 2.0
import QtQuick.Layouts 1.2
import QtQuick.Window 2.2
//import ShptrProperty 1.0
//import com.propertycross 1.0
import PropertyCross 1.0
//import com.propertylisting 1.0
//PropertyView { id: propertyView }

Rectangle {
//    width: 640
//    height:800
    anchors.fill: parent
//    title: "PropertyCross"
    id: searchResultsWindow
//    focus: true
    Keys.onReleased: {
        console.log("Key pressed!")
//        if (event.key === Qt.Key_Back) {
            console.log("Back key!")
            event.accepted = true;
        searchResultsWindow.visible = false
        searchResultsWindow.enabled = false
        rootView.visible = true
        rootView.enabled = true
        rootView.focus = true
 //       }
    }

    ColumnLayout {
        anchors.fill: parent
        spacing: 5
        ListView {

            id: listView_recentSearches
            objectName: "listView_recentSearches"
//                onAddProperty : {addElement(title, price, imgurl)}
//            width: parent.width
//            height: parent.height
            Layout.fillHeight: true
            Layout.fillWidth: true
            //onReceivedListing: { console.log("Received listing")}
            model: cppPropertyListing
            /*ListModel {
                id: p
                objectName: "propertyListing"
                //Test data for this model
               /* ListElement {
                    title: "Nottingham hill"
                    price: "100"
                    imgurl: "http://2.l.uk.nestoria.nestimg.com/lis/4/5/b/9ce388890cd0b3b028ef934f06565adea8cc4.2.jpg"
                }
                ListElement {
                    title: "London city"
                    price: "500"
                    imgurl: "http://2.l.uk.nestoria.nestimg.com/lis/5/0/2/6089869c19e0ed402926d062e47fe08fc8861.2.jpg"
                }*
            }*/
            delegate: Item {
                id: propertyDelegate
                //            x: 5
                Layout.fillWidth: true
                height: 80
                RowLayout {
                    Image {
                        width:50
                        height:50
                        source: thumbnailUrl
                        sourceSize.height: 80
                        sourceSize.width: 80
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
                            searchResultsWindow.visible = false;
                            searchResultsWindow.enabled = false;
                            propertyView.focus = true;
                            propertyView.visible = true;
                            propertyView.enabled = true;
        propertyView.propertyLayout.loadProperty(summary,price, bedrooms,bathrooms,propertyType,title, imageUrl)
                        }
                    }
                }
            }
          /*  function addToListing() {
//                addElement(PropertyListing.properties[0].)
//                var i;
                console.log("In addToListing")
                for(var i=0; i<PropertyListing.length;i++){
                    addElement(PropertyListing[i]);
                }
            }

            function addElement(title, price, imgurl) {
                //model.delegate.append({"title":title, "price":price, "imgurl":imgurl});
                propertyListing.append({"title":title, "price":price, "imgurl":imgurl})
               // console.log("Adding "+title);
        }*/
          /*  Connections {
                target: _PropertyListing
                onAddProperty: {
                    listView_recentSearches.addElement(title, price, imgurl)
                }
            }*/

        } //end of ListView
        Text {
            text: "Showing..."
            Layout.preferredHeight: 80
            MouseArea {
                anchors.fill: parent
                Layout.fillWidth: true
                onClicked: {
                    console.log("Clicked on more")
                }
            }
        }
    }
}

