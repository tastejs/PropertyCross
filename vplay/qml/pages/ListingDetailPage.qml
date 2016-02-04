import QtQuick 2.0
import VPlayApps 1.0

import "../model"

Page {
  property var model: ({})

  title: qsTr("Property Details")

  readonly property bool isFavorite: DataModel.isFavorite(model)

  rightBarItem: IconButtonBarItem {
    icon: isFavorite ? IconType.heart : IconType.hearto
    onClicked: {
      DataModel.toggleFavorite(model)
    }
  }

  clip: true //clip content behind navigation bar when scrolling

  Flickable {
    id: scroll
    anchors.fill: parent
    contentWidth: parent.width
    contentHeight: contentCol.height + contentPadding
    bottomMargin: contentPadding

    Column {
      id: contentCol
      y: contentPadding
      anchors.left: parent.left
      anchors.right: parent.right
      anchors.margins: contentPadding
      spacing: contentPadding

      AppText {
        text: model.price_formatted
        width: parent.width
        wrapMode: Text.WrapAtWordBoundaryOrAnywhere
        font.pixelSize: sp(24)
      }

      AppText {
        text: model.title
        width: parent.width
        wrapMode: Text.WrapAtWordBoundaryOrAnywhere
        font.pixelSize: sp(20)
      }

      AppImage {
        source: model.img_url
        width: parent.width
        height: model && width * model.img_height / model.img_width || 0
        anchors.horizontalCenter: parent.horizontalCenter
      }

      AppText {
        width: parent.width
        wrapMode: Text.WrapAtWordBoundaryOrAnywhere
        text: "%1 bed, %2 bathrooms".arg(model.bedroom_number).arg(model.bathroom_number)
      }

      AppText {
        width: parent.width
        wrapMode: Text.WrapAtWordBoundaryOrAnywhere
        text: model.summary
      }
    }
  }

  ScrollIndicator {
    flickable: scroll
  }
}

