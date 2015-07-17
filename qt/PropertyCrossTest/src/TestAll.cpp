#include "TestSuite.h"

#include <QtTest/QtTest>
#include <QApplication>

int main(int argc, char **argv)
{
    int failedSuitesCount = 0;
    QVector<QObject*>::iterator iSuite;
    QApplication app(argc, argv);
    for (iSuite = TestSuite::m_suites.begin(); iSuite != TestSuite::m_suites.end(); iSuite++)
    {
        int result = QTest::qExec(*iSuite);
        if (result != 0)
        {
            failedSuitesCount++;
        }
    }
//    TestSuite::m_suites.clear();
    qDebug() << "Finishing up";
    return failedSuitesCount;
}

//TODO known issue: QNetworkAccessManager doesn't get freed on exiting tests
