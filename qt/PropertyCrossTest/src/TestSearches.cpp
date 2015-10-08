#include "TestSuite.h"
#include "searches.h"

#include <QSignalSpy>
#include <QtTest/QtTest>

class TestSearches: public TestSuite
{
    Q_OBJECT
private slots:
    void initTestCase();
    void can_add_Searches();
    void maximum_of_four_Searches_Works();
    void deleting_all_tests_works();
};

void TestSearches::initTestCase() {
    //For QSettings to work one has to have set the Organization information
    QCoreApplication::setOrganizationName("PropertyCrossTest");
    QCoreApplication::setOrganizationDomain("com.propertycrossTest");
    QCoreApplication::setApplicationName("PropertyCrossTest");
}
void TestSearches::can_add_Searches() {
    RecentSearchesStorage searches;
    searches.deleteAllRecentSearches();
    QSignalSpy spy(&searches, SIGNAL(recentSearchesChanged()));
    Search test1("Test1", 1);
    searches.addNewSearch(test1);
    QTest::qWait(1000);
    QCOMPARE(spy.count(), 1);
    QList<Search> list = searches.getRecentSearches();
    QVERIFY(list.at(0).search()=="Test1");
    QVERIFY(list.at(0).results()==1);
}
void TestSearches::maximum_of_four_Searches_Works() {
    RecentSearchesStorage searches;
    searches.deleteAllRecentSearches();
    QSignalSpy spy(&searches, SIGNAL(recentSearchesChanged()));
    Search test1("Test1", 1);
    Search test2("Test2", 2);
    Search test3("Test3", 3);
    Search test4("Test4", 4);
    Search test5("Test5", 5);

    searches.addNewSearch(test1);
    searches.addNewSearch(test2);
    searches.addNewSearch(test3);
    searches.addNewSearch(test4);

    QCOMPARE(spy.count(), 4);
    spy.clear();

    //at this point, the Search buffer is "full" - on next add the oldest search will be deleted
    searches.addNewSearch(test5);
    QCOMPARE(spy.count(), 1);
    QList<Search> list = searches.getRecentSearches();
    QVERIFY(list.contains(test5));
    QVERIFY(list.contains(test4));
    QVERIFY(list.contains(test3));
    QVERIFY(list.contains(test2));
    QVERIFY(!list.contains(test1));
    spy.clear();

    //Re-adding Test1 should work again - Test2 should now be deleted
    searches.addNewSearch(test1);
    QCOMPARE(spy.count(), 1);
    list = searches.getRecentSearches();
    QVERIFY(list.contains(test5));
    QVERIFY(list.contains(test4));
    QVERIFY(list.contains(test3));
    QVERIFY(list.contains(test1));
    QVERIFY(!list.contains(test2));
}

void TestSearches::deleting_all_tests_works() {
    RecentSearchesStorage searches;
    searches.deleteAllRecentSearches();
    QSignalSpy spy(&searches, SIGNAL(recentSearchesChanged()));
    Search test1("Test1", 1);
    Search test2("Test2", 2);

    searches.addNewSearch(test1);
    searches.addNewSearch(test2);

    QList<Search> list = searches.getRecentSearches();
    QCOMPARE(list.count(), 2);
    spy.clear();

    //deleteAllRecentSearches() should remove all Searches from the list and emit a signal
    searches.deleteAllRecentSearches();
    QCOMPARE(spy.count(), 1);
    list = searches.getRecentSearches();
    QCOMPARE(list.count(), 0);
}


static TestSearches instance;  //This is where this particular test is instantiated, and thus added to the static list of test suites
#include "TestSearches.moc"
