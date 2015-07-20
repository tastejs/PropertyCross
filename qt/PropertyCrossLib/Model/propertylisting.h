#ifndef PROPERTYLISTING_H
#define PROPERTYLISTING_H

#include "property.h"

#include <QObject>
#include <QQmlListProperty>
//#include <QtDeclarative/QDeclarativeItem>

class PropertyListing : public QObject//, public QDeclarativeItem
{
    Q_OBJECT
//    Q_PROPERTY(Property property READ  WRITE setName NOTIFY nameChanged)
    Q_PROPERTY(QQmlListProperty<Property> properties READ properties)
public:
    PropertyListing(QObject* parent = 0);
    QQmlListProperty<Property> properties();
    int propertyCount() const;
    Property *properties(int) const;
public slots:
   void addToListing(QSharedPointer<QList<Property*> > ptrList);
signals:
   void ready();
   void addProperty(QString, QString, QString);
private:
    QList<Property*> m_properties;
};





#endif // PROPERTYLISTING_H
