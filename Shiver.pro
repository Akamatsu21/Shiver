QT -= gui
QT += qml

CONFIG += c++17 console
CONFIG -= app_bundle

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
        Models/enemy.cpp \
        Models/event.cpp \
        Models/gamevariables.cpp \
        Models/player.cpp \
        System/commandparser.cpp \
        System/console.cpp \
        System/savestatemanager.cpp \
        System/scriptingengine.cpp \
        Utils/utils.cpp \
        game.cpp \
        main.cpp

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

HEADERS += \
    Enums/command.h \
    Enums/direction.h \
    Enums/elixirtype.h \
    Models/choice.h \
    Models/combatstate.h \
    Models/enemy.h \
    Models/event.h \
    Models/gamestate.h \
    Models/gamevariables.h \
    Models/player.h \
    System/commandparser.h \
    System/console.h \
    System/savestatemanager.h \
    System/scriptingengine.h \
    Utils/utils.h \
    game.h

RESOURCES += \
    Resources/resources.qrc

DISTFILES += \
    Resources/events.jsm
