#ifndef POSITION_H
#define POSITION_H

#include <QObject>
#include <QGeoCoordinate>
#include <QGeoPositionInfoSource>
#include <QString>

class Position : public QObject
{
    Q_OBJECT
public:
    Position(QObject *parent = 0);
public slots:
    void startPositionRequest();
    void positionUpdated(QGeoPositionInfo);
    void positionError(QGeoPositionInfoSource::Error);
    void positionError();
signals:
    void fetchPosition(QString position);
    void fetchPositionError();
private:
    QGeoPositionInfoSource* m_positionSource;
};

#endif // POSITION_H
