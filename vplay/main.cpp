#include <VPApplication>
#include <QApplication>
#include <QQmlApplicationEngine>


int main(int argc, char *argv[])
{
  // Init V-Play application
  QApplication app(argc, argv);

  VPApplication vplay;
  vplay.setPreservePlatformFonts(true);

  QQmlApplicationEngine engine;
  vplay.initialize(&engine);

  // Load main QML file
  vplay.setMainQmlFileName(QStringLiteral("qml/PropertyCrossMain.qml"));
  engine.load(QUrl(vplay.mainQmlFileName()));

  return app.exec();
}
