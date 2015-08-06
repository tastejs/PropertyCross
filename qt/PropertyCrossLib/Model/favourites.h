#ifndef FAVOURITES_H
#define FAVOURITES_H

#include "property.h"

#include <QAbstractListModel>

/**
 * A Class which saves Favourited Properties in to persistent storage
*/
class FavouritesStorage : public QObject
{
    Q_OBJECT
public:
    FavouritesStorage(QObject *parent = 0);
public slots:
    void addNewFavourite(Property property);
    void removeFavourite(Property property);
    void addNewFavourite(QString guid, QString summary, QString price, QString bedrooms, QString bathrooms, QString propertyType, QString title, QString thumbnailUrl, QString imageUrl);
    void removeFavourite(QString guid, QString summary, QString price, QString bedrooms, QString bathrooms, QString propertyType, QString title, QString thumbnailUrl, QString imageUrl);
    /** Removes all favourites from the persistent storage */
    void removeAllFavourites();
    /** Get a list of the favourited properties from the storage */
    const QList<Property> getFavouritedProperties();
    /** Determines if a property is in the storage of favourited properties
     * param property The property to query
     * return true if property is in storage, false otherwise */
    bool isFavourited(QString property);
    /** Helper method to trigger the toggleFavourite method */
    void triggerFavouriteToggle();
signals:
    /** Is emitted if there was any change to the storage */
    void favouritedPropertiesChanged();
    /** Is emitted to let UI components know that they should change their state */
    void toggleFavourite();
private:

};

/** The Model of the Favourited Properties, to be used in a Listview */
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
