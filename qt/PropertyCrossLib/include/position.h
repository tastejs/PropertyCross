#ifndef POSITION_H
#define POSITION_H

#include <QObject>
#include <QGeoCoordinate>
#include <QGeoPositionInfoSource>
#include <QString>
#include <QTimer>

/** Class To Fetch the position form the platform */
class Position : public QObject
{
    Q_OBJECT
public:
    Position(QObject *parent = 0);
public slots:
    /** Start a new position request on the platform */
    void startPositionRequest();
    /** Method to be called when a request has successfully finished */
    void positionUpdated(QGeoPositionInfo);
    /** Method to be called when there was an error with a request */
    void positionError(QGeoPositionInfoSource::Error);
    /** Method to be called when the request timed out*/
    void positionTimeout();
signals:
    /** Emitted to let the UI know that we have received an position and it should now try to get the coordinates */
    void fetchPosition(QString position);
    /** Emitted to let the UI know that there was a problem with getting the position from the platform */
    void fetchPositionError();
    /** Emitted to let the UI know that we timed out trying to get a position from the platform */
    void fetchPositionErrorTimeout();
private:
    QGeoPositionInfoSource* m_positionSource;
    QTimer m_timer;
};

#endif // POSITION_H
