#include "TestSuite.h"

#include <QtTest/QtTest>

class TestCase1: public TestSuite
{
     Q_OBJECT
private slots:
    void aTestFunction();
    void anotherTestFunction();
};

void TestCase1::aTestFunction()
{
    QString str = "Hello";
    QVERIFY(str.toUpper() == "this will fail");
}

void TestCase1::anotherTestFunction()
{
    QString str = "Goodbye";
    QVERIFY(str.toUpper() == "GOODBYE");
}

static TestCase1 instance;  //This is where this particular test is instantiated, and thus added to the static list of test suites

#include "TestCase1.moc"
