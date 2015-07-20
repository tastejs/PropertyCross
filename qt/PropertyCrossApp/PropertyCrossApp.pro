TEMPLATE = app
QT       += core
QT       += qml quick widgets

TARGET = PropertyCross
CONFIG   += C++11
CONFIG   -= app_bundle

SOURCES += \
    src/main.cpp

INCLUDEPATH += ../PropertyCrossLib/include
INCLUDEPATH += ../PropertyCrossLib/Model

LIBS += -L../PropertyCrossLib/ -lPropertyCrossLib
OTHER_FILES += \
    qml/MainWindow.qml

RESOURCES += \
    myresources.qrc

DISTFILES += \
    qml/RootView.qml \
    qml/SearchResultsView.qml \
    qml/PropertyView.qml


