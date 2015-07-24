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
    void getPosition();
    void positionUpdated(QGeoPositionInfo);
    void positionError(QGeoPositionInfoSource::Error);
signals:
    void getPosition(QString position);
    void getPositionError();
private:
    QGeoPositionInfoSource* m_positionSource;
};

#endif // POSITION_H
