#ifndef IPROPERTYHANDLER
#define IPROPERTYHANDLER
#include <QObject>
#include <QList>
#include <QSharedPointer>

/** Abstract interface for PropertyHandler */
class IPropertyHandler {
public:
    virtual void getFromString(QString location, int page) = 0;
    virtual ~IPropertyHandler() {}

};

#endif // IPROPERTYHANDLER

