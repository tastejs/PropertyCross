# V-Play Apps Property Cross
CONFIG += v-play

# Add GPS
QT += location

# Source file folder shipped with app
qmlFolder.source = qml
DEPLOYMENTFOLDERS += qmlFolder

# App entry point
SOURCES += main.cpp

# Android configuration
android {
  ANDROID_PACKAGE_SOURCE_DIR = $$PWD/android
  OTHER_FILES += android/AndroidManifest.xml
}

# iOS configuration
ios {
  QMAKE_INFO_PLIST = ios/Project-Info.plist
  OTHER_FILES += $$QMAKE_INFO_PLIST
}
