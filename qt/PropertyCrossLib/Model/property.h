#ifndef PROPERTY_H
#define PROPERTY_H

#include <QString>
#include <QJsonObject>
#include <QObject>

class Property
{
public:
    Property(const QJsonObject &jsonObj);
    Property();

    QString getGuid() const;
    void setGuid(const QString &value);

    QString getSummary() const;
    void setSummary(const QString &value);

    int getPrice() const;
    void setPrice(int value);

    int getBedrooms() const;
    void setBedrooms(int value);

    int getBathrooms() const;
    void setBathrooms(int value);

    QString getPropertyType() const;
    void setPropertyType(const QString &value);

    QString getTitle() const;
    void setTitle(const QString &value);

    QString getThumbnailUrl() const;
    void setThumbnailUrl(const QString &value);

    QString getImageUrl() const;
    void setImageUrl(const QString &value);

    QList<QString> toList() const;
    static Property fromList(QList<QVariant> list);
    static Property fromStrings(QString guid, QString summary, QString price, QString bedrooms, QString bathrooms, QString propertyType, QString title, QString thumbnailUrl, QString imgurl);

private:
     QString m_guid;
     QString m_summary;
     int m_price;
     int m_bedrooms;
     int m_bathrooms;
     QString m_propertyType;
     QString m_title;
     QString m_thumbnailUrl;
     QString m_imageUrl;
};


class PropertyDelegate : public QObject {
    Q_OBJECT
public:
    PropertyDelegate(QObject* parent = 0);
    virtual ~PropertyDelegate () {}

public slots:
    void changeProperty(QString guid, QString summary, QString price, QString bedrooms, QString bathrooms, QString propertyType, QString title, QString thumbnailUrl, QString imageUrl);
signals:
    void propertyChanged(QString guid, QString summary, QString price, QString bedrooms, QString bathrooms, QString propertyType, QString title, QString thumbnailUrl, QString imageUrl);
    void showProperty(QString guid, QString summary, QString price, QString bedrooms, QString bathrooms, QString propertyType, QString title, QString thumbnailUrl, QString imageUrl);
private:
    Property m_property;
};


#endif // PROPERTY_H
