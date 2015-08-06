import QtQuick 2.0
import QtQuick.Layouts 1.2

 Item {
                id: propertyDelegate
                signal loadProperty(string guid, string summary,string price, string bedrooms,string bathrooms,string propertyType,string title, string thumbnailUrl, string imageUrl)
                Layout.fillWidth: true
                height: parent.parent.height / 9
                Rectangle {
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    height: propertyDelegate.height
                    width: parent.parent.width
                    id: rectangle_propertyRow
                    color: "#00FFFFFF"

                    Image {
                        id: image_property
                        width:parent.height
                        height:parent.height
                        source: thumbnailUrl
                        sourceSize.height: parent.height
                        sourceSize.width: parent.width
                        fillMode: Image.PreserveAspectFit
                    }

                    ColumnLayout {
                        anchors.left: image_property.right
                        height: parent.height
                        Text {
                            horizontalAlignment: Text.AlignRight
                            text: "<b>£"+price+"</b>"
                            height: parent.height
                            verticalAlignment: Text.AlignVCenter
                            id: text_propertyPrice
                            Layout.leftMargin: rootView.activeMargin
                            font.pixelSize: parent.height*0.25
                        }
                        Text {
                            id: titleText
                            text: title+", "+bedrooms+" bed "+propertyType
                            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
                            color: "darkgrey"
                            Layout.leftMargin: rootView.activeMargin
                            Layout.rightMargin: rootView.activeMargin
                            //width: rootView.width- Layout.leftMargin-Layout.rightMargin
                            Layout.maximumWidth: rootView.width- 2*Layout.leftMargin-2*Layout.rightMargin-image_property.width
                            font.pixelSize: parent.height*0.2
                        }
                    }

                    MouseArea {
                        anchors.fill: parent
                        width: propertyDelegate.width
                        height: parent.height
                        onClicked: {
                            console.log("Clicked on "+title)
                            stack.push("qrc:///qml/PropertyView.qml")
                            cppShownProperty.changeProperty(guid, summary,price, bedrooms,bathrooms,propertyType,title, thumbnailUrl, imageUrl)
                        }
                        onPressedChanged: {
                            if(pressed)
                                rectangle_propertyRow.color = 'silver'
                            else
                                rectangle_propertyRow.color = '#00FFFFFF'
                        }
                    }
                    Rectangle {
                        color: index==0 ? '#00000000' : "grey"
                        height: 2
                        width: rootView.width- Layout.leftMargin-Layout.rightMargin
                        Layout.leftMargin: rootView.activeMargin
                        Layout.rightMargin: rootView.activeMargin
                    }
                }
            }
