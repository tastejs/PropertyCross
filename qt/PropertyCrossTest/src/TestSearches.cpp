#include "TestSuite.h"
#include "searches.h"

#include <QSignalSpy>
#include <QtTest/QtTest>

class TestSearches: public TestSuite
{
    Q_OBJECT
private slots:
  void initTestCase();
};

void TestSearches::initTestCase() {
    //For QSettings to work one has to have set the Organization information
    QCoreApplication::setOrganizationName("PropertyCrossTest");
    QCoreApplication::setOrganizationDomain("com.propertycrossTest");
    QCoreApplication::setApplicationName("PropertyCrossTest");
}
static TestSearches instance;  //This is where this particular test is instantiated, and thus added to the static list of test suites
#include "TestSearches.moc"
