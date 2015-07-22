#include "jsonhandler.h"


#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>
#include <QSharedPointer>
#include <QtNetwork/QNetworkAccessManager>
#include <QtNetwork/QNetworkRequest>
#include <QtNetwork/QNetworkReply>
#include <QString>
#include "recentsearches.h"

QSharedPointer<QNetworkAccessManager> JsonHandler::manager  = QSharedPointer<QNetworkAccessManager>(0);
//example: http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&place_name=leeds
//options:
//place_name=leeds - listing from string
//centre_point=51.684183,-3.431481 -- geo listing
//place_name=newcr -- suggest locations
static const QString baseUrl = "http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy";



JsonHandler::JsonHandler(QObject *parent) :
    QObject(parent)
{
    if(manager.isNull()) {
        manager = QSharedPointer<QNetworkAccessManager>(new QNetworkAccessManager(this));
    }

    connect(manager.data(), SIGNAL(finished(QNetworkReply*)), this, SLOT(replyFinished(QNetworkReply*)));
}

void JsonHandler::getFromString(QString location, int page) {
    manager->get(QNetworkRequest(QUrl(baseUrl+"&place_name="+location+"&page="+page)));
}

void JsonHandler::getFromLocation(float latitude, float longtitude, int page) {
    manager->get(QNetworkRequest(QUrl(baseUrl+"&centre_point="+latitude+","+longtitude+"&page="+page)));
}

void JsonHandler::getListedLocations(QString location, int page) {
    manager->get(QNetworkRequest(QUrl(baseUrl+"&place_name="+location+"&page="+page)));
}

void JsonHandler::startRequest(QUrl url)
{
    if(manager.isNull())
        return;
    manager->get(QNetworkRequest(url));
}

void JsonHandler::replyFinished(QNetworkReply* reply)
{
    if(reply)
    {
        QJsonParseError error;
        QString replyString = (QString)reply->readAll();
        QJsonDocument doc = QJsonDocument::fromJson(replyString.toUtf8(), &error);

        QJsonValue responseValue = doc.object().value(QString("response"));
        int statusCode = responseValue.toObject().value(QString("application_response_code")).toString().toInt();
//        qDebug()<<"ResponceCode "<<statusCode;

        if((statusCode==100) || (statusCode==101) || (statusCode==110) )
        {
            QSharedPointer<QList<Property*> >  properties = QSharedPointer<QList<Property*> >(new QList<Property*>);
            QJsonValue listingsValue = responseValue.toObject().value(QString("listings"));

            QJsonArray listingsArray = listingsValue.toArray();

            for( int i = 0; i < listingsArray.size(); ++i )
            {
                QJsonObject arrayObject = listingsArray[i].toObject();
                Property* tmp = new Property(arrayObject);
                properties->append(tmp);
                //            qDebug() << objectValue.toString();
            }
            emit propertiesReady(properties);
            emit successfullySearched(Search(doc.object().value(QString("request")).toObject().value(QString("location")).toString(),doc.object().value(QString("response")).toObject().value(QString("total_results")).toInt()));
            //emit successfullySearched(test);
            qDebug() << "Emitt ready properties";
        }
        else if((statusCode==200) || (statusCode==201)) {
            QSharedPointer<QList<Location*> >  locations = QSharedPointer<QList<Location*> >(new QList<Location*>);
            qDebug()<<"In Location Listings";
            QJsonValue listingsValue = responseValue.toObject().value(QString("locations"));
            QJsonArray listingsArray = listingsValue.toArray();
            for( int i = 0; i < listingsArray.size(); ++i )
            {
                QJsonObject arrayObject = listingsArray[i].toObject();
                Location* tmp = new Location(arrayObject);
                locations->append(tmp);
                //            qDebug() << objectValue.toString();
            }
            emit locationsReady(locations);
            qDebug() << "Emitting ready locations";
        } else {
            qDebug() << "Emitting error retrieving";
            emit errorRetrievingRequest();
        }
    }
}
