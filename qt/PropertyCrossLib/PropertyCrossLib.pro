TEMPLATE = lib
QT       += core
QT		 += qml quick
QT       += network

TARGET    = PropertyCrossLib
CONFIG   += C++11

SOURCES += \
    src/Application.cpp

HEADERS += \
    include/Application.h

INCLUDEPATH += ./include
