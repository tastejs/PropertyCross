TEMPLATE = lib
QT       += core
QT	 += qml quick
QT       += network
QT       += positioning
win32 {
CONFIG       += static
}

TARGET    = PropertyCrossLib
CONFIG   += C++11

SOURCES += \
    src/property.cpp \
    src/jsonhandler.cpp \
    src/location.cpp \
    src/propertylisting.cpp \
    src/favourites.cpp \
    src/position.cpp \
    src/searches.cpp

HEADERS += \
    include/property.h \
    include/jsonhandler.h \
    include/ipropertyhandler.h \
    include/location.h \
    include/propertylisting.h \
    include/favourites.h \
    include/position.h \
    include/searches.h

#INCLUDEPATH += %%_PRO_FILE_PWD_/include
INCLUDEPATH += include

DISTFILES +=
