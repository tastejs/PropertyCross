#include "TestSuite.h"

#include <QtTest/QtTest>
#include "property.h"
#include "jsonhandler.h"

#include <QUrl>
#include <QSignalSpy>

Q_DECLARE_METATYPE( QSharedPointer<QList<Property> > )

class TestJsonHandler: public TestSuite
{
    Q_OBJECT
public:
    virtual ~TestJsonHandler();
private slots:
    void can_make_requests();
};

void TestJsonHandler::can_make_requests()
{
    JsonHandler handler(this);
    qRegisterMetaType<QSharedPointer<QList<Property> > >("QSharedPointer<QList<Property> >");
    QSignalSpy spy(&handler, SIGNAL(propertiesReady(QSharedPointer<QList<Property> >)));
    handler.getFromString("London",0);
    //Give the request 2seconds of time
    QTest::qWait(2000);
    //handler should have emitted one signal by now
    QCOMPARE(spy.count(), 1);
    QList<QVariant> arguments = spy.takeFirst();
    if(arguments.size()>0) {
        QSharedPointer<QList<Property> > listing = arguments.first().value<QSharedPointer<QList<Property> > >();
        //Check that we have gotten something (may fail if no internet connection /server not reachable
        QVERIFY(listing->at(0).getTitle()!=QString(""));
        //qDebug() <<listing->begin()->getTitle();
    }
}
TestJsonHandler::~TestJsonHandler() { qDebug()<<"Exiting TestJsonHandler";}


static TestJsonHandler instance;  //This is where this particular test is instantiated, and thus added to the static list of test suites
#include "TestJsonHandler.moc"

