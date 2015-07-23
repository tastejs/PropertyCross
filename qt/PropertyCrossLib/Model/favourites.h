#ifndef FAVOURITES_H
#define FAVOURITES_H

#include "property.h"

#include <QAbstractListModel>

/*Persisten storage for favourited Properties */
class Favourites : public QObject
{
    Q_OBJECT
public:
    Favourites(QObject *parent = 0);
public slots:
    void addNewFavourite(Property property);
    void removeFavourite(Property property);
void addNewFavourite(QString guid, QString summary, QString price, QString bedrooms, QString bathrooms, QString propertyType, QString title, QString thumbnailUrl, QString imageUrl);
void removeFavourite(QString guid, QString summary, QString price, QString bedrooms, QString bathrooms, QString propertyType, QString title, QString thumbnailUrl, QString imageUrl);
    const QList<Property> getFavouritedProperties();
signals:
    void favouritedPropertiesChanged();
private:

};

class FavouritedPropertyListingModel : public QAbstractListModel {
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

    FavouritedPropertyListingModel(QObject *parent = 0);

    void addProperty(const Property &property);

    int rowCount(const QModelIndex & parent = QModelIndex()) const;

    QVariant data(const QModelIndex & index, int role = Qt::DisplayRole) const;
public slots:
   void addToListing(QSharedPointer<QList<Property*> > ptrList);
   void resetListing();
   void reloadFavouritedFromStorage();


protected:
    QHash<int, QByteArray> roleNames() const;
private:
    QList<Property> m_properties;
};

#endif // FAVOURITES_H
