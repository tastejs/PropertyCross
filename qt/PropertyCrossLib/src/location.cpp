#include "location.h"

#include <QSharedPointer>
#include <QDebug>

Location::Location()//QObject *parent):
   //QObject(parent)
{

}

Location::Location(const QJsonObject &jsonObj) {//, QObject *parent ) :  QObject(parent){

    m_displayName             = jsonObj.value(QString("long_title")).toString();
    m_name             = jsonObj.value(QString("place_name")).toString();
}

QString Location::getDisplayName() const
{
    return m_displayName;
}

void Location::setDisplayName(const QString &value)
{
    m_displayName = value;
}
QString Location::getName() const
{
    return m_name;
}

void Location::setName(const QString &value)
{
    m_name = value;
}



LocationListingModel::LocationListingModel(QObject *parent)
    : QAbstractListModel(parent)
{
}

void LocationListingModel::addLocation(const Location &location)
{
    beginInsertRows(QModelIndex(), rowCount(), rowCount());
    m_locations << location;
    endInsertRows();
}

int LocationListingModel::rowCount(const QModelIndex & parent) const {
    Q_UNUSED(parent);
    return m_locations.count();
}

QVariant LocationListingModel::data(const QModelIndex & index, int role) const {
    if (index.row() < 0 || index.row() >= m_locations.count())
        return QVariant();

    const Location &location = m_locations[index.row()];
    if (role == DisplayNameRole)
        return location.getDisplayName();
    else if (role == NameRole)
        return location.getName();
    return QVariant();
}

QHash<int, QByteArray> LocationListingModel::roleNames() const {
    QHash<int, QByteArray> roles;
    roles[DisplayNameRole] = "displayName";
    roles[NameRole] = "name";
    return roles;
}

   void LocationListingModel::addToListing(QSharedPointer<QList<Location*> > ptrList) {
      qDebug() << QString("Received Location list") ;
    beginResetModel();//QModelIndex(), rowCount(), rowCount());
      m_locations.clear();
    endResetModel();
      for(int i=0; i<ptrList->size(); i++){
    beginInsertRows(QModelIndex(), rowCount(), rowCount());
    m_locations.append(*ptrList->at(i));
    endInsertRows();
      }
   }

