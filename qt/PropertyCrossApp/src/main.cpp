#include <QApplication>
#include "jsonhandler.h"
#include "propertylisting.h"
#include "searches.h"
#include "favourites.h"
#include "position.h"

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

    qRegisterMetaTypeStreamOperators<Search>("Search");

    QApplication app(argc, argv);

   // qmlRegisterType<QSharedPointer<Property> > >("com. propertycross.shptrProperty", 1, 0, "ShptrProperty");
//    qmlRegisterType<PropertyListing>("com.propertycross", 1,0, "PropertyListing");
//    qmlRegisterType<PropertyListingModel>("PropertyCross", 1,0, "PropertyListingModel");
//    qmlRegisterType<Location>("PropertyCross", 1,0, "Location");
//    qmlRegisterType<Search>("PropertyCross", 1,0, "Search");

    JsonHandler handler;
    PropertyListingModel propertyListing;
    LocationListingModel locationListing;
    RecentSearchesModel recentSearches;
    RecentSearchesStorage searchesStorage;
    Favourites favourites;
    FavouritedPropertyListingModel favouritesListing;
    PropertyDelegate shownProperty;
    Position gpsPosition;
//    searchesStorage.deleteAllRecentSearches();

    QQmlApplicationEngine engine;
    engine.rootContext()->setContextProperty("cppPropertyListing", &propertyListing);
    engine.rootContext()->setContextProperty("cppFavouritesListing", &favouritesListing);
    engine.rootContext()->setContextProperty("cppSuggestedLocations", &locationListing);
    engine.rootContext()->setContextProperty("cppRecentSearches",  &recentSearches);
    engine.rootContext()->setContextProperty("cppJsonHandler",     &handler);
    engine.rootContext()->setContextProperty("cppFavouritesHandler", &favourites);
    engine.rootContext()->setContextProperty("cppShownProperty", &shownProperty);
    engine.rootContext()->setContextProperty("cppGpsPosition", &gpsPosition);
    engine.load(QUrl(QStringLiteral("qrc:/qml/MainWindow.qml")));

    QObject::connect(&handler,          SIGNAL(propertiesReady(QSharedPointer<QList<Property*> >)), &propertyListing, SLOT(addToListing(QSharedPointer<QList<Property*> >)));
    QObject::connect(&handler,          SIGNAL(locationsReady(QSharedPointer<QList<Location*> >)), &locationListing, SLOT(addToListing(QSharedPointer<QList<Location*> >)));
    QObject::connect(&handler,          SIGNAL(successfullySearched(Search)),                       &searchesStorage, SLOT(addNewSearch(Search)));
    QObject::connect(&searchesStorage , SIGNAL(recentSearchesChanged()),                            &recentSearches,  SLOT(reloadSearchesFromStorage()));
    QObject::connect(&favourites , SIGNAL(favouritedPropertiesChanged()), &favouritesListing,  SLOT(reloadFavouritedFromStorage()));
//    QObject::connect(&gpsPosition , SIGNAL(fetchPosition(QString)), &handler,  SLOT(getFromString(QString)));
//    QObject::connect(engine.rootObjects().first() , SIGNAL(loadProperty(QString guid, QString summary, QString price, QString bedrooms, QString bathrooms, QString propertyType, QString title, QString thumbnailUrl, QString imgurl)), &shownProperty,  SLOT(changeProperty(QString guid, QString summary, QString price, QString bedrooms, QString bathrooms, QString propertyType, QString title, QString thumbnailUrl, QString imgurl)));

    return app.exec();
}

