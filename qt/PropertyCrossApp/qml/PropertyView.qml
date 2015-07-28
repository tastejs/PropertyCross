import QtQuick 2.0
import QtQuick.Layouts 1.2

Item {
    id: propertyView
    property bool isFavourite
    state: "showingProperty"

    property alias propertyLayout : propertyLayout
    onVisibleChanged:{
        if(visible == true)
//        toolButton_Favourites.visible = true;
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
//    onEnabledChanged: {
//        if(enabled==true) {
//        toolButton_Favourites.visible = false;
//            toolButton_Star.visible = true
//        } else {
//            toolButton_Favourites.visible = true;
//            toolButton_Star.visible = false
//        }
//    }
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
//            id: price
            text: "<b>£"+propertyLayout.price+"</b>"
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            font.pixelSize: text_rooms.font.pixelSize*2
            font.bold: true
        }
        Text {
//           text: propertyLayout.title
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            text: propertyLayout.title+propertyView.width
            font.pixelSize: text_rooms.font.pixelSize*1.5
            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
            width: parent.width
            Layout.maximumWidth: parent.width
        }
        Image {
//            id: image
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            source: propertyLayout.imageUrl
//            height: property
            width: parent.width
            fillMode: Image.Stretch
            Layout.fillWidth: true
        }
        Text {
//            id: rooms
            id: text_rooms
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            text: propertyLayout.bedrooms+" bed, "+propertyLayout.bathrooms+" bathroom "+propertyLayout.propertyType+"\n"
        }
        Text {
//            id: summary
            Layout.leftMargin: rootView.activeMargin
            Layout.rightMargin: rootView.activeMargin
            text: propertyLayout.summary
            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
            width: parent.width
            Layout.maximumWidth: parent.width
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
//            price.text = "<b>£"+price_+"</b>"
            //image.source = imgurl_
//            rooms.text = bedrooms_+" bed, "+bathrooms_+" bathroom "+propertyType_
//            summary.text = summary_

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
