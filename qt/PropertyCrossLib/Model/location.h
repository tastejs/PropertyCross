#ifndef LOCATION_H
#define LOCATION_H

#include <QString>
#include <QJsonObject>

class Location
{
public:
    Location();
    explicit Location(const QJsonObject &jsonObj);
    QString getDisplayName() const;
    void setDisplayName(const QString &value);

    QString getName() const;
    void setName(const QString &value);

private:
    QString m_displayName;
    QString m_name;
};

#endif // LOCATION_H
