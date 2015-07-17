#include "TestSuite.h"

QVector<QObject*> TestSuite::m_suites;

TestSuite::TestSuite() : QObject()
{
    m_suites.push_back(this);
}
