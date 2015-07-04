TEMPLATE = app
QT       += core
QT       += qml quick

TARGET = PropertyCross
CONFIG   += C++11
CONFIG   -= app_bundle

SOURCES += \
    src/main.cpp

INCLUDEPATH += ../PropertyCrossLib/include

LIBS += -L../PropertyCrossLib/ -lPropertyCrossLib


