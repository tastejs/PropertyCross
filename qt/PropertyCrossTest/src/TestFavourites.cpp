#include "TestSuite.h"

#include "favourites.h"

#include <QSignalSpy>
#include <QtTest/QtTest>

Q_DECLARE_METATYPE( QSharedPointer<QList<Property*> > )
Q_DECLARE_METATYPE( Property)

class TestFavourites: public TestSuite
{
    Q_OBJECT
private slots:
  void initTestCase();
    void can_add_and_remove_properties();
    void triggering_Toggle_does_signal_toggle();
    void can_get_list_of_favourtied_properties();
    void correctly_identifies_favourited_property();
};

void TestFavourites::initTestCase() {
    //For QSettings to work one has to have set the Organization information
    QCoreApplication::setOrganizationName("PropertyCrossTest");
    QCoreApplication::setOrganizationDomain("com.propertycrossTest");
    QCoreApplication::setApplicationName("PropertyCrossTest");
}

void TestFavourites::can_add_and_remove_properties()
{
    //qRegisterMetaTypeStreamOperators<Property>("Property");
    FavouritesStorage favourites;
    favourites.removeAllFavourites();
    QSignalSpy spy(&favourites, SIGNAL(favouritedPropertiesChanged()));
    Property property = Property::fromStrings("g1-TNtAzM4UjM2UDM=E","Summary","5.5","1","1","propertyType","title","httpThumbnail","httpimageUrl");
    qDebug() << "TestProperty"<<property.getGuid();

    //Adding a new property should generate a corresponding signal
    favourites.addNewFavourite(property);
    QCOMPARE(spy.count(), 1);
    spy.clear();

    //Adding the same property should do nothing
    favourites.addNewFavourite(property);
    QCOMPARE(spy.count(), 0);

    //removing this favourite should have triggered a signal again
    favourites.removeFavourite(property);
    QCOMPARE(spy.count(), 1);
    spy.clear();

    //Removing the same property should do nothing
    favourites.removeFavourite(property);
    QCOMPARE(spy.count(), 0);

    //Adding a new property from strings should generate a corresponding signal
    favourites.addNewFavourite("abcd","Summary","5.5","1","1","propertyType","title","httpThumbnail","httpimageUrl");
    QCOMPARE(spy.count(), 1);
    spy.clear();

    //adding the same property should do nothing
    favourites.addNewFavourite("abcd","Summary","5.5","1","1","propertyType","title","httpThumbnail","httpimageUrl");
    QCOMPARE(spy.count(), 0);

    //removing this favourite should have triggered a signal again
    favourites.removeFavourite("abcd","Summary","5.5","1","1","propertyType","title","httpThumbnail","httpimageUrl");
    QCOMPARE(spy.count(), 1);
    spy.clear();

    //removing the same property should do nothing
    favourites.removeFavourite("abcd","Summary","5.5","1","1","propertyType","title","httpThumbnail","httpimageUrl");
    QCOMPARE(spy.count(), 0);
    spy.clear();

    //removing all Favourites should emit a signal, when there's at least one favourite
    favourites.addNewFavourite("abcd","Summary","5.5","1","1","propertyType","title","httpThumbnail","httpimageUrl");
    spy.clear();
    favourites.removeAllFavourites();
    QCOMPARE(spy.count(), 1);
    spy.clear();

    //should not emit if there are no favourites
    favourites.removeAllFavourites();
    QCOMPARE(spy.count(), 0);
}

void TestFavourites::correctly_identifies_favourited_property() {
    qRegisterMetaTypeStreamOperators<Property>("Property");
    FavouritesStorage favourites;

    favourites.addNewFavourite("g1-TNtAzM4UjM2UDM=E","Summary","5.5","1","1","propertyType","title","httpThumbnail","httpimageUrl");
    QVERIFY(favourites.isFavourited("g1-TNtAzM4UjM2UDM=E")==true);
    QVERIFY(favourites.isFavourited("abcd")==false);
}

void TestFavourites::triggering_Toggle_does_signal_toggle() {
    qRegisterMetaTypeStreamOperators<Property>("Property");
    FavouritesStorage favourites;
    QSignalSpy spy(&favourites, SIGNAL(toggleFavourite()));

    favourites.triggerFavouriteToggle();
    QCOMPARE(spy.count(), 1);
}

void TestFavourites::can_get_list_of_favourtied_properties() {
    FavouritesStorage favourites;

    favourites.removeAllFavourites();
    favourites.addNewFavourite("fav1","Summary","5.5","1","1","propertyType","title","httpThumbnail","httpimageUrl");
    favourites.addNewFavourite("fav2","Summary","5.5","1","1","propertyType","title","httpThumbnail","httpimageUrl");
    QList<Property> list =  favourites.getFavouritedProperties();

    //should now be able to retrieve both properties correctly
    QCOMPARE(list.count(), 2);
    QVERIFY(list.at(0).getGuid()=="fav1");
    QVERIFY(list.at(1).getGuid()=="fav2");
}

static TestFavourites instance;  //This is where this particular test is instantiated, and thus added to the static list of test suites
#include "TestFavourites.moc"
