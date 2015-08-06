#ifndef LOCATION_H
#define LOCATION_H

#include <QString>
#include <QJsonObject>
#include <QObject>
#include <QAbstractListModel>

/** Class to hold a location to be queried */
class Location
{
public:
    Location();
    explicit Location(const QJsonObject &jsonObj);
    /** Get the name to be displayed according to the nestopia API */
    QString getDisplayName() const;
    void setDisplayName(const QString &value);

    /** Get the name according to the nestopia API */
    QString getName() const;
    void setName(const QString &value);

private:
    QString m_displayName;
    QString m_name;
};

/** Model to hold multiple locations, to be used in e.g. a ListView */
class LocationListingModel : public QAbstractListModel {
    Q_OBJECT
public:
    enum LocationRoles {
        DisplayNameRole = Qt::UserRole + 1,
        NameRole
    };

    LocationListingModel(QObject *parent = 0);

    void addLocation(const Location &location);

    int rowCount(const QModelIndex & parent = QModelIndex()) const;

    QVariant data(const QModelIndex & index, int role = Qt::DisplayRole) const;
public slots:
   void addToListing(QSharedPointer<QList<Location*> > ptrList);

protected:
    QHash<int, QByteArray> roleNames() const;
private:
    QList<Location> m_locations;
};
#endif // LOCATION_H
