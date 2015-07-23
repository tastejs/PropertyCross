#include "propertylisting.h"
#include "property.h"
#include <QList>
#include <QDebug>
#include <QSharedPointer>

PropertyListingModel::PropertyListingModel(QObject *parent)
    : QAbstractListModel(parent)
{
}

void PropertyListingModel::addProperty(const Property &property)
{
    beginInsertRows(QModelIndex(), rowCount(), rowCount());
    m_properties << property;
    endInsertRows();
}

int PropertyListingModel::rowCount(const QModelIndex & parent) const {
    Q_UNUSED(parent);
    return m_properties.count();
}

QVariant PropertyListingModel::data(const QModelIndex & index, int role) const {
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

QHash<int, QByteArray> PropertyListingModel::roleNames() const {
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

   void PropertyListingModel::addToListing(QSharedPointer<QList<Property*> > ptrList) {
      qDebug() << QString("Received list") ;
//      m_properties.clear();
      for(int i=0; i<ptrList->size(); i++){
    //  m_properties.append(ptrList->at(i));
//    m_properties << (*property);
    beginInsertRows(QModelIndex(), rowCount(), rowCount());
    m_properties.append(*ptrList->at(i));
    endInsertRows();
//      emit addProperty(ptrList->at(i)->getTitle(), QString::number(ptrList->at(i)->getPrice()), ptrList->at(i)->getImageUrl());
      }
 //     emit ready();
   }

   void PropertyListingModel::resetListing() {
       beginResetModel();
       m_properties.clear();
       endResetModel();
   }
