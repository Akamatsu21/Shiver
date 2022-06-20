#ifndef GAME_H
#define GAME_H

#include <QObject>

#include "console.h"
#include "event.h"

class Player;
class ScriptingEngine;
class QCoreApplication;

class Game: public QObject
{
    Q_OBJECT

    Console _console;
    Event _current_event;
    ScriptingEngine* _scripting_engine;
    Player* _player;

    // Game state.
    bool _running;

    struct CombatState
    {
        bool _combat_in_progress;
        int _combat_round;
        int _enemy_score;
        int _player_score;
    } _combat_state;

    void displayCurrentEvent();
    void displayCurrentEnemy();

    void updateCurrentEvent(int id);

    void checkForDeath();
    void handleCombatRound();

public:
    explicit Game(QCoreApplication* parent);

    void gameLoop();

signals:
    void gameOver();

};

#endif // GAME_H
