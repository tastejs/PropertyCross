#ifndef JSONHANDLER_H
#define JSONHANDLER_H

#include "property.h"
#include "location.h"
#include "searches.h"
#include "ipropertyhandler.h"

#include <QObject>
#include <QtNetwork/QNetworkAccessManager>
#include <QSharedPointer>
#include <QList>
#include <QUrl>
#include <QTimer>

class QNetworkReply;

class JsonHandler : public QObject, public IPropertyHandler {
    Q_OBJECT
public:
    JsonHandler(QObject *parent = 0);
    virtual ~JsonHandler () {
        //temp fix to reset manager on exit
        m_manager.reset();
    }

public slots:
    /** Get a list of properties from a location-string, e.g. "London"
    @param location the location for which to search
    @param page which page of the string to get
    @return a pointer to a list of the properties
    */
    void getFromString(QString location, int page);
    void getFromString(QString location);
    /** Get a list of properties from a location-coordinate
    @param location the location for which to search
    @param page which page of the string to get
    @return a pointer to a list of the properties
    */
    void getFromLocation(float latitude, float longtitude, int page);
    /** Get a list of location proposals from a string
    @param location the location for which to search
    @param page which page of the string to get
    @return a pointer to a list of the properties
    */
    void getListedLocations(QString location, int page);
protected slots:
    /** Start a query on the netopia Server with the given URL
     * param url the URL to use for the query
     */
void startRequest(QUrl url);
/** To be called when the Request has finished */
void replyFinished(QNetworkReply* reply);
/** To be called when a timeout occured */
void networkTimeout();

signals:
/** Emitted if the properties from a request are ready (e.g. to be displayed) */
    void propertiesReady(QSharedPointer<QList<Property*> >);
    /** Emitted if the Search had an ambiguous location and a list of probable locations was returned */
    void locationsReady(QSharedPointer<QList<Location*> >);
    /** Emitted if all went ok with a search */
    void successfullySearched(Search location);
    /** Emitted if all went ok with a search */
    void successfullySearched(QString location, int page, int totalResults);
    /** Emitted if there was a problem with a search and it couldn't been finished properly */
    void errorRetrievingRequest();
    /** Emitted if the request took to long to finish */
     void requestTimedOut();
private:
    static QSharedPointer<QNetworkAccessManager> m_manager;
    QTimer m_timer;

};

#endif // JSONHANDLER_H
