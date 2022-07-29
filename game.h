#ifndef GAME_H
#define GAME_H

#include <QObject>

#include "Models/event.h"
#include "Models/combatstate.h"
#include "System/console.h"

class Player;
class ScriptingEngine;
class QCoreApplication;

class Game: public QObject
{
    Q_OBJECT

    Console _console;
    ScriptingEngine* _scripting_engine;

    // Game data.
    Event _current_event;
    std::vector<std::string> _help_pages;
    Player* _player;

    // Game state.
    bool _running;
    int _current_help_page;
    CombatState _combat_state;

    void displayCombatStatus();
    void displayCurrentEvent();
    void displayCurrentEnemy();
    void displayPlayerStats();

    void resolveDamage(bool player_win, int damage);
    bool resolveYesNoQuestion();
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
