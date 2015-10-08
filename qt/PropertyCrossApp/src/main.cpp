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
#include <QQmlFileSelector>

int main(int argc, char *argv[])
{
    QCoreApplication::setOrganizationName("PropertyCross");
    QCoreApplication::setOrganizationDomain("com.propertycross");
    QCoreApplication::setApplicationName("PropertyCross");

    //we register a new QVariant-type search - enable streaming of it
    qRegisterMetaTypeStreamOperators<Search>("Search");

    QApplication app(argc, argv);

    //initialization of cpp objects
    JsonHandler handler;
    PropertyListingModel propertyListing;
    LocationListingModel locationListing;
    RecentSearchesModel recentSearches;
    RecentSearchesStorage searchesStorage;
    FavouritesStorage favourites;
    FavouritedPropertyListingModel favouritesListing;
    PropertyModel shownProperty;
    Position gpsPosition;
//    searchesStorage.deleteAllRecentSearches();

    QQmlApplicationEngine engine;

    //make our cpp stuff known to the app
    engine.rootContext()->setContextProperty("cppPropertyListing", &propertyListing);
    engine.rootContext()->setContextProperty("cppFavouritesListing", &favouritesListing);
    engine.rootContext()->setContextProperty("cppSuggestedLocations", &locationListing);
    engine.rootContext()->setContextProperty("cppRecentSearches",  &recentSearches);
    engine.rootContext()->setContextProperty("cppJsonHandler",     &handler);
    engine.rootContext()->setContextProperty("cppFavouritesHandler", &favourites);
    engine.rootContext()->setContextProperty("cppShownProperty", &shownProperty);
    engine.rootContext()->setContextProperty("cppGpsPosition", &gpsPosition);
    //enable the (automatic) File selector for qml
    QQmlFileSelector* selector = new QQmlFileSelector(&engine);
    //now load the mainWindow
    engine.load(QUrl(QStringLiteral("qrc:/qml/MainWindow.qml")));

    //connect all needed signals and slots
    QObject::connect(&handler,          SIGNAL(propertiesReady(QSharedPointer<QList<Property*> >)), &propertyListing, SLOT(addToListing(QSharedPointer<QList<Property*> >)));
    QObject::connect(&handler,          SIGNAL(locationsReady(QSharedPointer<QList<Location*> >)), &locationListing, SLOT(addToListing(QSharedPointer<QList<Location*> >)));
    QObject::connect(&handler,          SIGNAL(successfullySearched(Search)),                       &searchesStorage, SLOT(addNewSearch(Search)));
    QObject::connect(&searchesStorage , SIGNAL(recentSearchesChanged()),                            &recentSearches,  SLOT(reloadSearchesFromStorage()));
    QObject::connect(&favourites , SIGNAL(favouritedPropertiesChanged()), &favouritesListing,  SLOT(reloadFavouritedFromStorage()));

    return app.exec();
}

