#include <QApplication>
#include "jsonhandler.h"
#include "propertylisting.h"
#include "recentsearches.h"
#include "favourites.h"

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

    QQmlApplicationEngine engine;
    engine.rootContext()->setContextProperty("cppPropertyListing", &propertyListing);
    engine.rootContext()->setContextProperty("cppFavouritesListing", &favouritesListing);
    engine.rootContext()->setContextProperty("cppSuggestedLocations", &locationListing);
    engine.rootContext()->setContextProperty("cppRecentSearches",  &recentSearches);
    engine.rootContext()->setContextProperty("cppJsonHandler",     &handler);
    engine.rootContext()->setContextProperty("cppFavouritesHandler", &favourites);
    engine.rootContext()->setContextProperty("cppShownProperty", &shownProperty);
    engine.load(QUrl(QStringLiteral("qrc:/qml/MainWindow.qml")));
//QObject *rootObject = engine.rootObjects().first();
//    QObject *qtoolButton_star = rootObject->findChild<QObject*>("propertyLayout");
    //if(qtoolButton_star!=0){
//    QObject::connect(&qtoolButton_star, SIGNAL(onClicked()), &favourites, SLOT(addNewFavourite(Property)));
//    }
//    else{
//        qWarning() << "Could not find propertyLayout";
//    }
    QObject::connect(&handler,          SIGNAL(propertiesReady(QSharedPointer<QList<Property*> >)), &propertyListing, SLOT(addToListing(QSharedPointer<QList<Property*> >)));
    QObject::connect(&handler,          SIGNAL(locationsReady(QSharedPointer<QList<Location*> >)), &locationListing, SLOT(addToListing(QSharedPointer<QList<Location*> >)));
    QObject::connect(&handler,          SIGNAL(successfullySearched(Search)),                       &searchesStorage, SLOT(addNewSearch(Search)));
    QObject::connect(&searchesStorage , SIGNAL(recentSearchesChanged()),                            &recentSearches,  SLOT(reloadSearchesFromStorage()));
    QObject::connect(&favourites , SIGNAL(favouritedPropertiesChanged()), &favouritesListing,  SLOT(reloadFavouritedFromStorage()));
//    QObject::connect(engine.rootObjects().first() , SIGNAL(loadProperty(QString guid, QString summary, QString price, QString bedrooms, QString bathrooms, QString propertyType, QString title, QString thumbnailUrl, QString imgurl)), &shownProperty,  SLOT(changeProperty(QString guid, QString summary, QString price, QString bedrooms, QString bathrooms, QString propertyType, QString title, QString thumbnailUrl, QString imgurl)));

    return app.exec();
}

