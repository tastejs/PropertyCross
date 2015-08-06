TEMPLATE = lib
QT       += core
QT	 += qml quick
QT       += network
QT       += positioning
win32|win64 {
CONFIG       += static
}

TARGET    = PropertyCrossLib
CONFIG   += C++11

SOURCES += \
    src/Application.cpp \
    Model/property.cpp \
    Model/jsonhandler.cpp \
    Model/location.cpp \
    Model/propertylisting.cpp \
    Model/favourites.cpp \
    Model/position.cpp \
    Model/searches.cpp

HEADERS += \
    Model/property.h \
    Model/jsonhandler.h \
    include/ipropertyhandler.h \
    Model/location.h \
    Model/propertylisting.h \
    Model/favourites.h \
    Model/position.h \
    Model/searches.h

#INCLUDEPATH += %%_PRO_FILE_PWD_/include
INCLUDEPATH += include

DISTFILES +=
