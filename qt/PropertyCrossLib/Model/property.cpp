#include "property.h"
Property::Property(QObject *parent) :
   QObject(parent),
    m_price(0),
    m_bedrooms(0),
    m_bathrooms(0) {

}

Property::Property(const QJsonObject& jsonObj, QObject *parent) :
   QObject(parent),
    m_price(0),
    m_bedrooms(0),
    m_bathrooms(0)
{
    m_bathrooms = jsonObj.value(QString("bathroom_number")).toString().toInt(0);
    m_bedrooms  = jsonObj.value(QString("bedroom_number")).toString().toInt(0);
    m_guid             = jsonObj.value(QString("guid")).toString();
    m_imageUrl           = jsonObj.value(QString("img_url")).toString();
    m_price            = jsonObj.value(QString("price")).toInt(0);
    m_summary          = jsonObj.value(QString("summary")).toString();
    m_thumbnailUrl         = jsonObj.value(QString("thumb_url")).toString();
    m_title            = jsonObj.value(QString("title")).toString();
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










