#include "TestSuite.h"

#include <QtTest/QtTest>
#include "position.h"

class TestPosition: public TestSuite
{
 Q_OBJECT
private slots:
void can_get_position();
};

/* This test may fail on Windows - due to insufficient API */
void TestPosition::can_get_position()
{
Position position;
    QSignalSpy spyString(&position, SIGNAL(fetchPosition(QString)));
    QSignalSpy spyError(&position, SIGNAL(fetchPositionError()));
    position.startPositionRequest();
    QTest::qWait(3000);
   qDebug() << "Got location: " <<  spyString.first().first().value<QString>();
    QCOMPARE(spyString.count(),1);
    QCOMPARE(spyError.count(),0);

}
#ifndef _WIN32
static TestPosition instance;  //This is where this particular test is instantiated, and thus added to the static list of test suites
#include "TestPosition.moc"
#endif
