import QtQuick 2.0
import QtQuick.Layouts 1.2

Item {
    id: propertyView
    property bool isFavourite
    state: "showingProperty"

    property alias propertyLayout : propertyLayout
    onVisibleChanged:{
        if(visible == true)
            toolbar_text.text = "Property Details"
    }

            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
    ColumnLayout {
        id: propertyLayout
        Layout.fillWidth: true
        width: parent.width
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
        objectName: "propertyLayout"
        property string guid
        property string summary
        property string price
        property string title
        property string imageUrl
        property string thumbnailUrl
        property string bedrooms
        property string bathrooms
        property string propertyType
        onGuidChanged: {
            if(cppFavouritesHandler.isFavourited(guid))
                propertyView.isFavourite = true
            else
                propertyView.isFavourite = false
        }
        Connections {
            target: cppShownProperty
            onShowProperty: {
                propertyLayout.loadProperty(guid, summary,price, bedrooms,bathrooms,propertyType,title, thumbnailUrl, imageUrl)
                toolButton_star.loadStarIcon(cppFavouritesHandler.isFavourited(propertyLayout.guid))
            }
        }
        Connections {
            target: cppFavouritesHandler
            onToggleFavourite: propertyLayout.toggleFavourite()
            onFavouritedPropertiesChanged:toolButton_star.loadStarIcon(cppFavouritesHandler.isFavourited(propertyLayout.guid))
        }

        Text {
            text: "<b>£"+propertyLayout.price+"</b>"
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            font.pixelSize: text_rooms.font.pixelSize*2
            font.bold: true
        }
        Text {
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            text: propertyLayout.title
            font.pixelSize: text_rooms.font.pixelSize*1.5
            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
            width: parent.width
            Layout.maximumWidth: parent.width-Layout.leftMargin -Layout.rightMargin
        }
        Image {
            id: image_test
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            source: propertyLayout.imageUrl
            width: parent.width
            height: parent.width/sourceSize.width*sourceSize.height
            Layout.minimumHeight: height
            Layout.maximumWidth: parent.width-Layout.leftMargin -Layout.rightMargin
            fillMode: Image.Stretch
            Layout.fillWidth: true
            Layout.fillHeight: true
        }
        Text {
            id: text_rooms
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            text: propertyLayout.bedrooms+" bed, "+propertyLayout.bathrooms+" bathroom "+propertyLayout.propertyType+"\n"
        }
        Text {
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            text: propertyLayout.summary
            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
            width: parent.width
            Layout.maximumWidth: parent.width-Layout.leftMargin -Layout.rightMargin
        }

        function loadProperty(guid_, summary_,price_, bedrooms_,bathrooms_,propertyType_,title_, thumbnailUrl_, imageUrl_) {
            console.log("Loading property "+title_+ "imgurl:"+imageUrl_)
            propertyLayout.guid = guid_
            propertyLayout.summary = summary_
            propertyLayout.price = price_
            propertyLayout.title = title_
            propertyLayout.imageUrl = imageUrl_
            propertyLayout.thumbnailUrl = thumbnailUrl_
            propertyLayout.bedrooms = bedrooms_
            propertyLayout.bathrooms = bathrooms_
            propertyLayout.propertyType = propertyType_
        }
        function toggleFavourite() {
            if(propertyView.isFavourite) {
           cppFavouritesHandler.removeFavourite(propertyLayout.guid, propertyLayout.summary, propertyLayout.price, propertyLayout.bedrooms, propertyLayout.bathrooms, propertyLayout.propertyType, propertyLayout.title, propertyLayout.thumbnailUrl, propertyLayout.imageUrl)
                propertyView.isFavourite = false
            } else {
            cppFavouritesHandler.addNewFavourite(propertyLayout.guid, propertyLayout.summary, propertyLayout.price, propertyLayout.bedrooms, propertyLayout.bathrooms, propertyLayout.propertyType, propertyLayout.title, propertyLayout.thumbnailUrl, propertyLayout.imageUrl)
                propertyView.isFavourite = true
            }
        }
        function addToFavourites() {
            cppFavouritesHandler.addNewFavourite(summary, price, bedrooms, bathrooms, propertyType, title, imgurl)
        }
        function remoteFavourite() {
           cppFavouritesHandler.removeFavourite(summary, price, bedrooms, bathrooms, propertyType, title, imgurl)
        }
    }
}
