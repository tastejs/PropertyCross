TEMPLATE  = app
QT       += testlib
QT       += network
QT       += core
QT       += widgets
QT       += qml
CONFIG   += testcase
CONFIG   += C++11

SOURCES += \
    src/TestSuite.cpp \
    src/TestAll.cpp \
    ../PropertyCrossLib/Model/property.cpp \
    ../PropertyCrossLib/Model/favourites.cpp \
    ../PropertyCrossLib/Model/location.cpp \
     ../PropertyCrossLib/Model/jsonhandler.cpp \
    ../PropertyCrossLib/Model/recentsearches.cpp \
    ../PropertyCrossLib/Model/propertylisting.cpp \
    src/TestProperty.cpp \
    src/TestJsonHandler.cpp \
    src/TestLocation.cpp


HEADERS += \
    include/TestSuite.h \
    ../PropertyCrossLib/Model/property.h \
    ../PropertyCrossLib/Model/favourites.h \
    ../PropertyCrossLib/Model/location.h \
    ../PropertyCrossLib/Model/jsonhandler.h \
    ../PropertyCrossLib/Model/recentsearches.h \
    ../PropertyCrossLib/Model/propertylisting.h

INCLUDEPATH += ./include \
    ../PropertyCrossLib//Model
