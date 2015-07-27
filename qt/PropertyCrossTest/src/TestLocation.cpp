
#include "TestSuite.h"

#include <QtTest/QtTest>
#include "location.h"

class TestLocation: public TestSuite
{
 Q_OBJECT
private slots:
void can_get_and_set_variables();
};

void TestLocation::can_get_and_set_variables()
{
Location location;
location.setDisplayName("London");
location.setName("Lndn");
QVERIFY(location.getDisplayName() == "London" );
QVERIFY(location.getName() == "Lndn" );
}

static TestLocation instance;  //This is where this particular test is instantiated, and thus added to the static list of test suites
#include "TestLocation.moc"
