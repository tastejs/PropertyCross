import QtQuick 2.0
import QtQuick.Layouts 1.2

Item {
    id: propertyView
    property bool isFavourite
    state: "showingProperty"

    property alias propertyLayout : propertyLayout
    onActiveFocusChanged:{
        if(activeFocus === false)
        toolButton_Favourites.visible = true;
    }

    ColumnLayout {
        id: propertyLayout
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
            font.pixelSize: text_rooms.font.pixelSize*2
            font.bold: true
        }
        Text {
//           text: propertyLayout.title
            text: propertyLayout.title
            font.pixelSize: text_rooms.font.pixelSize*1.5
            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
            width: parent.width
//            Layout.maximumWidth: propertyView.width
        }
        Image {
//            id: image
            source: propertyLayout.imageUrl
            width: propertyView.width
        }
        Text {
//            id: rooms
            id: text_rooms
            text: propertyLayout.bedrooms+" bed, "+propertyLayout.bathrooms+" bathroom "+propertyLayout.propertyType+"\n"
        }
        Text {
//            id: summary
            text: propertyLayout.summary
            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
            width: parent.width
//            Layout.maximumWidth: propertyView.width
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
