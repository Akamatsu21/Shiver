QT -= gui
QT += qml

CONFIG += c++17 console
CONFIG -= app_bundle

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
        commandparser.cpp \
        console.cpp \
        enemy.cpp \
        event.cpp \
        game.cpp \
        main.cpp \
        player.cpp \
        scriptingengine.cpp \
        utils.cpp

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

HEADERS += \
    command.h \
    commandparser.h \
    console.h \
    direction.h \
    enemy.h \
    event.h \
    game.h \
    player.h \
    scriptingengine.h \
    utils.h

RESOURCES += \
    resources.qrc
