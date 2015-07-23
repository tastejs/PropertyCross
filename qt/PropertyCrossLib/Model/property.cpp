#include "property.h"
#include <QDebug>
Property::Property()://QObject *parent) :
   //QObject(parent),
    m_price(0),
    m_bedrooms(0),
    m_bathrooms(0) {

}

Property::Property(const QJsonObject& jsonObj)://, QObject *parent) :
//   QObject(parent),
    m_price(0),
    m_bedrooms(0),
    m_bathrooms(0)
{
    m_bathrooms = jsonObj.value(QString("bathroom_number")).toInt(0);
    m_bedrooms  = jsonObj.value(QString("bedroom_number")).toInt(0);
    m_guid             = jsonObj.value(QString("guid")).toString();
    m_imageUrl           = jsonObj.value(QString("img_url")).toString();
    m_price            = jsonObj.value(QString("price")).toInt(0);
    m_summary          = jsonObj.value(QString("summary")).toString();
    m_thumbnailUrl         = jsonObj.value(QString("thumb_url")).toString();
    m_title            = jsonObj.value(QString("title")).toString();
    m_propertyType     = jsonObj.value(QString("property_type")).toString();
//    qDebug() <<"Property has"<<m_bedrooms<<","<<m_bathrooms;
}

QString Property::getGuid() const
{
    return m_guid;
}

void Property::setGuid(const QString &value)
{
    m_guid = value;
}
QString Property::getSummary() const
{
    return m_summary;
}

void Property::setSummary(const QString &value)
{
    m_summary = value;
}
int Property::getPrice() const
{
    return m_price;
}

void Property::setPrice(int value)
{
    m_price = value;
}
int Property::getBedrooms() const
{
    return m_bedrooms;
}

void Property::setBedrooms(int value)
{
    m_bedrooms = value;
}
int Property::getBathrooms() const
{
    return m_bathrooms;
}

void Property::setBathrooms(int value)
{
    m_bathrooms = value;
}
QString Property::getPropertyType() const
{
    return m_propertyType;
}

void Property::setPropertyType(const QString &value)
{
    m_propertyType = value;
}
QString Property::getTitle() const
{
    return m_title;
}

void Property::setTitle(const QString &value)
{
    m_title = value;
}
QString Property::getThumbnailUrl() const
{
    return m_thumbnailUrl;
}

void Property::setThumbnailUrl(const QString &value)
{
    m_thumbnailUrl = value;
}
QString Property::getImageUrl() const
{
    return m_imageUrl;
}

void Property::setImageUrl(const QString &value)
{
    m_imageUrl = value;
}

QList<QString> Property::toList() const
{
   QList<QString> list;
   list.append(m_guid);
   list.append(m_summary);
     list.append(QString::number(m_price));
     list.append(QString::number(m_bedrooms));
     list.append(QString::number(m_bathrooms));
     list.append(m_propertyType);
     list.append(m_title);
     list.append(m_thumbnailUrl);
     list.append(m_imageUrl);
     return list;
}

Property Property::fromList(QList<QVariant> list)
{
   Property property;
   property.setGuid(list[0].toString());
   property.setSummary(list[1].toString());
   property.setPrice(list[2].toString().toInt());
   property.setBedrooms(list[3].toString().toInt());
   property.setBathrooms(list[4].toString().toInt());
   property.setPropertyType(list[5].toString());
   property.setTitle(list[6].toString());
   property.setThumbnailUrl(list[7].toString());
   property.setImageUrl(list[8].toString());
   return property;
}

Property Property::fromStrings(QString guid, QString summary, QString price, QString bedrooms, QString bathrooms, QString propertyType, QString title, QString thumbnailUrl, QString imageUrl)
{
   Property property;
   property.setGuid(guid);
   property.setSummary(summary);
   property.setPrice(price.toInt());
   property.setBedrooms(bedrooms.toInt());
   property.setBathrooms(bathrooms.toInt());
   property.setPropertyType(propertyType);
   property.setTitle(title);
   property.setThumbnailUrl(thumbnailUrl);
   property.setImageUrl(imageUrl);
   return property;

}










