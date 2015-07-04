#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QtQuick/QQuickView>
#include "Application.h"

Application::Application()
{
}

int Application::execute(int argc, char * argv[])
{
    QGuiApplication app(argc, argv);


    QQuickView viewer;
    viewer.show();
    app.setApplicationName("PropertyCross");
    app.setOrganizationName("JPM");
    app.setApplicationVersion("1.0");

    QObject::connect((QObject*)viewer.engine(), SIGNAL(quit()), &app, SLOT(quit()));

    return app.exec();
}

