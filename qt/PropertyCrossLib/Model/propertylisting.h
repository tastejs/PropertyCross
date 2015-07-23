#ifndef PROPERTYLISTING_H
#define PROPERTYLISTING_H

#include "property.h"

#include <QAbstractListModel>
#include <QObject>
#include <QQmlListProperty>
//#include <QtDeclarative/QDeclarativeItem>
/*
class PropertyListing : public QObject//, public QDeclarativeItem
{
    Q_OBJECT
//    Q_PROPERTY(Property property READ  WRITE setName NOTIFY nameChanged)
    //Q_PROPERTY(QQmlListProperty<Property> properties READ properties)
public:
    PropertyListing(QObject* parent = 0);
    QQmlListProperty<Property> properties();
    int propertyCount() const;
    Property *properties(int) const;
public slots:
   void addToListing(QSharedPointer<QList<Property*> > ptrList);
signals:
   void ready();
   void addProperty(QString title, QString price, QString imgurl);
private:
    QList<Property*> m_properties;
};*/

class PropertyListingModel : public QAbstractListModel {
    Q_OBJECT
public:
    enum PropertyRoles {
        GuidRole = Qt::UserRole + 1,
        SummaryRole,
        PriceRole,
        BedroomsRole,
        BathroomsRole,
        PropertyTypeRole,
        TitleRole,
        ThumbnailUrlRole,
        ImageUrlRole
    };

    PropertyListingModel(QObject *parent = 0);

    void addProperty(const Property &property);

    int rowCount(const QModelIndex & parent = QModelIndex()) const;

    QVariant data(const QModelIndex & index, int role = Qt::DisplayRole) const;
public slots:
   void addToListing(QSharedPointer<QList<Property*> > ptrList);
   void resetListing();

protected:
    QHash<int, QByteArray> roleNames() const;
private:
    QList<Property> m_properties;
};





#endif // PROPERTYLISTING_H
