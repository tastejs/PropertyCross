#include "favourites.h"

#include <QSettings>
#include <QDebug>
#include <QSharedPointer>

const QString storageKey = "favouritedProperties";

FavouritesStorage::FavouritesStorage(QObject *parent) :
QObject(parent)
{

}

void FavouritesStorage::addNewFavourite(Property property)
{
//  qDebug() << "Want to add new Favourite with guid "<< property.getGuid();
    QSettings settings;
    QMap<QString, QVariant> storageList =  settings.value(storageKey).toMap();
    if(storageList.contains(property.getGuid()))
        return;
    storageList.insert(property.getGuid(),QVariant(property.toList()));
    settings.setValue(storageKey, storageList);
    emit favouritedPropertiesChanged();
    qDebug() << "Emit favouritedPropertiesChanged(added), now contains"<<storageList.count();
}

void FavouritesStorage::removeFavourite(Property property)
{
    QSettings settings;
    QMap<QString, QVariant> storageList =  settings.value(storageKey).toMap();
    if(!storageList.contains(property.getGuid()))
        return;
    storageList.remove(property.getGuid());
    settings.setValue(storageKey, storageList);
    emit favouritedPropertiesChanged();
    qDebug() << "Emit favouritedPropertiesChanged(removed)";
}

void FavouritesStorage::addNewFavourite(QString guid, QString summary, QString price, QString bedrooms, QString bathrooms, QString propertyType, QString title, QString thumbnailUrl, QString imageUrl)
{
    addNewFavourite(Property::fromStrings(guid, summary, price, bedrooms, bathrooms, propertyType, title, thumbnailUrl, imageUrl));
}

void FavouritesStorage::removeFavourite(QString guid, QString summary, QString price, QString bedrooms, QString bathrooms, QString propertyType, QString title, QString thumbnailUrl, QString imageUrl)
{

    removeFavourite(Property::fromStrings(guid, summary, price, bedrooms, bathrooms, propertyType, title, thumbnailUrl, imageUrl));
}

void FavouritesStorage::removeAllFavourites()
{
    QSettings settings;
    QMap<QString, QVariant> storageList =  settings.value(storageKey).toMap();
    if(storageList.count()==0)
        return;
    storageList.clear();
    settings.setValue(storageKey, storageList);
    emit favouritedPropertiesChanged();
    qDebug() << "Emit removeAllFavourites";

}

const QList<Property> FavouritesStorage::getFavouritedProperties()
{
    QSettings settings;
    QList<Property> properties;
    QMap <QString, QVariant> favouritedProperties = settings.value(storageKey).toMap();
    for(auto i=favouritedProperties.begin(); i!=favouritedProperties.end(); i++){
        properties.append(Property::fromList(i.value().toList()));
    }
    return properties;
}

bool FavouritesStorage::isFavourited(QString property)
{
    QSettings settings;
    QList<Property> properties;
    QMap <QString, QVariant> favouritedProperties = settings.value(storageKey).toMap();
    return favouritedProperties.contains(property);
}
   void FavouritesStorage::triggerFavouriteToggle()
   {
      emit  toggleFavourite();
   }

FavouritedPropertyListingModel::FavouritedPropertyListingModel(QObject *parent)
    : QAbstractListModel(parent)
{
    reloadFavouritedFromStorage();
}

void FavouritedPropertyListingModel::addProperty(const Property &property)
{
    beginInsertRows(QModelIndex(), rowCount(), rowCount());
    m_properties << property;
    endInsertRows();
}

int FavouritedPropertyListingModel::rowCount(const QModelIndex & parent) const {
    Q_UNUSED(parent);
    return m_properties.count();
}

QVariant FavouritedPropertyListingModel::data(const QModelIndex & index, int role) const {
    if (index.row() < 0 || index.row() >= m_properties.count())
        return QVariant();

    const Property &property = m_properties[index.row()];
    if (role == GuidRole)
        return property.getGuid();
    else if (role == SummaryRole)
        return property.getSummary();
    else if (role == PriceRole)
        return property.getPrice();
    else if (role == BedroomsRole)
        return QString::number(property.getBedrooms());
    else if (role == BathroomsRole)
        return property.getBathrooms();
    else if (role == PropertyTypeRole)
        return property.getPropertyType();
    else if (role == TitleRole)
        return property.getTitle();
    else if (role == ThumbnailUrlRole)
        return property.getThumbnailUrl();
    else if (role == ImageUrlRole)
        return property.getImageUrl();
    return QVariant();
}

QHash<int, QByteArray> FavouritedPropertyListingModel::roleNames() const {
    QHash<int, QByteArray> roles;
    roles[GuidRole] = "guid";
    roles[SummaryRole] = "summary";
    roles[PriceRole] = "price";
    roles[BedroomsRole] = "bedrooms";
    roles[BathroomsRole] = "bathrooms";
    roles[PropertyTypeRole] = "propertyType";
    roles[TitleRole] = "title";
    roles[ThumbnailUrlRole] = "thumbnailUrl";
    roles[ImageUrlRole] = "imageUrl";
    return roles;
}

   void FavouritedPropertyListingModel::addToListing(QSharedPointer<QList<Property*> > ptrList) {
      qDebug() << QString("Received list") ;
      for(int i=0; i<ptrList->size(); i++){
    beginInsertRows(QModelIndex(), rowCount(), rowCount());
    m_properties.append(*ptrList->at(i));
    endInsertRows();
      }
   }

   void FavouritedPropertyListingModel::resetListing() {
       beginResetModel();
       m_properties.clear();
       endResetModel();
   }

   void FavouritedPropertyListingModel::reloadFavouritedFromStorage()
   {
    FavouritesStorage favourites;
    resetListing();
   QList<Property> properties = favourites.getFavouritedProperties();
 //   qDebug() << "Having read"<<properties.count() << "properties";
   for(auto i = properties.begin(); i!=properties.end(); i++) {
    beginInsertRows(QModelIndex(), rowCount(), rowCount());
    m_properties.append(*i);
    endInsertRows();
   }
  // qDebug() <<"Reloaded favourited properties, now there are" <<m_properties.count();

   }


