#include "TestSuite.h"

#include <QtTest/QtTest>
#include "property.h"

class TestProperty: public TestSuite
{
     Q_OBJECT
private slots:
    void can_get_and_set_variables();
};

void TestProperty::can_get_and_set_variables()
{
    Property property;
    property.setBathrooms(1);
    property.setBedrooms(2);
    property.setGuid("a");
    property.setImageUrl("b");
    property.setPrice(3);
    property.setPropertyType("c");
    property.setSummary("d");
    property.setThumbnailUrl("e");
    property.setTitle("f");
    QVERIFY(property.getBathrooms() == 1);
    QVERIFY(property.getBedrooms() == 2 );
    QVERIFY(property.getGuid() == "a" );
    QVERIFY(property.getImageUrl() == "b" );
    QVERIFY(property.getPrice() == 3 );
    QVERIFY(property.getPropertyType() == "c" );
    QVERIFY(property.getSummary() == "d" );
    QVERIFY(property.getThumbnailUrl() == "e" );
    QVERIFY(property.getTitle() == "f" );
}

static TestProperty instance;  //This is where this particular test is instantiated, and thus added to the static list of test suites
#include "TestProperty.moc"
