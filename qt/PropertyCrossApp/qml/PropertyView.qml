import QtQuick 2.0
import QtQuick.Layouts 1.2

Rectangle {
    anchors.fill: parent
    focus: true
    Keys.onReleased: {
        console.log("Key pressed!")
//        if (event.key === Qt.Key_Back) {
            console.log("Back key!")
        event.accepted            = true;
        propertyView.visible      = false
        propertyView.enabled      = false
        searchResultsView.visible = true
        searchResultsView.enabled = true
        searchResultsView.focus   = true
 //       }
    }

//    onVisibleChanged: {
//        if(visible==true) {
//        toolButton_Favourites.visible = false;
//        } else {
//            toolButton_Favourites.visible = true;
//        }
//    }

    property alias propertyLayout : propertyLayout

    ColumnLayout {
        id: propertyLayout
        property string guid
        property string summary
        property string price
        property string title
        property string imageUrl
        property string thumbnailUrl
        property string bedrooms
        property string bathrooms
        property string propertyType
        Text {
//            id: price
            text: "<b>£"+propertyLayout.price+"</b>"
        }
        Text {
//            id: title
           text: propertyLayout.title
        }
        Image {
//            id: image
            source: propertyLayout.imageUrl
        }
        Text {
//            id: rooms
            text: propertyLayout.bedrooms+" bed, "+propertyLayout.bathrooms+" bathroom "+propertyLayout.propertyType
        }
        Text {
//            id: summary
            text: propertyLayout.summary
        }

        function loadProperty(guid_, summary_,price_, bedrooms_,bathrooms_,propertyType_,title_, thumbnailUrl_, imgurl_) {
            propertyLayout.guid = guid_
            propertyLayout.summary = summary_
            propertyLayout.price = price_
            propertyLayout.title = title_
            propertyLayout.imageUrl = imgurl_
            propertyLayout.thumbnailUrl = thumbnailUrl_
            propertyLayout.bedrooms = bedrooms_
            propertyLayout.bathrooms = bathrooms_
            propertyLayout.propertyType = propertyType_
//            price.text = "<b>£"+price_+"</b>"
//            title.text = title_
            //image.source = imgurl_
//            rooms.text = bedrooms_+" bed, "+bathrooms_+" bathroom "+propertyType_
//            summary.text = summary_

        }
        function toggleFavourite() {
            if(propertyView.isFavourite) {
           cppFavouritesHandler.removeFavourite(propertyLayout.guid, propertyLayout.summary, propertyLayout.price, propertyLayout.bedrooms, propertyLayout.bathrooms, propertyLayout.propertyType, propertyLayout.title, propertyLayout.thumbnailUrl, propertyLayout.imageUrl)
                propertyView.isFavourite = false
            } else {
            cppFavouritesHandler.addNewFavourite(propertyLayout.guid, propertyLayout.summary, propertyLayout.price, propertyLayout.bedrooms, propertyLayout.bathrooms, propertyLayout.propertyType, propertyLayout.title, propertyLayout.thumbnailUrl, propertyLayout.imgurl)
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
