pragma Singleton
import QtQuick 2.0
//Our basic AppStyle Singleton - will be used if there are no other "selectors" that fit (e.g. android, ios, ...)
QtObject {
    readonly property color textColor: 'black'
}
