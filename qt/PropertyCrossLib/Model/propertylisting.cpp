#include "propertylisting.h"
#include "property.h"
#include <QList>
#include <QDebug>
#include <QSharedPointer>

PropertyListing::PropertyListing(QObject *parent):
QObject(parent)
{

}

QQmlListProperty<Property> PropertyListing::properties()
{
    return QQmlListProperty<Property>(this, m_properties);
}
int PropertyListing::propertyCount() const
{
    return m_properties.count();
}
Property *PropertyListing::properties(int index) const
{
return m_properties.at(index);
}

   void PropertyListing::addToListing(QSharedPointer<QList<Property*> > ptrList) {
      qDebug() << QString("Received list") ;
//      m_properties = ptrList.data();
      for(int i=0; i<ptrList->size(); i++){
      m_properties.append(ptrList->at(i));
      emit addProperty(ptrList->at(i)->getTitle(), QString::number(ptrList->at(i)->getPrice()), ptrList->at(i)->getImageUrl());
      }
      emit ready();
   }
