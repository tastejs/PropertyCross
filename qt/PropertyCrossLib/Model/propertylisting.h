#ifndef PROPERTYLISTING_H
#define PROPERTYLISTING_H

#include "property.h"

#include <QAbstractListModel>
#include <QObject>
#include <QQmlListProperty>

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
