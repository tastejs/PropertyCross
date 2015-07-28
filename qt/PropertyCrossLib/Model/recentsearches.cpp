#include "recentsearches.h"
#include <QSettings>
#include <QDebug>

RecentSearchesStorage::RecentSearchesStorage(QObject *parent):
QObject(parent)
{
}

const QList<Search> RecentSearchesStorage::getRecentSearches() const
{

    QSettings settings;
    QList<Search> searches;
    QMap <QString, QVariant> storedSearches = settings.value("recentSearches").toMap();
    for(auto i=storedSearches.begin(); i!=storedSearches.end(); i++){
        searches.append(Search(i.key(),i.value().toInt()));
    }
    return searches;
}

void RecentSearchesStorage::addNewSearch(Search search)
{

    QSettings settings;
    QMap<QString, QVariant> storageList =  settings.value("recentSearches").toMap();
    if(storageList.contains(search.search()))
        return;
    storageList.insert(search.search(),search.results());
    settings.setValue("recentSearches", storageList);
//    QList<Search> list = getRecentSearches();
    emit recentSearchesChanged();
    qDebug() << "Emit recentSearchesChanged";
}

void RecentSearchesStorage::deleteAllRecentSearches()
{
    QSettings settings;
    QMap<QString, QVariant> storageList =  settings.value("recentSearches").toMap();
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
    m_searches.erase(m_searches.begin(), m_searches.end());
    QList<Search> newSearches = searchesStorage.getRecentSearches();
    for(auto i=newSearches.constBegin();i!=newSearches.constEnd(); i++){
    beginInsertRows(QModelIndex(), rowCount(), rowCount());
        m_searches.append(*i);
    endInsertRows();
    }

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

