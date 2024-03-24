QT += quick

CONFIG += c++17

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
        Models/callback.cpp \
        Models/condition.cpp \
        Models/enemy.cpp \
        Models/event.cpp \
        Models/gamevariables.cpp \
        Models/player.cpp \
        Models/scriptapi.cpp \
        System/commandparser.cpp \
        System/console.cpp \
        System/savestatemanager.cpp \
        System/scriptingengine.cpp \
        Utils/utils.cpp \
        game.cpp \
        gamewindow.cpp \
        main.cpp

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

HEADERS += \
    Enums/callbacktiming.h \
    Enums/command.h \
    Enums/direction.h \
    Enums/inputmode.h \
    Enums/playerstat.h \
    Models/callback.h \
    Models/choice.h \
    Models/combatstate.h \
    Models/condition.h \
    Models/enemy.h \
    Models/event.h \
    Models/gamestate.h \
    Models/gamevariables.h \
    Models/player.h \
    Models/quiz.h \
    Models/scriptapi.h \
    Models/statmodifier.h \
    Models/useroption.h \
    System/commandparser.h \
    System/console.h \
    System/savestatemanager.h \
    System/scriptingengine.h \
    Utils/utils.h \
    game.h \
    gamewindow.h

RESOURCES += \
    Resources/resources.qrc

# Additional import path used to resolve QML modules in Qt Creator's code model
QML_IMPORT_PATH =

# Additional import path used to resolve QML modules just for Qt Quick Designer
QML_DESIGNER_IMPORT_PATH =
