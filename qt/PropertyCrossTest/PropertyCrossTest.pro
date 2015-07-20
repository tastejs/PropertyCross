TEMPLATE  = app
QT       += testlib
QT       += network
QT       += core
QT       += widgets
CONFIG   += testcase

SOURCES += \
    src/TestSuite.cpp \
    src/TestAll.cpp \
    ../PropertyCrossLib/Model/property.cpp \
    ../PropertyCrossLib/Model/location.cpp \
    ../PropertyCrossLib/Model/jsonhandler.cpp \
    src/TestProperty.cpp \
    src/TestJsonHandler.cpp \
    src/TestLocation.cpp


HEADERS += \
    include/TestSuite.h \
    ../PropertyCrossLib/Model/property.h \
    ../PropertyCrossLib/Model/location.h \
    ../PropertyCrossLib/Model/jsonhandler.h

INCLUDEPATH += ./include \
    ../PropertyCrossLib//Model
