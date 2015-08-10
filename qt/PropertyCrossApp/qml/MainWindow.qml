import QtQuick 2.5
import QtQuick.Controls 1.2
import QtQuick.Window 2.2
import QtQuick.Layouts 1.2
import QtQuick.Controls.Styles 1.4
import "."


ApplicationWindow {
    width: 1080
    height: 1701
    title: qsTr("PropertyCross")
    visible: true
    id : mainWindow

    function goBack() {
        stack.pop();
        if(stack.depth==1)
            rootView.incoming()
    }

    toolBar: ToolBar {
        width: mainWindow.width
        visible: true
        id: toolbar
        RowLayout {
            anchors.fill: parent
            ToolButton {
                id: menu_back
                height: toolbar.height
                Layout.fillHeight: true
                Image {
                    source: "qrc:///res/ic_ab_back_holo_dark.png"
                    Layout.fillHeight: true
                    height: toolbar.height
                    fillMode: Image.Stretch
                }
                width: toolBar.height/3
                Layout.maximumWidth: width
                visible: {
                    if(stack.depth == 1)
                        false
                    else
                        true
                }
                onClicked: {
                    mainWindow.goBack()
                }
            }

            Image {
                id: toolbar_imageIcon
                source: "qrc:///res/ic_launcher.png"
                Layout.alignment: Qt.AlignLeft
                Layout.maximumHeight: toolbar.height*0.8
                Layout.maximumWidth:  toolbar.height*0.8
                width: toolbar.height*0.8
                height: toolbar.height*0.8
                anchors.margins: 10
                anchors.left: menu_back.right
                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        mainWindow.goBack()
                    }
                }
            }
            Text {
                text: 'Property Cross'
                id: toolbar_text
                Layout.alignment: Qt.AlignLeft
                //Layout.fillWidth: true
                color: AppStyle.textColor
                anchors.left: toolbar_imageIcon.right
                anchors.margins: 20
                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        mainWindow.goBack()
                    }
                }
            }
            Item {
                Layout.fillWidth: true
            }

            BusyIndicator {
                id: busyIndicator
                anchors.right: parent.right//toolButton_Favourites.left
                Layout.minimumHeight: toolbar.height-anchors.margins
                Layout.minimumWidth: toolbar.height-anchors.margins
                anchors.margins: 20
                Layout.fillHeight: true
                running: true
                visible: false
                Layout.alignment: Qt.AlignRight
                //  anchors.verticalCenter: parent.verticalCenter
                style: BusyIndicatorStyle {
                    indicator: Image {
                        source: "qrc:///res/refresh.png"
                        RotationAnimator on rotation {
                            running: control.running
                            loops: Animation.Infinite
                            duration: 2000
                            from: 0 ; to: 360
                        }
                    }
                }
            }
            ToolButton {
                id:toolButton_Favourites
                height: parent.height
                Layout.fillHeight: true
                style: ButtonStyle {
                    label: Text {
                        color: AppStyle.textColor
                        text: 'Favourites'
                        verticalAlignment: Text.AlignVCenter
                    }
                    background: Rectangle { color: control.pressed||control.hover ? 'grey' : '#00000000'}
                }

                Layout.alignment: Qt.AlignRight
                onClicked: {
                    rootView.disableElements()
                    stack.push("qrc:///qml/FavouritesView.qml")
                    cppPropertyListing.resetListing()
                }
                visible: {
                    if((stack.currentItem!=null)&&(stack.currentItem.state==="showingRoot")&&(busyIndicator.visible==false))
                        true
                    else
                        false
                }
            }
            ToolButton {
                id: toolButton_star
                height: toolbar_imageIcon.height*1.5
                width: toolbar_imageIcon.height*1.5
                //Layout.maximumHeight: toolbar_imageIcon.height*1.5
                //Layout.maximumWidth: toolbar_imageIcon.height*1.5
                Layout.maximumHeight: toolbar.height*0.8
                Layout.maximumWidth:  toolbar.height*0.8
                anchors.margins: 20
                signal toggleFavourite()
                function loadStarIcon(value) {
                    if(value===true)
                        //                        iconSource =  "qrc:///res/star.png"
                        toolBar_imageStar.source = "qrc:///res/star.png"
                    else
                        //                        iconSource =  "qrc:///res/nostar.png"
                        toolBar_imageStar.source = "qrc:///res/nostar.png"
                }
                Image {
                    id: toolBar_imageStar
                    source: "qrc:///res/star.png"
                    anchors.fill: parent
                    //anchors.margins: 10
                }

                property bool isFavourite
                visible: {
                    if(stack.currentItem!=null&&stack.currentItem.state==="showingProperty")
                        true
                    else
                        false
                }
                Layout.alignment: Qt.AlignRight
                onClicked: {
                    cppFavouritesHandler.triggerFavouriteToggle()
                }
            }

        }
    }

    StackView {
        id:stack
        anchors.fill: parent
        width: parent.width
        focus: true
        property string searchResultsTitle
        Keys.onReleased: if ((event.key === Qt.Key_F1 || event.key === Qt.Key_Back) && stack.depth > 1) {
                             event.accepted = true;
                             mainWindow.goBack()
                         }
        initialItem: RootView {
            id: rootView
        }
        onCurrentItemChanged: {
            if(stack.currentItem!=null)
                if(stack.currentItem.state==="showingRoot")
                    toolbar_text.text = qsTr("PropertyCross")
                else if(stack.currentItem.state==="showingFavourites")
                    toolbar_text.text = qsTr("Favourites")
                else if(stack.currentItem.state==="showingProperty")
                    toolbar_text.text = qsTr("Property Details")
                else if(stack.currentItem.state==="showingResults")
                    toolbar_text.text = stack.searchResultsTitle

        }
        Connections {
            target: cppJsonHandler
            onSuccessfullySearched: {
                var showing = (totalResults-page*20)>0 ? page*20 : totalResults
                stack.searchResultsTitle =  qsTr("Showing "+showing+" of "+totalResults)
                toolbar_text.text = stack.searchResultsTitle
            }
        }
    }
}



