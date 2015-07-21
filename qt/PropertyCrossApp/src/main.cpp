#include <QApplication>
#include "jsonhandler.h"
#include "propertylisting.h"
#include "recentsearches.h"

#include <QQmlApplicationEngine>
#include <QObject>
#include <QQmlEngine>
#include <QQmlComponent>
#include <QQmlContext>

int main(int argc, char *argv[])
{
    QCoreApplication::setOrganizationName("Propertycross");
    QCoreApplication::setOrganizationDomain("propertycross.com");
    QCoreApplication::setApplicationName("PropertyCross");
    QApplication app(argc, argv);

   // qmlRegisterType<QSharedPointer<Property> > >("com. propertycross.shptrProperty", 1, 0, "ShptrProperty");
//    qmlRegisterType<PropertyListing>("com.propertycross", 1,0, "PropertyListing");
//    qmlRegisterType<PropertyListingModel>("PropertyCross", 1,0, "PropertyListingModel");
    qmlRegisterType<Location>("PropertyCross", 1,0, "Location");

    JsonHandler handler;
    PropertyListingModel propertyListing;
    RecentSearchesModel recentSearches;
    RecentSearchesStorage searchesStorage;
//    propertyListing.addProperty(Property("ab"));

    QQmlApplicationEngine engine;
        engine.rootContext()->setContextProperty("cppPropertyListing", &propertyListing);
        engine.rootContext()->setContextProperty("cppRecentSearches", &recentSearches);
        engine.rootContext()->setContextProperty("cppJsonHandler", &handler);
        //engine.rootContext()->setContextObject("");
    engine.load(QUrl(QStringLiteral("qrc:/qml/MainWindow.qml")));



    QObject *rootObject = engine.rootObjects().first();


    QObject *buttonGo = rootObject->findChild<QObject*>("buttonGo");
    if(buttonGo!=0)
    QObject::connect(buttonGo, SIGNAL(searchFor(QString, int)), &handler, SLOT(getFromString(QString,int)));
    else
        qWarning() << "Couldn't find Go Button!";
    /*QObject *qPropertyListing = rootObject->findChild<QObject*>("listView_recentSearches");
    if(qPropertyListing!=0){
//    QObject::connect(&propertyListing, SIGNAL(ready()), qPropertyListing, SLOT(addToListing()));
//    QObject::connect(&propertyListing, SIGNAL(addProperty(QString, QString, QString)), qPropertyListing, SLOT(addElement(QString, QString, QString)));
    }
    else{
        qWarning() << "Could not find propertyListing";
    }*/
    QObject::connect(&handler, SIGNAL(propertiesReady(QSharedPointer<QList<Property*> >)), &propertyListing, SLOT(addToListing(QSharedPointer<QList<Property*> >)));
    QObject::connect(&handler, SIGNAL(successfullySearched(Search)),&searchesStorage, SLOT(addNewSearch(Search)));
    QObject::connect(&searchesStorage , SIGNAL(recentSearchesChanged()),&recentSearches, SLOT(reloadSearchesFromStorage()));


    return app.exec();
}

