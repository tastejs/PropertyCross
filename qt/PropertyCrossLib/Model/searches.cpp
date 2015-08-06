#include "searches.h"
#include <QSettings>
#include <QDebug>
#include <QDataStream>

Q_DECLARE_METATYPE(Search)

QDataStream& operator<<(QDataStream& out, const Search& s) {
    out << s.search() << s.results();
    return out;
}

QDataStream& operator>>(QDataStream& in, Search& s) {
    QString search;
    in >> search;
    s.setSearch(search);
    int results;
    in >> results;
    s.setResults(results);
    return in;
}

RecentSearchesStorage::RecentSearchesStorage(QObject *parent):
QObject(parent)
{
}

const QList<Search> RecentSearchesStorage::getRecentSearches() const
{

    QSettings settings;
    QList<Search> searches;
    QList <QVariant> storedSearches = settings.value("recentSearches").toList();
    for(auto i=storedSearches.begin(); i!=storedSearches.end(); i++){
        searches.push_back(Search(i->value<Search>()));
    //qDebug() << "List:"<<i->value<Search>().search();
    }
    return searches;
}

void RecentSearchesStorage::addNewSearch(Search search)
{
    QSettings settings;
    QList<QVariant> storageList =  settings.value("recentSearches").toList();
    for(auto it = storageList.begin(); it!=storageList.end();it++)
        if(it->value<Search>().search() == search.search())
            return;
    if(storageList.count()==4)
      storageList.erase(storageList.begin());
    storageList.push_back(QVariant::fromValue(Search(search.search(),search.results())));
    settings.setValue("recentSearches", storageList);
    emit recentSearchesChanged();
    qDebug() << "Emit recentSearchesChanged--2";
}

void RecentSearchesStorage::deleteAllRecentSearches()
{
    QSettings settings;
    QList<QVariant> storageList =  settings.value("recentSearches").toList();
    if(storageList.count()==0)
        return;
    storageList.clear();
    settings.setValue("recentSearches", storageList);
    emit recentSearchesChanged();
}


RecentSearchesModel::RecentSearchesModel(QObject *parent)
    : QAbstractListModel(parent)
{
    reloadSearchesFromStorage();
}

void RecentSearchesModel::addSearch(const Search &search)
{
    beginInsertRows(QModelIndex(), rowCount(), rowCount());
    m_searches << search;
    endInsertRows();
}

void RecentSearchesModel::reloadSearchesFromStorage()
{
    qDebug() << "in reloadSearchesFromStorage";
    RecentSearchesStorage searchesStorage;
    clearAllDisplayedSearches();
    QList<Search> newSearches = searchesStorage.getRecentSearches();
    for(auto i=newSearches.constBegin();i!=newSearches.constEnd(); i++){
    beginInsertRows(QModelIndex(), rowCount(), rowCount());
        m_searches.append(*i);
    endInsertRows();
    }

}

void RecentSearchesModel::clearAllDisplayedSearches()
{
  beginResetModel();
  m_searches.erase(m_searches.begin(), m_searches.end());
  endResetModel();
}

int RecentSearchesModel::rowCount(const QModelIndex & parent) const {
    Q_UNUSED(parent);
    return m_searches.count();
}

QVariant RecentSearchesModel::data(const QModelIndex & index, int role) const {
    if (index.row() < 0 || index.row() >= m_searches.count())
        return QVariant();

    const Search &search = m_searches[index.row()];
    if (role == searchRole)
        return search.search();
    else if (role == resultsRole)
        return search.results();
    return QVariant();
}

QHash<int, QByteArray> RecentSearchesModel::roleNames() const {
    QHash<int, QByteArray> roles;
    roles[searchRole] = "search";
    roles[resultsRole] = "results";
    return roles;
}

Search::Search()
{
//    m_search = QString("");
    m_results = 0;
}

Search::Search(QString search, int results) :
    m_search(search), m_results(results)
{
}

QString Search::search() const
{
    return m_search;
}

void Search::setSearch(const QString &search)
{
    m_search = search;
}
int Search::results() const
{
    return m_results;
}

void Search::setResults(const int &results)
{
    m_results = results;
}

