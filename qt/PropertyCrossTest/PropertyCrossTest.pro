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
    ../PropertyCrossLib/Model/property.cpp \
    ../PropertyCrossLib/Model/favourites.cpp \
    ../PropertyCrossLib/Model/location.cpp \
     ../PropertyCrossLib/Model/jsonhandler.cpp \
    ../PropertyCrossLib/Model/searches.cpp \
    ../PropertyCrossLib/Model/propertylisting.cpp \
    ../PropertyCrossLib/Model/position.cpp \
    src/TestProperty.cpp \
    src/TestJsonHandler.cpp \
    src/TestLocation.cpp \
    src/TestPosition.cpp \
    src/TestFavourites.cpp


HEADERS += \
    include/TestSuite.h \
    include/ipropertyhandler.h \
    ../PropertyCrossLib/Model/property.h \
    ../PropertyCrossLib/Model/favourites.h \
    ../PropertyCrossLib/Model/location.h \
    ../PropertyCrossLib/Model/jsonhandler.h \
    ../PropertyCrossLib/Model/searches.h \
    ../PropertyCrossLib/Model/propertylisting.h \
    ../PropertyCrossLib/Model/position.h

INCLUDEPATH += ./include \
    ../PropertyCrossLib/Model \
    ../PropertyCrossLib/include
INCLUDEPATH += "$$PWD/../PropertyCrossLib/include"
