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

    property alias propertyLayout : propertyLayout

    ColumnLayout {
        id: propertyLayout

        Text {
            id: price
           // text: "<b>"+title+"</b>"
        }
        Text {
            id: title
           // text: "<b>"+title+"</b>"
        }
        Image {
            id: image
            //source: imgurl
        }
        Text {
            id: rooms
            //text: "
        }
        Text {
            id: summary
         //   text: "Summary"
        }

        function loadProperty(summary_,price_, bedrooms_,bathrooms_,propertyType_,title_, imgurl_) {
            price.text = "<b>£"+price_+"</b>"
            title.text = title_
            image.source = imgurl_
            rooms.text = bedrooms_+" bed, "+bathrooms_+" bathroom "+propertyType_
            summary.text = summary_
        }
    }
}
