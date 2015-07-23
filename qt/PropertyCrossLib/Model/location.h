#ifndef LOCATION_H
#define LOCATION_H

#include <QString>
#include <QJsonObject>
#include <QObject>
#include <QAbstractListModel>

class Location //: public QObject
{
//    Q_OBJECT
public:
    Location();//QObject *parent = 0);
    explicit Location(const QJsonObject &jsonObj);//, QObject *parent = 0 );
    QString getDisplayName() const;
    void setDisplayName(const QString &value);

    QString getName() const;
    void setName(const QString &value);

private:
    QString m_displayName;
    QString m_name;
};

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
