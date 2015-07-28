#include "TestSuite.h"

#include <QtTest/QtTest>
#include "position.h"

class TestPosition: public TestSuite
{
 Q_OBJECT
private slots:
void can_get_position();
};

void TestPosition::can_get_position()
{
Position position;
    QSignalSpy spyString(&position, SIGNAL(getPosition(QString)));
    QSignalSpy spyError(&position, SIGNAL(getPositionError()));
    position.startPositionRequest();
    QTest::qWait(2000);
   qDebug() << "Got location: " <<  spyString.first().first().value<QString>();
    QCOMPARE(spyString.count(),1);
    QCOMPARE(spyError.count(),0);

//QVERIFY(position.getDisplayName() == "London" );
//QVERIFY(position.getName() == "Lndn" );
}

static TestPosition instance;  //This is where this particular test is instantiated, and thus added to the static list of test suites
#include "TestPosition.moc"
