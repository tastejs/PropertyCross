#ifndef JSONHANDLER_H
#define JSONHANDLER_H

#include <QObject>
#include "property.h"
#include "location.h"
#include "../include/ipropertyhandler.h"

#include <QtNetwork/QNetworkAccessManager>
#include <QSharedPointer>
#include <QList>
#include <QUrl>

class QNetworkReply;

class JsonHandler : public QObject, public IPropertyHandler {
    Q_OBJECT
public:
    JsonHandler(QObject *parent = 0);
    virtual ~JsonHandler () {
        //temp fix to reset manager on exit
        manager.reset();
    }

public slots:
    /** Get a list of properties from a location-string, e.g. "London"
    @param location the location for which to search
    @param page which page of the string to get
    @return a pointer to a list of the properties
    */
    void getFromString(QString location, int page);
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
    //TODO not working - needed?
    void getListedLocations(QString location, int page);

void startRequest(QUrl url);
void replyFinished(QNetworkReply* reply);

signals:
    void propertiesReady(QSharedPointer<QList<Property> >);
    void locationsReady(QSharedPointer<QList<Location> >);
    void errorRetrievingRequest();
private:
    static QSharedPointer<QNetworkAccessManager> manager;

};

#endif // JSONHANDLER_H
