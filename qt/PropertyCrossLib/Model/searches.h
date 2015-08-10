#ifndef RECENTSEARCHES_H
#define RECENTSEARCHES_H

#include <QAbstractListModel>
#include <QHash>
#include <QStringList>
#include <QDataStream>


/** Describes a search: name of the location and hits we got for it */
class Search {
public:
    Search();
    Search(QString search, int results);
    QString search() const;
    void setSearch(const QString &search);

    int results() const;
    void setResults(const int &results);
    bool operator==(const Search& s) const {
      return (this->search()==s.search())&&(this->results()==s.results());
    }

private:
    QString m_search;
    int m_results;
};


///Output operator for search
QDataStream& operator<<(QDataStream& out, const Search& s);
///Input operator for search
QDataStream& operator>>(QDataStream& in, Search& s);

/**
 * Persistent Storage of searches - holds the last four searches
 */
class RecentSearchesStorage : public QObject
{
    Q_OBJECT
public:
    RecentSearchesStorage(QObject *parent = 0);
    /** Get the four most recent searches from the persistent storage */
    const QList<Search> getRecentSearches() const;
signals:
    /** Emitted when one of the four recent searches changed */
    void recentSearchesChanged();
public slots:
    /** Add a a new search to the persistent storage
     * param search Search to be added
     */
    void addNewSearch(Search search);
    /** Delete all searches from the persistent storage */
    void deleteAllRecentSearches();
private:
};

/** Model of the recent Searches - to be used in e.g. a ListView */
class RecentSearchesModel : public QAbstractListModel {
    Q_OBJECT
public:
    enum PropertyRoles {
        searchRole = Qt::UserRole + 1,
        resultsRole
    };

    RecentSearchesModel(QObject *parent = 0);

    int rowCount(const QModelIndex & parent = QModelIndex()) const;

    QVariant data(const QModelIndex & index, int role = Qt::DisplayRole) const;

public slots:
    void addSearch(const Search &search);
    void reloadSearchesFromStorage();
    void clearAllDisplayedSearches();

protected:
    QHash<int, QByteArray> roleNames() const;
private:
    QList<Search> m_searches;
};


#endif // RECENTSEARCHES_H
