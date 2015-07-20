#ifndef LOCATION_H
#define LOCATION_H

#include <QString>
#include <QJsonObject>
#include <QObject>

class Location : public QObject
{
    Q_OBJECT
public:
    Location(QObject *parent = 0);
    explicit Location(const QJsonObject &jsonObj, QObject *parent = 0 );
    QString getDisplayName() const;
    void setDisplayName(const QString &value);

    QString getName() const;
    void setName(const QString &value);

private:
    QString m_displayName;
    QString m_name;
};

#endif // LOCATION_H
