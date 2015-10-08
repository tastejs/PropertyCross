TEMPLATE  = app
QT       += testlib
QT       += network
QT       += core
QT       += widgets
QT       += qml
QT       += positioning
CONFIG   += testcase
CONFIG   += C++11

SOURCES += \
    src/TestSuite.cpp \
    src/TestAll.cpp \
    ../PropertyCrossLib/src/property.cpp \
    ../PropertyCrossLib/src/favourites.cpp \
    ../PropertyCrossLib/src/location.cpp \
     ../PropertyCrossLib/src/jsonhandler.cpp \
    ../PropertyCrossLib/src/searches.cpp \
    ../PropertyCrossLib/src/propertylisting.cpp \
    ../PropertyCrossLib/src/position.cpp \
    src/TestProperty.cpp \
    src/TestJsonHandler.cpp \
    src/TestLocation.cpp \
    src/TestPosition.cpp \
    src/TestFavourites.cpp \
    src/TestSearches.cpp


HEADERS += \
    include/TestSuite.h \
    include/ipropertyhandler.h \
    ../PropertyCrossLib/include/property.h \
    ../PropertyCrossLib/include/favourites.h \
    ../PropertyCrossLib/include/location.h \
    ../PropertyCrossLib/include/jsonhandler.h \
    ../PropertyCrossLib/include/searches.h \
    ../PropertyCrossLib/include/propertylisting.h \
    ../PropertyCrossLib/include/position.h

INCLUDEPATH += ./include \
    ../PropertyCrossLib/src \
    ../PropertyCrossLib/include
INCLUDEPATH += "$$PWD/../PropertyCrossLib/include"
