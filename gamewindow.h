#ifndef GAMEWINDOW_H
#define GAMEWINDOW_H

#include <QObject>

#include "game.h"
#include "Enums/inputmode.h"

class Console;
class GameVariables;
class Player;
class QCoreApplication;
class QQmlApplicationEngine;
class ScriptingEngine;

class GameWindow: public QObject
{
    Q_OBJECT

    Game* _game;
    Console& _console;

    InputMode _input_mode;
    InputMode _prev_mode;

    bool _interrupted;
    int _interrupt_id;
    bool _interrupt_new_room;

    void updateInputState();

private slots:
    void onUserInputReceived(const QString& user_input);
    void onUserKeyReceived();

    void onNextHelpPage();
    void onPreviousHelpPage();
    void onLeaveHelp();

    void onGameOver();
    void onRedirect(int id, bool new_room);

public:
    GameWindow(QCoreApplication* parent, Console& console, QQmlApplicationEngine& qml_engine);

    void startGame();

};

#endif // GAMEWINDOW_H
