#ifndef RECENTSEARCHES_H
#define RECENTSEARCHES_H

#include <QAbstractListModel>
#include <QHash>
#include <QStringList>



class Search {
public:
    Search();
    Search(QString search, int results);
    QString search() const;
    void setSearch(const QString &search);

    int results() const;
    void setResults(const int &results);

private:
    QString m_search;
    int m_results;
};

class RecentSearchesStorage : public QObject
{
    Q_OBJECT
public:
    RecentSearchesStorage(QObject *parent = 0);
    const QList<Search> getRecentSearches() const;
signals:
    void recentSearchesChanged();
public slots:
    void addNewSearch(Search search);
    void deleteAllRecentSearches();
    private:
};

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
