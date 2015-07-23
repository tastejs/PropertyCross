#include "TestSuite.h"

#include <QtTest/QtTest>
#include "property.h"
#include "jsonhandler.h"

#include <QUrl>
#include <QSignalSpy>

Q_DECLARE_METATYPE( QSharedPointer<QList<Property*> > )
Q_DECLARE_METATYPE( QSharedPointer<QList<Location*> > )

class TestJsonHandler: public TestSuite
{
    Q_OBJECT
public:
    virtual ~TestJsonHandler();
private slots:
    void can_make_requests_with_String();
    void can_get_location_list();
    void can_emit_errors();
};

void TestJsonHandler::can_make_requests_with_String()
{
    JsonHandler handler(this);
    qRegisterMetaType<QSharedPointer<QList<Property*> > >("QSharedPointer<QList<Property> >");
    QSignalSpy spy(&handler, SIGNAL(propertiesReady(QSharedPointer<QList<Property> >)));
    //Try to get SECOND page from LONDON listing
    handler.getFromString("London",1);
    //Give the request 2seconds of time
    QTest::qWait(2000);
    //handler should have emitted one signal by now
    QCOMPARE(spy.count(), 1);
    QList<QVariant> arguments = spy.takeFirst();
    if(arguments.size()>0) {
        QSharedPointer<QList<Property*> > listing = arguments.first().value<QSharedPointer<QList<Property*> > >();
        //Check that we have gotten something (may fail if no internet connection /server not reachable
        QVERIFY(listing->at(0)->getTitle()!=QString(""));
        QCOMPARE(listing->size(),20);
        qDebug() <<listing->at(0)->getTitle();
    } else {
        QFAIL("Could not retrieve property listing");
    }
}

void TestJsonHandler::can_get_location_list() {
    JsonHandler handler(this);
    qRegisterMetaType<QSharedPointer<QList<Location*> > >("QSharedPointer<QList<Location> >");
    QSignalSpy spy(&handler, SIGNAL(locationsReady(QSharedPointer<QList<Location*> >)));

    //this request should get us a location listing
    handler.getFromString("newcr",0);
    QTest::qWait(2000);

    QCOMPARE(spy.count(),1);
    QList<QVariant> arguments = spy.takeFirst();
    if(arguments.size()>0) {
        QSharedPointer<QList<Location*> > listing = arguments.first().value<QSharedPointer<QList<Location*> > >();
        //Check that we have gotten something (may fail if no internet connection /server not reachable
        QCOMPARE(listing->at(0)->getDisplayName(),QString("Newark"));
        QCOMPARE(listing->size(),2);
    } else {
        QFAIL("Could not retrieve location listing");
    }
}

void TestJsonHandler::can_emit_errors() {
    JsonHandler handler(this);
    QSignalSpy spy(&handler, SIGNAL(errorRetrievingRequest()));

    //break the Code intentionally
    handler.getFromString("&abcd=",0);
    QTest::qWait(2000);
    //should emit error
    QCOMPARE(spy.count(),1);
}


TestJsonHandler::~TestJsonHandler() { qDebug()<<"Exiting TestJsonHandler";}


static TestJsonHandler instance;  //This is where this particular test is instantiated, and thus added to the static list of test suites
#include "TestJsonHandler.moc"

