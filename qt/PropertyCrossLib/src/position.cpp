#include "position.h"
#include <QGeoCoordinate>
#include <QDebug>
#include <QString>
const static double TIMEOUT = 5000;
Position::Position(QObject* parent) :
    QObject(parent)
{
    connect(&m_timer, SIGNAL(timeout()), this, SLOT(positionTimeout()));
}

void Position::startPositionRequest()
{
    m_positionSource = QGeoPositionInfoSource::createDefaultSource(this);
    if (m_positionSource) {
        connect(m_positionSource, SIGNAL(positionUpdated(QGeoPositionInfo)),
                this, SLOT(positionUpdated(QGeoPositionInfo)));
        connect(m_positionSource, SIGNAL(error(QGeoPositionInfoSource::Error)),
                this, SLOT(positionError(QGeoPositionInfoSource::Error)));
        //requestUpdate() does not seem to work properly - using startUpdates with timer instead
        //        connect(m_positionSource, SIGNAL(updateTimeout()),
        //                this, SLOT(positionTimeout()));
        //m_positionSource->requestUpdate(TIMEOUT);
        m_positionSource->startUpdates();
        m_timer.setSingleShot(true);
        m_timer.setInterval(TIMEOUT);
        m_timer.start();
    } else {
        emit positionError(QGeoPositionInfoSource::Error());
    }
}

void Position::positionUpdated(QGeoPositionInfo position)
{
    m_timer.stop();
    m_positionSource->stopUpdates();
    emit fetchPosition(QString("coord_"+QString::number(position.coordinate().latitude(),'f')+","+QString::number(position.coordinate().longitude(),'f')));
    qDebug()<<"Got coordinate:"<<QString::number(position.coordinate().latitude(),'f');
}

void Position::positionError(QGeoPositionInfoSource::Error error)
{
    m_timer.stop();
    m_positionSource->stopUpdates();
    emit fetchPositionError();
    qDebug() << "Error in getting Position from platform"<<error;
}

void Position::positionTimeout()
{
    m_positionSource->stopUpdates();
    emit fetchPositionErrorTimeout();
    qDebug() << "Error in getting Position from platform(timeOut)";
}

