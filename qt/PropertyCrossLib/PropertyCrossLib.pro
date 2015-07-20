TEMPLATE = lib
QT       += core
QT	 += qml quick
QT       += network

TARGET    = PropertyCrossLib
CONFIG   += C++11

SOURCES += \
    src/Application.cpp \
    Model/property.cpp \
    Model/jsonhandler.cpp \
    Model/location.cpp

HEADERS += \
    include/Application.h \
    Model/property.h \
    Model/jsonhandler.h \
    include/ipropertyhandler.h \
    Model/location.h

INCLUDEPATH += ./include
