#ifndef TESTSUITE_H
#define TESTSUITE_H

#include <QObject>
#include <vector>

class TestSuite : public QObject
{
    Q_OBJECT
public:
    static std::vector<QObject*> m_suites;

public:
    explicit TestSuite();

};

#endif // TESTSUITE_H

