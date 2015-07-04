#include "TestSuite.h"

#include <QtTest/QtTest>
#include <iostream>

int main(int, char**)
{
    int failedSuitesCount = 0;
    std::vector<QObject*>::iterator iSuite;
    for (iSuite = TestSuite::m_suites.begin(); iSuite != TestSuite::m_suites.end(); iSuite++)
    {
        int result = QTest::qExec(*iSuite);
        if (result != 0)
        {
            failedSuitesCount++;
        }
    }
    return failedSuitesCount;
}
